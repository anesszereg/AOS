const amqp = require('amqplib');
const redis = require('redis');

class InfrastructureManager {
  constructor() {
    this.rabbitmq = null;
    this.rabbitmqConnection = null;
    this.rabbitmqChannel = null;
    this.redis = null;
  }

  static getInstance() {
    if (!InfrastructureManager.instance) {
      InfrastructureManager.instance = new InfrastructureManager();
    }
    return InfrastructureManager.instance;
  }

  async initialize(serviceName, port) {
    console.log(`[${serviceName}] Initializing infrastructure...`);

    // Initialize RabbitMQ if URL is provided
    if (process.env.RABBITMQ_URL) {
      try {
        // Add timeout to prevent hanging
        const connectPromise = amqp.connect(process.env.RABBITMQ_URL);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        );
        
        this.rabbitmqConnection = await Promise.race([connectPromise, timeoutPromise]);
        this.rabbitmqChannel = await this.rabbitmqConnection.createChannel();

        await this.rabbitmqChannel.assertExchange('food_delivery_events', 'topic', {
          durable: true,
        });

        this.rabbitmqConnection.on('error', (err) => {
          console.error(`[${serviceName}] RabbitMQ connection error:`, err.message);
        });

        this.rabbitmqConnection.on('close', () => {
          console.warn(`[${serviceName}] RabbitMQ connection closed`);
        });

        console.log(`[${serviceName}] ✅ RabbitMQ connected`);
        this.rabbitmq = this.rabbitmqChannel;
      } catch (error) {
        console.warn(`[${serviceName}] ⚠️  RabbitMQ not available:`, error.message);
        this.rabbitmq = null;
      }
    } else {
      console.log(`[${serviceName}] ⚠️  RabbitMQ disabled (RABBITMQ_URL not set)`);
    }

    // Initialize Redis if URL is provided
    if (process.env.REDIS_URL) {
      try {
        this.redis = redis.createClient({
          url: process.env.REDIS_URL,
          socket: {
            connectTimeout: 10000,
            reconnectStrategy: (retries) => {
              if (retries > 10) {
                return new Error('Redis reconnect limit exceeded');
              }
              return Math.min(retries * 100, 3000);
            }
          }
        });

        this.redis.on('error', (err) => {
          console.error(`[${serviceName}] Redis error:`, err.message);
        });

        this.redis.on('connect', () => {
          console.log(`[${serviceName}] ✅ Redis connected`);
        });

        // Add timeout to prevent hanging
        const connectPromise = this.redis.connect();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis connection timeout')), 10000)
        );
        
        await Promise.race([connectPromise, timeoutPromise]);
      } catch (error) {
        console.warn(`[${serviceName}] ⚠️  Redis not available:`, error.message);
        this.redis = null;
      }
    } else {
      console.log(`[${serviceName}] ⚠️  Redis disabled (REDIS_URL not set)`);
    }

    console.log(`[${serviceName}] Infrastructure initialization complete`);
  }

  getRabbitMQ() {
    return this.rabbitmq;
  }

  getRedis() {
    return this.redis;
  }

  isRabbitMQAvailable() {
    return this.rabbitmq !== null;
  }

  isRedisAvailable() {
    return this.redis !== null;
  }

  async publishEvent(exchange, routingKey, data) {
    if (this.rabbitmq) {
      try {
        this.rabbitmq.publish(
          exchange,
          routingKey,
          Buffer.from(JSON.stringify(data)),
          { persistent: true }
        );
        return true;
      } catch (error) {
        console.error('Failed to publish event:', error.message);
        return false;
      }
    }
    return false;
  }

  async cacheSet(key, value, ttl = 3600) {
    if (this.redis) {
      try {
        await this.redis.setEx(key, ttl, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Failed to set cache:', error.message);
        return false;
      }
    }
    return false;
  }

  async cacheGet(key) {
    if (this.redis) {
      try {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Failed to get cache:', error.message);
        return null;
      }
    }
    return null;
  }

  async cacheDel(key) {
    if (this.redis) {
      try {
        await this.redis.del(key);
        return true;
      } catch (error) {
        console.error('Failed to delete cache:', error.message);
        return false;
      }
    }
    return false;
  }

  async shutdown() {
    console.log('Shutting down infrastructure...');

    if (this.rabbitmqChannel) {
      try {
        await this.rabbitmqChannel.close();
      } catch (error) {
        console.error('Error closing RabbitMQ channel:', error.message);
      }
    }

    if (this.rabbitmqConnection) {
      try {
        await this.rabbitmqConnection.close();
      } catch (error) {
        console.error('Error closing RabbitMQ connection:', error.message);
      }
    }

    if (this.redis) {
      try {
        await this.redis.quit();
      } catch (error) {
        console.error('Error closing Redis connection:', error.message);
      }
    }

    console.log('Infrastructure shutdown complete');
  }
}

const infrastructure = InfrastructureManager.getInstance();

module.exports = { infrastructure, InfrastructureManager };
