# 🍔 Food Delivery Platform - Microservices Architecture

## 📋 Overview

A complete, production-ready food delivery platform built with microservices architecture, featuring real-time order tracking, secure authentication, payment processing, and asynchronous communication.

## 🏗️ System Architecture

### Microservices

1. **Auth Service** (Port: 3001) - JWT-based authentication & authorization
2. **User Service** (Port: 3002) - User profiles & role management
3. **Restaurant Service** (Port: 3003) - Restaurant management
4. **Menu Service** (Port: 3004) - Menu items & categories
5. **Order Service** (Port: 3005) - Order lifecycle management
6. **Payment Service** (Port: 3006) - Payment processing & transactions
7. **Delivery Service** (Port: 3007) - Driver management & delivery tracking
8. **Notification Service** (Port: 3008) - Email/SMS/Push notifications

### Infrastructure Components

- **Traefik** (Port: 80/443) - Reverse proxy & load balancer
- **Consul** (Port: 8500) - Service discovery & health checks
- **RabbitMQ** (Port: 5672, 15672) - Message broker for async communication
- **PostgreSQL** - Primary database for each service
- **Redis** - Caching & session management

### Frontend

- **React App** (Port: 3000) - Modern UI with TailwindCSS & shadcn/ui

## 🔄 Event-Driven Architecture

### RabbitMQ Events

```
OrderCreated → Payment Service, Delivery Service, Notification Service
OrderUpdated → Notification Service
PaymentProcessed → Order Service, Notification Service
PaymentFailed → Order Service, Notification Service
DeliveryAssigned → Order Service, Notification Service
DeliveryStatusUpdated → Order Service, Notification Service
```

## 🎯 Key Features

### Real-Time Updates Solution

**Challenge**: Handle real-time updates for orders, payments, and deliveries across multiple services while ensuring consistency and system resilience under high load.

**Solution**:

1. **Event Sourcing Pattern**: All state changes are captured as events in RabbitMQ
2. **CQRS**: Separate read/write models for high-performance queries
3. **Saga Pattern**: Distributed transactions with compensating actions
4. **Circuit Breaker**: Prevent cascade failures (using Resilience4j pattern)
5. **Event Replay**: Recover from failures by replaying events
6. **Idempotency**: Ensure events are processed exactly once using unique IDs
7. **Dead Letter Queues**: Handle failed messages gracefully

### Consistency Guarantees

- **Eventual Consistency**: Services sync via events
- **Optimistic Locking**: Prevent concurrent update conflicts
- **Outbox Pattern**: Ensure database + message broker atomicity
- **Retry Mechanism**: Exponential backoff for failed operations

### Scalability

- **Horizontal Scaling**: Each service can scale independently
- **Load Balancing**: Traefik distributes traffic
- **Database Sharding**: Ready for multi-tenant architecture
- **Caching Strategy**: Redis for frequently accessed data

## 🛠️ Technology Stack

### Backend
- **Framework**: Node.js with NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (per service)
- **Cache**: Redis
- **Message Broker**: RabbitMQ
- **Authentication**: JWT + Passport

### Frontend
- **Framework**: React 18
- **Styling**: TailwindCSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Query + Zustand
- **Routing**: React Router v6

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Service Discovery**: Consul
- **API Gateway**: Traefik
- **Monitoring**: Prometheus + Grafana (optional)

## 📂 Project Structure

```
food-delivery-platform/
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── restaurant-service/
│   ├── menu-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── delivery-service/
│   └── notification-service/
├── frontend/
│   └── food-delivery-app/
├── infrastructure/
│   ├── traefik/
│   ├── consul/
│   └── rabbitmq/
├── shared/
│   ├── events/
│   ├── types/
│   └── utils/
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- npm or yarn

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd food-delivery-platform

# Start infrastructure services
docker-compose up -d rabbitmq consul postgres redis

# Install dependencies for all services
npm run install:all

# Start all microservices
npm run dev:all

# Start frontend
cd frontend/food-delivery-app
npm install
npm run dev
```

### Production Deployment

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Scale specific services
docker-compose -f docker-compose.prod.yml up -d --scale order-service=3
```

## 🔐 Authentication Flow

1. User registers/logs in → Auth Service
2. Auth Service generates JWT token
3. Client includes token in Authorization header
4. Each service validates JWT using shared secret
5. Role-based access control (RBAC) enforced

## 📊 Database Schema

Each service has its own database following the Database-per-Service pattern.

### Auth Service DB
- users (id, email, password_hash, role, created_at)
- refresh_tokens (id, user_id, token, expires_at)

### User Service DB
- profiles (id, user_id, name, phone, address, avatar)
- preferences (id, user_id, settings)

### Restaurant Service DB
- restaurants (id, name, address, phone, rating, status)
- operating_hours (id, restaurant_id, day, open_time, close_time)

### Menu Service DB
- categories (id, restaurant_id, name, description)
- menu_items (id, category_id, name, description, price, available)

### Order Service DB
- orders (id, user_id, restaurant_id, status, total, created_at)
- order_items (id, order_id, menu_item_id, quantity, price)

### Payment Service DB
- payments (id, order_id, amount, status, method, transaction_id)
- transactions (id, payment_id, type, amount, timestamp)

### Delivery Service DB
- drivers (id, user_id, vehicle_type, status, location)
- deliveries (id, order_id, driver_id, status, pickup_time, delivery_time)

### Notification Service DB
- notifications (id, user_id, type, message, read, created_at)
- templates (id, type, subject, body)

## 🧪 Testing Strategy

### Unit Tests
- Jest for all services
- 80%+ code coverage

### Integration Tests
- Supertest for API endpoints
- Test database containers

### E2E Tests
- Playwright for frontend
- Full user journey testing

### Load Testing
- k6 for performance testing
- Simulate 10k+ concurrent users

## 📈 Monitoring & Observability

- **Logs**: Centralized logging with Winston
- **Metrics**: Prometheus metrics endpoint
- **Tracing**: Distributed tracing with Jaeger
- **Health Checks**: Consul health monitoring

## 🔄 CI/CD Pipeline

```yaml
Build → Test → Security Scan → Build Docker Images → Deploy to Staging → E2E Tests → Deploy to Production
```

## 📝 API Documentation

Each service exposes Swagger/OpenAPI documentation at `/api/docs`

## 🤝 Contributing

See CONTRIBUTING.md for development guidelines.

## 📄 License

MIT License - See LICENSE file for details.
