# 🚀 COMPLETE INTEGRATION GUIDE

## 📋 Overview

This guide will help you complete the integration of all infrastructure components and verify the entire system works end-to-end.

---

## ✅ STEP 1: Start Infrastructure Services

### 1.1 Start All Infrastructure
```bash
cd /Users/mac/Desktop/AOS\ orriject/food-delivery-platform

# Start all infrastructure services
docker-compose up -d postgres rabbitmq consul redis traefik

# Wait for services to be healthy (30 seconds)
sleep 30
```

### 1.2 Verify Infrastructure is Running
```bash
# Check all containers are running
docker-compose ps

# Expected output:
# - food-delivery-postgres    (healthy)
# - food-delivery-rabbitmq    (healthy)
# - food-delivery-consul      (healthy)
# - food-delivery-redis       (healthy)
# - food-delivery-traefik     (running)
```

### 1.3 Access Infrastructure UIs
- **RabbitMQ Management**: http://localhost:15672
  - Username: `admin`
  - Password: `admin123`
  
- **Consul UI**: http://localhost:8500
  
- **Traefik Dashboard**: http://localhost:8080

---

## ✅ STEP 2: Initialize Databases

### 2.1 Create Databases for Each Service
```bash
# Connect to PostgreSQL
docker exec -it food-delivery-postgres psql -U postgres

# Create databases
CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE restaurant_db;
CREATE DATABASE menu_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE delivery_db;
CREATE DATABASE notification_db;

# Verify databases
\l

# Exit
\q
```

### 2.2 Initialize Database Schemas
Each service will auto-create its schema on first start. The auth-service has schema initialization in:
`services/auth-service/src/config/database.ts`

---

## ✅ STEP 3: Start Microservices

### 3.1 Start All Services
```bash
# Start all 8 microservices
docker-compose up -d auth-service user-service restaurant-service menu-service order-service payment-service delivery-service notification-service

# Wait for services to start
sleep 20
```

### 3.2 Check Service Logs
```bash
# Check if services started successfully
docker-compose logs auth-service
docker-compose logs order-service
docker-compose logs payment-service

# Look for:
# - "Server listening on port XXXX"
# - "Connected to database"
# - "Connected to RabbitMQ" (for order, payment, delivery, notification)
# - "Registered with Consul"
```

### 3.3 Verify Services in Consul
Visit http://localhost:8500 and check:
- ✅ auth-service registered
- ✅ user-service registered
- ✅ restaurant-service registered
- ✅ menu-service registered
- ✅ order-service registered
- ✅ payment-service registered
- ✅ delivery-service registered
- ✅ notification-service registered

---

## ✅ STEP 4: Test Service Connectivity

### 4.1 Test Auth Service
```bash
# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save the access_token from response
```

### 4.2 Test Restaurant Service
```bash
# Get all restaurants (replace TOKEN with your access token)
curl -X GET http://localhost:3003/api/v1/restaurants \
  -H "Authorization: Bearer TOKEN"
```

### 4.3 Test Menu Service
```bash
# Get menu for a restaurant
curl -X GET http://localhost:3004/api/v1/menu/restaurant/RESTAURANT_ID \
  -H "Authorization: Bearer TOKEN"
```

### 4.4 Test Order Service
```bash
# Create an order
curl -X POST http://localhost:3005/api/v1/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "items": [
      {"menuItemId": "ITEM_ID", "quantity": 2}
    ],
    "deliveryAddress": "123 Main St"
  }'
```

---

## ✅ STEP 5: Verify Event-Driven Communication

### 5.1 Check RabbitMQ Queues
Visit http://localhost:15672 and verify queues exist:
- ✅ `order.created`
- ✅ `order.updated`
- ✅ `payment.processed`
- ✅ `payment.failed`
- ✅ `delivery.assigned`
- ✅ `delivery.updated`

### 5.2 Test Event Flow
```bash
# 1. Create an order (this should publish OrderCreated event)
curl -X POST http://localhost:3005/api/v1/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "items": [{"menuItemId": "ITEM_ID", "quantity": 1}],
    "deliveryAddress": "123 Main St"
  }'

# 2. Check RabbitMQ Management UI
# - Go to Queues tab
# - Check if order.created queue received a message
# - Check if payment-service consumed the message

# 3. Check service logs
docker-compose logs payment-service | grep "OrderCreated"
docker-compose logs delivery-service | grep "OrderCreated"
docker-compose logs notification-service | grep "OrderCreated"
```

### 5.3 Verify Payment Processing
```bash
# Process payment (this should publish PaymentProcessed event)
curl -X POST http://localhost:3006/api/v1/payments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID",
    "amount": 50.00,
    "method": "credit_card"
  }'

# Check logs
docker-compose logs order-service | grep "PaymentProcessed"
docker-compose logs notification-service | grep "PaymentProcessed"
```

---

## ✅ STEP 6: Test Traefik Routing

### 6.1 Configure Traefik Routes
Traefik should automatically discover services from Consul. Test routing:

```bash
# Test routing through Traefik (port 80)
curl -X GET http://localhost/api/v1/auth/health

# This should route to auth-service through Traefik
```

### 6.2 Verify Load Balancing
```bash
# Scale order-service to 3 instances
docker-compose up -d --scale order-service=3

# Make multiple requests
for i in {1..10}; do
  curl http://localhost/api/v1/orders/health
done

# Check Traefik dashboard to see load distribution
# Visit: http://localhost:8080
```

---

## ✅ STEP 7: Start Frontend

### 7.1 Build and Start Frontend
```bash
# Option 1: Using Docker
docker-compose up -d frontend

# Option 2: Local development
cd frontend/food-delivery-app
npm install
npm run dev
```

### 7.2 Access Frontend
Visit: http://localhost:3000

### 7.3 Test Complete User Flow
1. Register/Login as customer
2. Browse restaurants
3. View restaurant details
4. Add items to cart
5. Checkout
6. Track order (should poll every 10 seconds)
7. View order history

---

## ✅ STEP 8: Seed Database

### 8.1 Run Seed Script
```bash
cd backend
npm install
npx ts-node src/seeders/seed.ts
```

### 8.2 Verify Seeded Data
```bash
# Check restaurants
curl http://localhost:3003/api/v1/restaurants

# Check menu items
curl http://localhost:3004/api/v1/menu/restaurant/RESTAURANT_ID

# Login with seeded users
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@example.com",
    "password": "password123"
  }'
```

---

## ✅ STEP 9: Health Checks

### 9.1 Check All Service Health
```bash
# Create a health check script
cat > check-health.sh << 'EOF'
#!/bin/bash

services=(
  "auth-service:3001"
  "user-service:3002"
  "restaurant-service:3003"
  "menu-service:3004"
  "order-service:3005"
  "payment-service:3006"
  "delivery-service:3007"
  "notification-service:3008"
)

for service in "${services[@]}"; do
  name="${service%%:*}"
  port="${service##*:}"
  
  echo -n "Checking $name... "
  if curl -s http://localhost:$port/health > /dev/null; then
    echo "✅ Healthy"
  else
    echo "❌ Unhealthy"
  fi
done
EOF

chmod +x check-health.sh
./check-health.sh
```

---

## ✅ STEP 10: Monitor System

### 10.1 View All Logs
```bash
# View all service logs in real-time
docker-compose logs -f

# View specific service
docker-compose logs -f order-service

# View last 100 lines
docker-compose logs --tail=100 payment-service
```

### 10.2 Monitor RabbitMQ
Visit http://localhost:15672
- Check queue lengths
- Monitor message rates
- Check consumer connections

### 10.3 Monitor Consul
Visit http://localhost:8500
- Check service health
- View service catalog
- Check key/value store

---

## 🎯 VERIFICATION CHECKLIST

### Infrastructure ✅
- [ ] PostgreSQL running and accessible
- [ ] RabbitMQ running with management UI
- [ ] Consul running with UI
- [ ] Redis running
- [ ] Traefik running with dashboard

### Databases ✅
- [ ] All 8 databases created
- [ ] Schemas initialized
- [ ] Seed data loaded

### Microservices ✅
- [ ] All 8 services running
- [ ] All services connected to PostgreSQL
- [ ] Services registered with Consul
- [ ] Health checks passing

### Event-Driven ✅
- [ ] RabbitMQ queues created
- [ ] Order service publishes events
- [ ] Payment service consumes events
- [ ] Delivery service consumes events
- [ ] Notification service consumes events

### Routing ✅
- [ ] Traefik routes to services
- [ ] Load balancing works
- [ ] Service discovery works

### Frontend ✅
- [ ] Frontend accessible
- [ ] Can login/register
- [ ] Can browse restaurants
- [ ] Can place orders
- [ ] Can track orders

---

## 🚨 TROUBLESHOOTING

### Services Won't Start
```bash
# Check logs
docker-compose logs SERVICE_NAME

# Common issues:
# 1. Port already in use
# 2. Database connection failed
# 3. RabbitMQ connection failed
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection
docker exec -it food-delivery-postgres psql -U postgres -c "SELECT 1"

# Restart PostgreSQL
docker-compose restart postgres
```

### RabbitMQ Connection Issues
```bash
# Check RabbitMQ is running
docker-compose ps rabbitmq

# Check RabbitMQ logs
docker-compose logs rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq
```

### Consul Registration Issues
```bash
# Check Consul is running
docker-compose ps consul

# Check Consul members
docker exec -it food-delivery-consul consul members

# Restart Consul
docker-compose restart consul
```

---

## 📊 EXPECTED RESULTS

After completing all steps, you should have:

1. ✅ **5 Infrastructure Services Running**
   - PostgreSQL, RabbitMQ, Consul, Redis, Traefik

2. ✅ **8 Microservices Running**
   - All connected to infrastructure
   - All registered with Consul
   - All passing health checks

3. ✅ **Event-Driven Communication Working**
   - Orders trigger payment processing
   - Payments trigger delivery assignment
   - All events trigger notifications

4. ✅ **Frontend Working**
   - Complete customer journey functional
   - Real-time order tracking
   - All 26 screens accessible

5. ✅ **Production-Ready Platform**
   - Load balancing via Traefik
   - Service discovery via Consul
   - Async communication via RabbitMQ
   - Scalable architecture

---

## 🎉 SUCCESS CRITERIA

Your platform is fully integrated when:

- ✅ All services start without errors
- ✅ Customer can place an order end-to-end
- ✅ Order triggers payment processing automatically
- ✅ Payment triggers delivery assignment automatically
- ✅ Notifications are sent for all events
- ✅ Frontend shows real-time order updates
- ✅ All services are discoverable via Consul
- ✅ Traefik routes requests correctly
- ✅ System handles service failures gracefully

---

## 📝 NEXT STEPS

After integration is complete:

1. **Add Monitoring**
   - Prometheus for metrics
   - Grafana for dashboards
   - Jaeger for distributed tracing

2. **Add Testing**
   - Unit tests for each service
   - Integration tests for event flows
   - E2E tests for user journeys

3. **Production Deployment**
   - Create docker-compose.prod.yml
   - Setup CI/CD pipeline
   - Configure environment variables
   - Setup SSL certificates

4. **Performance Optimization**
   - Add caching with Redis
   - Optimize database queries
   - Implement connection pooling
   - Add rate limiting

---

**Status**: Ready for Integration
**Time Required**: 1-2 hours
**Difficulty**: Intermediate
**Prerequisites**: Docker, Docker Compose installed
