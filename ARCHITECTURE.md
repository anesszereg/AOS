# 🏗️ System Architecture & Design

## System Design Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Port 3000)                                       │  │
│  │  - Customer Portal  - Restaurant Dashboard                        │  │
│  │  - Driver App       - Admin Panel                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Traefik (Port 80/443)                                            │  │
│  │  - Load Balancing    - SSL Termination                            │  │
│  │  - Rate Limiting     - Request Routing                            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SERVICE DISCOVERY LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Consul (Port 8500)                                               │  │
│  │  - Service Registry  - Health Checks  - KV Store                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────┬───────────┬───┴────┬──────────┬──────────┬─────────┐
        │           │           │        │          │          │         │
        ▼           ▼           ▼        ▼          ▼          ▼         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      MICROSERVICES LAYER                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │   Auth   │ │   User   │ │Restaurant│ │   Menu   │ │  Order   │    │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │    │
│  │  :3001   │ │  :3002   │ │  :3003   │ │  :3004   │ │  :3005   │    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │
│       │            │            │            │            │            │
│  ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐    │
│  │PostgreSQL│ │PostgreSQL│ │PostgreSQL│ │PostgreSQL│ │PostgreSQL│    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                                │
│  │ Payment  │ │ Delivery │ │Notification                               │
│  │ Service  │ │ Service  │ │ Service  │                                │
│  │  :3006   │ │  :3007   │ │  :3008   │                                │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘                                │
│       │            │            │                                       │
│  ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐                                │
│  │PostgreSQL│ │PostgreSQL│ │PostgreSQL│                                │
│  └──────────┘ └──────────┘ └──────────┘                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MESSAGE BROKER LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  RabbitMQ (Port 5672, 15672)                                      │  │
│  │  Exchanges:                                                        │  │
│  │  - order.events    - payment.events                               │  │
│  │  - delivery.events - notification.events                          │  │
│  │                                                                    │  │
│  │  Queues:                                                           │  │
│  │  - order.created   - payment.processed  - delivery.assigned       │  │
│  │  - order.updated   - payment.failed     - delivery.updated        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CACHING LAYER                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Redis (Port 6379)                                                │  │
│  │  - Session Storage  - Cache  - Rate Limiting                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Event Flow Diagrams

### Order Creation Flow

```
Customer → Order Service → [OrderCreated Event] → RabbitMQ
                                                       │
                        ┌──────────────────────────────┼──────────────────┐
                        │                              │                  │
                        ▼                              ▼                  ▼
                Payment Service              Delivery Service    Notification Service
                        │                              │                  │
                [Process Payment]              [Find Driver]      [Send Confirmation]
                        │                              │                  │
                        ▼                              ▼                  ▼
            [PaymentProcessed Event]      [DeliveryAssigned Event]   [Email/SMS]
                        │                              │
                        └──────────────┬───────────────┘
                                       ▼
                                 Order Service
                                       │
                              [Update Order Status]
```

### Payment Processing Flow

```
Order Service → Payment Service
                       │
                [Validate Payment]
                       │
                ┌──────┴──────┐
                │             │
         [Success]       [Failure]
                │             │
                ▼             ▼
    [PaymentProcessed]  [PaymentFailed]
                │             │
                └──────┬──────┘
                       ▼
                   RabbitMQ
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
  Order Service  Notification   Delivery Service
        │              │              │
  [Update Status] [Notify User]  [Assign/Cancel]
```

### Delivery Tracking Flow

```
Driver App → Delivery Service
                    │
            [Update Location]
                    │
            [DeliveryStatusUpdated]
                    │
                    ▼
                RabbitMQ
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  Order Service  Customer App  Notification
        │           │           │
  [Update]    [Real-time]  [Push Notification]
              [Map Update]
```

## Data Flow & Consistency

### Saga Pattern Implementation

**Order Creation Saga**:

1. **Order Service**: Create order (PENDING)
2. **Payment Service**: Process payment
   - Success → Continue
   - Failure → Compensate (Cancel order)
3. **Delivery Service**: Assign driver
   - Success → Complete
   - Failure → Compensate (Refund payment, Cancel order)

### Outbox Pattern

Each service implements outbox pattern:

```
BEGIN TRANSACTION
  1. Update business entity (e.g., create order)
  2. Insert event into outbox table
COMMIT TRANSACTION

Background Process:
  1. Read events from outbox
  2. Publish to RabbitMQ
  3. Mark as published
  4. Delete old events
```

### Idempotency

All event handlers use idempotency keys:

```typescript
interface Event {
  id: string;           // Unique event ID
  type: string;         // Event type
  timestamp: Date;      // Event timestamp
  payload: any;         // Event data
  correlationId: string; // For tracing
}

// Handler checks if event already processed
if (await isEventProcessed(event.id)) {
  return; // Skip duplicate
}
```

## Scalability Strategy

### Horizontal Scaling

```yaml
# Scale specific services based on load
order-service: 3 instances
payment-service: 2 instances
delivery-service: 2 instances
notification-service: 4 instances
```

### Database Sharding

```
User Sharding: Hash(user_id) % num_shards
Restaurant Sharding: Hash(restaurant_id) % num_shards
```

### Caching Strategy

```
L1 Cache: In-memory (per service instance)
L2 Cache: Redis (shared)
TTL Strategy:
  - User profiles: 5 minutes
  - Restaurant data: 10 minutes
  - Menu items: 15 minutes
  - Active orders: 30 seconds
```

## Resilience Patterns

### Circuit Breaker

```typescript
const circuitBreaker = {
  failureThreshold: 5,      // Open after 5 failures
  timeout: 60000,           // 60 seconds
  resetTimeout: 30000       // Try again after 30 seconds
};
```

### Retry Strategy

```typescript
const retryConfig = {
  maxRetries: 3,
  backoff: 'exponential',   // 1s, 2s, 4s
  retryableErrors: [
    'TIMEOUT',
    'SERVICE_UNAVAILABLE',
    'NETWORK_ERROR'
  ]
};
```

### Rate Limiting

```yaml
Traefik Rate Limits:
  - Global: 1000 req/min
  - Per IP: 100 req/min
  - Per User: 200 req/min
```

## Security Architecture

### Authentication Flow

```
1. User Login → Auth Service
2. Validate credentials
3. Generate JWT (access + refresh tokens)
4. Return tokens to client
5. Client stores in httpOnly cookie
6. Include in Authorization header
7. Services validate JWT signature
8. Extract user info from claims
```

### JWT Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "customer|restaurant|driver|admin",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

### Role-Based Access Control

```typescript
Roles:
  - CUSTOMER: Browse, order, track
  - RESTAURANT: Manage menu, view orders
  - DRIVER: View deliveries, update status
  - ADMIN: Full access

Permissions:
  - orders:create → CUSTOMER
  - orders:view → CUSTOMER, RESTAURANT, DRIVER, ADMIN
  - orders:update → RESTAURANT, DRIVER, ADMIN
  - menu:manage → RESTAURANT, ADMIN
  - delivery:assign → ADMIN
  - delivery:update → DRIVER, ADMIN
```

## Monitoring & Observability

### Health Checks

```typescript
GET /health
Response:
{
  "status": "healthy",
  "service": "order-service",
  "version": "1.0.0",
  "uptime": 3600,
  "dependencies": {
    "database": "healthy",
    "rabbitmq": "healthy",
    "redis": "healthy"
  }
}
```

### Metrics

```
Business Metrics:
  - orders_created_total
  - orders_completed_total
  - average_delivery_time
  - payment_success_rate

Technical Metrics:
  - http_requests_total
  - http_request_duration_seconds
  - rabbitmq_messages_published
  - database_connections_active
```

### Distributed Tracing

```
Trace ID propagation through headers:
X-Trace-Id: unique-trace-id
X-Span-Id: unique-span-id
X-Parent-Span-Id: parent-span-id

Each service adds span:
Order Service → Payment Service → Notification Service
    Span 1    →     Span 2      →      Span 3
```

## Deployment Architecture

### Multi-Server Setup

```
Server 1 (Load Balancer):
  - Traefik
  - Consul

Server 2 (Services):
  - Auth Service
  - User Service
  - Restaurant Service
  - Menu Service

Server 3 (Services):
  - Order Service
  - Payment Service
  - Delivery Service
  - Notification Service

Server 4 (Infrastructure):
  - RabbitMQ
  - PostgreSQL (Primary)
  - Redis

Server 5 (Infrastructure):
  - PostgreSQL (Replica)
  - Monitoring (Prometheus/Grafana)
```

### High Availability

```
- Load Balancer: 2 instances (active-passive)
- Each Service: Min 2 instances
- Database: Primary + 2 Replicas
- RabbitMQ: 3-node cluster
- Redis: Sentinel setup (1 primary + 2 replicas)
```

## Performance Optimization

### Database Optimization

```sql
-- Indexes for common queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);

-- Partitioning for large tables
CREATE TABLE orders_2024_q1 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
```

### API Optimization

```
- Pagination: Limit 20 items per page
- Field Selection: Allow clients to specify fields
- Compression: Gzip responses
- HTTP/2: Multiplexing support
- CDN: Static assets cached
```

### Message Queue Optimization

```yaml
RabbitMQ Configuration:
  - Prefetch Count: 10
  - Message TTL: 24 hours
  - Queue Length Limit: 10000
  - Dead Letter Exchange: Enabled
  - Lazy Queues: For large backlogs
```
