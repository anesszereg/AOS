#!/bin/bash

# 🚀 Complete Integration Script
# This script starts all infrastructure and microservices

set -e

echo "🚀 Starting Food Delivery Platform Integration..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Start Infrastructure
echo -e "${YELLOW}Step 1: Starting Infrastructure Services...${NC}"
docker compose up -d postgres rabbitmq consul redis traefik

echo "Waiting for infrastructure to be healthy (30 seconds)..."
sleep 30

# Step 2: Check Infrastructure Health
echo -e "${YELLOW}Step 2: Checking Infrastructure Health...${NC}"

if docker compose ps postgres | grep -q "healthy"; then
  echo -e "${GREEN}✅ PostgreSQL is healthy${NC}"
else
  echo -e "${RED}❌ PostgreSQL is not healthy${NC}"
  exit 1
fi

if docker compose ps rabbitmq | grep -q "healthy"; then
  echo -e "${GREEN}✅ RabbitMQ is healthy${NC}"
else
  echo -e "${RED}❌ RabbitMQ is not healthy${NC}"
  exit 1
fi

if docker compose ps consul | grep -q "healthy"; then
  echo -e "${GREEN}✅ Consul is healthy${NC}"
else
  echo -e "${RED}❌ Consul is not healthy${NC}"
  exit 1
fi

if docker compose ps redis | grep -q "healthy"; then
  echo -e "${GREEN}✅ Redis is healthy${NC}"
else
  echo -e "${RED}❌ Redis is not healthy${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All infrastructure services are healthy${NC}"
echo ""

# Step 3: Initialize Databases
echo -e "${YELLOW}Step 3: Initializing Databases...${NC}"

# Create databases (PostgreSQL doesn't support IF NOT EXISTS in CREATE DATABASE before v9.1)
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE auth_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auth_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE auth_db" 2>/dev/null || true
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE user_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'user_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE user_db" 2>/dev/null || true
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE restaurant_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'restaurant_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE restaurant_db" 2>/dev/null || true
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE menu_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'menu_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE menu_db" 2>/dev/null || true
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE order_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'order_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE order_db" 2>/dev/null || true
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE payment_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'payment_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE payment_db" 2>/dev/null || true
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE delivery_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'delivery_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE delivery_db" 2>/dev/null || true
docker exec food-delivery-postgres psql -U postgres -c "SELECT 'CREATE DATABASE notification_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'notification_db')\gexec" 2>/dev/null || docker exec food-delivery-postgres psql -U postgres -c "CREATE DATABASE notification_db" 2>/dev/null || true

echo -e "${GREEN}✅ Databases created${NC}"
echo ""

# Step 4: Build Microservices
echo -e "${YELLOW}Step 4: Building Microservices (this will take a few minutes)...${NC}"
docker compose build --no-cache \
  auth-service \
  user-service \
  restaurant-service \
  menu-service \
  order-service \
  payment-service \
  delivery-service \
  notification-service

echo -e "${GREEN}✅ Microservices built${NC}"
echo ""

# Step 5: Start Microservices
echo -e "${YELLOW}Step 5: Starting Microservices...${NC}"
docker compose up -d \
  auth-service \
  user-service \
  restaurant-service \
  menu-service \
  order-service \
  payment-service \
  delivery-service \
  notification-service

echo "Waiting for services to start (20 seconds)..."
sleep 20

# Step 6: Check Service Health
echo -e "${YELLOW}Step 6: Checking Service Health...${NC}"

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
  if curl -s http://localhost:$port/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Healthy${NC}"
  else
    echo -e "${YELLOW}⚠️  Not responding (may still be starting)${NC}"
  fi
done

echo ""

# Step 7: Create Test Accounts
echo -e "${YELLOW}Step 7: Creating Test Accounts...${NC}"
echo "Waiting for auth-service to be ready..."
sleep 10

# Run account creation script
cd "/Users/mac/Desktop/AOS orriject/food-delivery-platform"
./create-test-accounts.sh

echo ""

# Step 8: Start Frontend
echo -e "${YELLOW}Step 8: Starting Frontend...${NC}"
docker compose up -d frontend

echo ""
echo -e "${GREEN}🎉 Integration Complete!${NC}"
echo ""
echo "📊 Access Points:"
echo "  - Frontend:            http://localhost:3000"
echo "  - RabbitMQ Management: http://localhost:15672 (admin/admin123)"
echo "  - Consul UI:           http://localhost:8500"
echo "  - Traefik Dashboard:   http://localhost:8080"
echo ""
echo "🔐 Test Credentials:"
echo "  - Customer:   customer1@example.com / password123"
echo "  - Restaurant: restaurant1@example.com / password123"
echo "  - Driver:     driver1@example.com / password123"
echo "  - Admin:      admin@example.com / admin123"
echo ""
echo "📝 View logs: docker compose logs -f"
echo "🛑 Stop all:  docker compose down"
echo ""
