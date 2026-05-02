import { RabbitMQClient } from '../utils/rabbitmq';
import { EventType, DomainEvent } from './event-types';
import { v4 as uuidv4 } from 'uuid';

export class EventBus {
  private static instance: EventBus;
  private rabbitMQ: RabbitMQClient;
  private readonly EXCHANGE_NAME = 'food-delivery-events';

  private constructor() {
    this.rabbitMQ = RabbitMQClient.getInstance();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public async publish(event: Omit<DomainEvent, 'eventId' | 'timestamp' | 'version'>): Promise<void> {
    const fullEvent: DomainEvent = {
      ...event,
      eventId: uuidv4(),
      timestamp: new Date(),
      version: '1.0',
    } as DomainEvent;

    await this.rabbitMQ.publish(
      this.EXCHANGE_NAME,
      event.eventType,
      fullEvent
    );

    console.log(`[EventBus] Published event: ${event.eventType}`, {
      eventId: fullEvent.eventId,
      correlationId: fullEvent.correlationId,
    });
  }

  public async subscribe(
    eventType: EventType,
    handler: (event: DomainEvent) => Promise<void>,
    queueName?: string
  ): Promise<void> {
    const queue = queueName || `${eventType}-${Date.now()}`;

    await this.rabbitMQ.subscribe(
      this.EXCHANGE_NAME,
      eventType,
      queue,
      async (message) => {
        try {
          const event = message as DomainEvent;
          console.log(`[EventBus] Received event: ${eventType}`, {
            eventId: event.eventId,
          });
          await handler(event);
        } catch (error) {
          console.error(`[EventBus] Error handling event ${eventType}:`, error);
          throw error; // Will go to DLQ
        }
      }
    );
  }

  public async close(): Promise<void> {
    await this.rabbitMQ.close();
  }
}

export const eventBus = EventBus.getInstance();
