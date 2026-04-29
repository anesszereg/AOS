import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { EventEmitter } from 'events';
import { DomainEvent, EventType } from '../events';

export class RabbitMQClient extends EventEmitter {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly url: string;
  private readonly exchangeName: string = 'food_delivery_events';
  private readonly deadLetterExchange: string = 'food_delivery_dlx';
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 10;

  constructor(url: string = process.env.RABBITMQ_URL || 'amqp://localhost:5672') {
    super();
    this.url = url;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true,
      });

      await this.channel.assertExchange(this.deadLetterExchange, 'topic', {
        durable: true,
      });

      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.handleConnectionError();
      });

      this.connection.on('close', () => {
        console.warn('RabbitMQ connection closed');
        this.handleConnectionError();
      });

      this.reconnectAttempts = 0;
      console.log('Connected to RabbitMQ');
      this.emit('connected');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      this.handleConnectionError();
    }
  }

  private async handleConnectionError(): Promise<void> {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting to RabbitMQ in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('error', new Error('Failed to connect to RabbitMQ'));
    }
  }

  async publish(event: DomainEvent): Promise<boolean> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    try {
      const routingKey = event.type;
      const message = Buffer.from(JSON.stringify(event));

      const published = this.channel.publish(
        this.exchangeName,
        routingKey,
        message,
        {
          persistent: true,
          messageId: event.id,
          timestamp: event.timestamp.getTime(),
          headers: {
            correlationId: event.correlationId,
          },
        }
      );

      if (!published) {
        console.warn('Message not published, buffer full');
        await new Promise((resolve) => this.channel!.once('drain', resolve));
      }

      return true;
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  async subscribe(
    queueName: string,
    eventTypes: EventType[],
    handler: (event: DomainEvent) => Promise<void>,
    options: {
      prefetchCount?: number;
      deadLetterQueue?: boolean;
    } = {}
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const { prefetchCount = 10, deadLetterQueue = true } = options;

    const queueOptions: any = {
      durable: true,
      arguments: {},
    };

    if (deadLetterQueue) {
      queueOptions.arguments['x-dead-letter-exchange'] = this.deadLetterExchange;
      queueOptions.arguments['x-dead-letter-routing-key'] = `${queueName}.dlq`;
    }

    await this.channel.assertQueue(queueName, queueOptions);

    if (deadLetterQueue) {
      const dlqName = `${queueName}.dlq`;
      await this.channel.assertQueue(dlqName, { durable: true });
      await this.channel.bindQueue(dlqName, this.deadLetterExchange, `${queueName}.dlq`);
    }

    for (const eventType of eventTypes) {
      await this.channel.bindQueue(queueName, this.exchangeName, eventType);
    }

    await this.channel.prefetch(prefetchCount);

    await this.channel.consume(
      queueName,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const event: DomainEvent = JSON.parse(msg.content.toString());
          
          const messageId = msg.properties.messageId;
          if (await this.isDuplicate(messageId)) {
            console.log(`Duplicate message detected: ${messageId}`);
            this.channel!.ack(msg);
            return;
          }

          await handler(event);
          
          await this.markAsProcessed(messageId);
          this.channel!.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          
          const retryCount = (msg.properties.headers['x-retry-count'] || 0) + 1;
          const maxRetries = 3;

          if (retryCount <= maxRetries) {
            this.channel!.nack(msg, false, false);
          } else {
            console.error(`Max retries exceeded for message: ${msg.properties.messageId}`);
            this.channel!.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );

    console.log(`Subscribed to queue: ${queueName}`);
  }

  private processedMessages: Set<string> = new Set();
  private readonly maxProcessedMessages: number = 10000;

  private async isDuplicate(messageId: string): Promise<boolean> {
    return this.processedMessages.has(messageId);
  }

  private async markAsProcessed(messageId: string): Promise<void> {
    this.processedMessages.add(messageId);
    
    if (this.processedMessages.size > this.maxProcessedMessages) {
      const toDelete = Array.from(this.processedMessages).slice(0, 1000);
      toDelete.forEach((id) => this.processedMessages.delete(id));
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

export const createRabbitMQClient = (): RabbitMQClient => {
  return new RabbitMQClient();
};
