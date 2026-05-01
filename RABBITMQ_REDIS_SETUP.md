# 🐰 RabbitMQ & 📦 Redis Configuration Guide

## Local Development (Docker Compose)

### 1. Start RabbitMQ and Redis

```bash
cd "/Users/mac/Desktop/AOS orriject/food-delivery-platform"

# Start RabbitMQ and Redis
docker compose up -d rabbitmq redis

# Check status
docker compose ps
```

### 2. Access RabbitMQ Management UI

- **URL**: http://localhost:15672
- **Username**: `admin`
- **Password**: `admin123`

### 3. Test Redis

```bash
# Connect to Redis
docker exec -it food-delivery-redis redis-cli

# Test commands
> PING
PONG
> SET test "Hello Redis"
OK
> GET test
"Hello Redis"
> exit
```

---

## Environment Variables Configuration

### Update your `.env` file:

```bash
# RabbitMQ Configuration
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
RABBITMQ_VHOST=/

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

---

## Service Configuration

### Each microservice needs to connect to RabbitMQ and Redis:

#### Example: auth-service configuration

Create/update `services/auth-service/src/config/rabbitmq.ts`:

```typescript
import amqp from 'amqplib';

class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672';
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      
      console.log('✅ Connected to RabbitMQ');
      
      // Declare exchanges
      await this.channel.assertExchange('user_events', 'topic', { durable: true });
      await this.channel.assertExchange('order_events', 'topic', { durable: true });
      
      return this.channel;
    } catch (error) {
      console.error('❌ RabbitMQ connection error:', error);
      throw error;
    }
  }

  async publish(exchange: string, routingKey: string, message: any) {
    if (!this.channel) {
      await this.connect();
    }
    
    this.channel!.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  async subscribe(exchange: string, routingKey: string, callback: (msg: any) => void) {
    if (!this.channel) {
      await this.connect();
    }

    const queue = await this.channel!.assertQueue('', { exclusive: true });
    await this.channel!.bindQueue(queue.queue, exchange, routingKey);

    this.channel!.consume(queue.queue, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        this.channel!.ack(msg);
      }
    });
  }
}

export default new RabbitMQService();
```

#### Example: Redis configuration

Create/update `services/auth-service/src/config/redis.ts`:

```typescript
import { createClient } from 'redis';

class RedisService {
  private client: any;

  async connect() {
    try {
      const url = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({ url });
      
      this.client.on('error', (err: any) => {
        console.error('❌ Redis error:', err);
      });

      await this.client.connect();
      console.log('✅ Connected to Redis');
      
      return this.client;
    } catch (error) {
      console.error('❌ Redis connection error:', error);
      throw error;
    }
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: string, expiryInSeconds?: number) {
    if (expiryInSeconds) {
      return await this.client.setEx(key, expiryInSeconds, value);
    }
    return await this.client.set(key, value);
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  async exists(key: string) {
    return await this.client.exists(key);
  }
}

export default new RedisService();
```

---

## Free Cloud Setup (Production)

### 1. CloudAMQP (RabbitMQ) - FREE

**Steps:**
1. Go to https://www.cloudamqp.com
2. Sign up (no credit card required)
3. Create instance:
   - Plan: **Little Lemur (FREE)**
   - Name: `food-delivery-queue`
   - Region: Choose closest
4. Copy AMQP URL:
   ```
   amqps://user:pass@host.cloudamqp.com/vhost
   ```

**Free Tier Limits:**
- ✅ 1 million messages/month
- ✅ Shared cluster
- ✅ 20 connections
- ✅ Perfect for development/small apps

**Update .env:**
```bash
RABBITMQ_URL=amqps://user:pass@host.cloudamqp.com/vhost
```

---

### 2. Upstash (Redis) - FREE

**Steps:**
1. Go to https://upstash.com
2. Sign up (no credit card required)
3. Create database:
   - Name: `food-delivery-cache`
   - Type: **Redis**
   - Region: Choose closest
4. Copy connection details:
   ```
   Endpoint: redis://default:pass@host.upstash.io:6379
   ```

**Free Tier Limits:**
- ✅ 10,000 commands/day
- ✅ Global edge caching
- ✅ TLS support
- ✅ Perfect for caching

**Update .env:**
```bash
REDIS_URL=redis://default:pass@host.upstash.io:6379
```

---

## Alternative: Render Redis & RabbitMQ

### Render Redis (FREE)

1. Go to https://render.com
2. New → Redis
3. Name: `food-delivery-cache`
4. Plan: **Free**
5. Copy Internal Redis URL

### Self-hosted RabbitMQ on Render

1. Create `Dockerfile.rabbitmq`:
```dockerfile
FROM rabbitmq:3.12-management-alpine

# Enable management plugin
RUN rabbitmq-plugins enable rabbitmq_management

# Expose ports
EXPOSE 5672 15672
```

2. Deploy as Web Service on Render

---

## Usage in Your Services

### Example: Publishing an Event

```typescript
// In order-service when order is created
import rabbitmq from './config/rabbitmq';

async function createOrder(orderData: any) {
  // Save order to database
  const order = await saveOrder(orderData);
  
  // Publish event to RabbitMQ
  await rabbitmq.publish(
    'order_events',
    'order.created',
    {
      orderId: order.id,
      userId: order.userId,
      restaurantId: order.restaurantId,
      total: order.total,
      timestamp: new Date()
    }
  );
  
  return order;
}
```

### Example: Subscribing to Events

```typescript
// In notification-service
import rabbitmq from './config/rabbitmq';

async function startListening() {
  await rabbitmq.subscribe(
    'order_events',
    'order.created',
    async (message) => {
      console.log('New order created:', message);
      
      // Send notification
      await sendNotification({
        userId: message.userId,
        title: 'Order Confirmed',
        body: `Your order #${message.orderId} has been confirmed!`
      });
    }
  );
}
```

### Example: Using Redis Cache

```typescript
// In restaurant-service
import redis from './config/redis';

async function getRestaurant(id: string) {
  // Try cache first
  const cached = await redis.get(`restaurant:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const restaurant = await db.query('SELECT * FROM restaurants WHERE id = $1', [id]);
  
  // Cache for 1 hour
  await redis.set(
    `restaurant:${id}`,
    JSON.stringify(restaurant),
    3600
  );
  
  return restaurant;
}
```

---

## Testing Your Setup

### Test RabbitMQ Connection

```bash
# Create test script: test-rabbitmq.js
cat > test-rabbitmq.js << 'EOF'
const amqp = require('amqplib');

async function test() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    console.log('✅ RabbitMQ connected successfully!');
    await connection.close();
  } catch (error) {
    console.error('❌ RabbitMQ connection failed:', error.message);
  }
}

test();
EOF

# Run test
node test-rabbitmq.js
```

### Test Redis Connection

```bash
# Create test script: test-redis.js
cat > test-redis.js << 'EOF'
const redis = require('redis');

async function test() {
  try {
    const client = redis.createClient({ url: process.env.REDIS_URL });
    await client.connect();
    await client.set('test', 'Hello Redis!');
    const value = await client.get('test');
    console.log('✅ Redis connected successfully! Value:', value);
    await client.quit();
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
  }
}

test();
EOF

# Run test
node test-redis.js
```

---

## Common Issues & Solutions

### RabbitMQ Connection Refused

**Problem**: `ECONNREFUSED localhost:5672`

**Solution**:
```bash
# Check if RabbitMQ is running
docker compose ps rabbitmq

# Restart RabbitMQ
docker compose restart rabbitmq

# Check logs
docker compose logs rabbitmq
```

### Redis Connection Timeout

**Problem**: `Connection timeout`

**Solution**:
```bash
# Check if Redis is running
docker compose ps redis

# Restart Redis
docker compose restart redis

# Test connection
docker exec -it food-delivery-redis redis-cli PING
```

### CloudAMQP SSL Issues

**Problem**: SSL certificate errors

**Solution**:
```typescript
// Use amqps:// instead of amqp://
const url = 'amqps://user:pass@host.cloudamqp.com/vhost';
```

---

## Monitoring

### RabbitMQ Monitoring

1. **Management UI**: http://localhost:15672
2. **Check Queues**: See message counts
3. **Check Connections**: Monitor active connections
4. **Check Exchanges**: Verify message routing

### Redis Monitoring

```bash
# Connect to Redis CLI
docker exec -it food-delivery-redis redis-cli

# Monitor commands in real-time
> MONITOR

# Get server info
> INFO

# Check memory usage
> INFO memory

# List all keys
> KEYS *
```

---

## Production Checklist

- [ ] Use environment variables for all credentials
- [ ] Enable SSL/TLS for connections
- [ ] Set up connection pooling
- [ ] Implement retry logic
- [ ] Monitor queue sizes
- [ ] Set up alerts for connection failures
- [ ] Use persistent messages for critical events
- [ ] Implement dead letter queues
- [ ] Set TTL on cache entries
- [ ] Monitor Redis memory usage

---

## Quick Commands

```bash
# Start RabbitMQ and Redis locally
docker compose up -d rabbitmq redis

# View RabbitMQ logs
docker compose logs -f rabbitmq

# View Redis logs
docker compose logs -f redis

# Stop services
docker compose stop rabbitmq redis

# Remove services
docker compose down rabbitmq redis
```

---

## Need Help?

- **RabbitMQ Docs**: https://www.rabbitmq.com/documentation.html
- **Redis Docs**: https://redis.io/documentation
- **CloudAMQP Support**: https://www.cloudamqp.com/support.html
- **Upstash Docs**: https://docs.upstash.com/redis

---

**Your RabbitMQ and Redis are ready to use!** 🎉
