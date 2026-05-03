import { RabbitMQClient } from './rabbitmq';
import { RedisClient } from './redis';
import { ConsulClient } from './consul';

export class InfrastructureManager {
  private static instance: InfrastructureManager;
  private rabbitmq: RabbitMQClient | null = null;
  private redis: RedisClient | null = null;
  private consul: ConsulClient | null = null;

  private constructor() {}

  static getInstance(): InfrastructureManager {
    if (!InfrastructureManager.instance) {
      InfrastructureManager.instance = new InfrastructureManager();
    }
    return InfrastructureManager.instance;
  }

  async initialize(serviceName: string, port: number): Promise<void> {
    console.log(`[${serviceName}] Initializing infrastructure...`);

    // Initialize RabbitMQ if URL is provided
    if (process.env.RABBITMQ_URL) {
      try {
        this.rabbitmq = new RabbitMQClient(process.env.RABBITMQ_URL);
        await this.rabbitmq.connect();
        console.log(`[${serviceName}] ✅ RabbitMQ connected`);
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
        this.redis = new RedisClient(process.env.REDIS_URL);
        await this.redis.connect();
        console.log(`[${serviceName}] ✅ Redis connected`);
      } catch (error) {
        console.warn(`[${serviceName}] ⚠️  Redis not available:`, error.message);
        this.redis = null;
      }
    } else {
      console.log(`[${serviceName}] ⚠️  Redis disabled (REDIS_URL not set)`);
    }

    // Initialize Consul if host is provided
    if (process.env.CONSUL_HOST) {
      try {
        this.consul = new ConsulClient(process.env.CONSUL_HOST);
        await this.consul.registerService({
          name: serviceName,
          port: port,
          tags: ['api', 'microservice'],
          check: {
            http: `http://localhost:${port}/health`,
            interval: '10s',
            timeout: '5s'
          }
        });
        console.log(`[${serviceName}] ✅ Consul registered`);
      } catch (error) {
        console.warn(`[${serviceName}] ⚠️  Consul not available:`, error.message);
        this.consul = null;
      }
    } else {
      console.log(`[${serviceName}] ⚠️  Consul disabled (CONSUL_HOST not set)`);
    }

    console.log(`[${serviceName}] Infrastructure initialization complete`);
  }

  getRabbitMQ(): RabbitMQClient | null {
    return this.rabbitmq;
  }

  getRedis(): RedisClient | null {
    return this.redis;
  }

  getConsul(): ConsulClient | null {
    return this.consul;
  }

  isRabbitMQAvailable(): boolean {
    return this.rabbitmq !== null;
  }

  isRedisAvailable(): boolean {
    return this.redis !== null;
  }

  isConsulAvailable(): boolean {
    return this.consul !== null;
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down infrastructure...');

    if (this.rabbitmq) {
      await this.rabbitmq.disconnect();
    }

    if (this.redis) {
      await this.redis.disconnect();
    }

    if (this.consul) {
      await this.consul.deregisterService();
    }

    console.log('Infrastructure shutdown complete');
  }
}

export const infrastructure = InfrastructureManager.getInstance();
