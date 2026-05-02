import Redis from 'ioredis';

export class RedisClient {
  private static instance: RedisClient;
  private client: Redis;
  private isConnected: boolean = false;

  private constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.client = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('connect', () => {
      console.log('[Redis] Connected successfully');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      console.error('[Redis] Connection error:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      console.log('[Redis] Connection closed');
      this.isConnected = false;
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      console.warn('[Redis] Not connected, skipping cache read');
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('[Redis] Error getting key:', key, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected) {
      console.warn('[Redis] Not connected, skipping cache write');
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      console.error('[Redis] Error setting key:', key, error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('[Redis] Error deleting key:', key, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('[Redis] Error checking key:', key, error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
        console.log(`[Redis] Invalidated ${keys.length} keys matching: ${pattern}`);
      }
    } catch (error) {
      console.error('[Redis] Error invalidating pattern:', pattern, error);
    }
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}

// Cache decorator
export function Cacheable(ttlSeconds: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const redis = RedisClient.getInstance();
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      // Try to get from cache
      const cached = await redis.get(cacheKey);
      if (cached !== null) {
        console.log(`[Cache] HIT: ${cacheKey}`);
        return cached;
      }

      // Execute original method
      console.log(`[Cache] MISS: ${cacheKey}`);
      const result = await originalMethod.apply(this, args);

      // Store in cache
      await redis.set(cacheKey, result, ttlSeconds);

      return result;
    };

    return descriptor;
  };
}

export const redis = RedisClient.getInstance();
