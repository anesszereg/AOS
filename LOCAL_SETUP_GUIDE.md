# Complete Local Setup Guide

## 🚀 Running Everything Locally

This guide shows you how to run the complete infrastructure locally with all components.

---

## 📋 Prerequisites

### **Required Software:**
```bash
# 1. Node.js (v18 or higher)
node --version  # Should be v18+

# 2. Docker Desktop
docker --version
docker-compose --version

# 3. PostgreSQL (if not using Docker)
psql --version

# 4. Git
git --version
```

---

## 🎯 Option 1: Quick Start (Minimal Setup)

**Best for: Quick testing and development**

### **Step 1: Start Local Server Only**

```bash
# Navigate to project
cd /Users/mac/Desktop/AOS\ orriject/food-delivery-platform

# Install dependencies (if not done)
npm install

# Start the local development server
npm start
```

**What runs:**
- ✅ API Gateway (localhost:3000)
- ✅ All 8 microservices
- ✅ Local PostgreSQL connection
- ✅ RabbitMQ (CloudAMQP - cloud)
- ✅ Redis (Upstash - cloud)

**Access:**
- API: http://localhost:3000
- Health: http://localhost:3000/health

---

## 🏗️ Option 2: Full Local Infrastructure (Docker)

**Best for: Complete local development with all services**

### **Step 1: Start PostgreSQL + RabbitMQ + Redis Locally**

```bash
# Create docker-compose.local.yml
cat > docker-compose.local.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: food-delivery-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: food_delivery
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - food-delivery-network

  rabbitmq:
    image: rabbitmq:3-management
    container_name: food-delivery-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin123
    ports:
      - "5672:5672"   # AMQP
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - food-delivery-network

  redis:
    image: redis:7-alpine
    container_name: food-delivery-redis
    command: redis-server --requirepass redis123
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - food-delivery-network

volumes:
  postgres_data:
  rabbitmq_data:
  redis_data:

networks:
  food-delivery-network:
    driver: bridge
EOF

# Start services
docker-compose -f docker-compose.local.yml up -d

# Check status
docker-compose -f docker-compose.local.yml ps
```

### **Step 2: Update .env for Local Services**

```bash
# Backup current .env
cp .env .env.cloud-backup

# Update .env for local services
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery

# RabbitMQ (Local)
RABBITMQ_URL=amqp://admin:admin123@localhost:5672

# Redis (Local)
REDIS_URL=redis://:redis123@localhost:6379

# JWT Secrets
JWT_SECRET=osdmovnaonvonfwpefeopewmofmwfpeofwepfemewmfpmpomfw
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL
VITE_API_URL=http://localhost:3000/api

# Node Environment
NODE_ENV=development
EOF
```

### **Step 3: Initialize Database**

```bash
# Create database schema
psql -h localhost -U postgres -d food_delivery -f init-database.sql

# Seed data
psql -h localhost -U postgres -d food_delivery -f seed-data.sql

# Or use Docker:
docker exec -i food-delivery-postgres psql -U postgres -d food_delivery < init-database.sql
docker exec -i food-delivery-postgres psql -U postgres -d food_delivery < seed-data.sql
```

### **Step 4: Start Application**

```bash
# Start local server
npm start
```

**Access:**
- API: http://localhost:3000
- RabbitMQ UI: http://localhost:15672 (admin/admin123)
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## 🎛️ Option 3: Full Stack with Monitoring (Docker Compose)

**Best for: Complete infrastructure with monitoring**

### **Step 1: Start Everything**

```bash
# Start all infrastructure
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Check all services
docker-compose ps
```

**What runs:**
- ✅ PostgreSQL (port 5432)
- ✅ RabbitMQ (port 5672, UI: 15672)
- ✅ Redis (port 6379)
- ✅ Consul (port 8500)
- ✅ Traefik (port 80, 443, dashboard: 8080)
- ✅ Prometheus (port 9090)
- ✅ Grafana (port 3001)
- ✅ All 8 microservices

### **Step 2: Access Dashboards**

```bash
# Consul UI
open http://localhost:8500

# Traefik Dashboard
open http://localhost:8080

# RabbitMQ Management
open http://localhost:15672

# Prometheus
open http://localhost:9090

# Grafana
open http://localhost:3001
# Login: admin/admin
```

### **Step 3: Test APIs**

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@example.com","password":"password123"}'

# Get restaurants
curl http://localhost:3000/api/restaurants
```

---

## 📊 Option 4: Kubernetes (Local - Minikube)

**Best for: Testing Kubernetes deployment**

### **Step 1: Install Minikube**

```bash
# macOS
brew install minikube

# Start Minikube
minikube start --cpus=4 --memory=8192

# Enable ingress
minikube addons enable ingress
```

### **Step 2: Create Kubernetes Manifests**

```bash
# Create k8s directory
mkdir -p k8s

# Create namespace
cat > k8s/namespace.yaml << 'EOF'
apiVersion: v1
kind: Namespace
metadata:
  name: food-delivery
EOF

# Apply namespace
kubectl apply -f k8s/namespace.yaml
```

### **Step 3: Deploy Services**

```bash
# Deploy PostgreSQL
kubectl apply -f k8s/postgres.yaml

# Deploy RabbitMQ
kubectl apply -f k8s/rabbitmq.yaml

# Deploy Redis
kubectl apply -f k8s/redis.yaml

# Deploy microservices
kubectl apply -f k8s/services/

# Check pods
kubectl get pods -n food-delivery
```

---

## 🔧 Troubleshooting

### **Issue: Port Already in Use**

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or for specific ports
lsof -ti:5432  # PostgreSQL
lsof -ti:5672  # RabbitMQ
lsof -ti:6379  # Redis
```

### **Issue: Docker Services Not Starting**

```bash
# Check logs
docker-compose logs postgres
docker-compose logs rabbitmq
docker-compose logs redis

# Restart services
docker-compose down
docker-compose up -d
```

### **Issue: Database Connection Failed**

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d food_delivery

# Or with Docker
docker exec -it food-delivery-postgres psql -U postgres -d food_delivery

# Check if database exists
docker exec -it food-delivery-postgres psql -U postgres -c "\l"
```

### **Issue: RabbitMQ Connection Failed**

```bash
# Check RabbitMQ status
docker exec food-delivery-rabbitmq rabbitmqctl status

# Check users
docker exec food-delivery-rabbitmq rabbitmqctl list_users

# Access management UI
open http://localhost:15672
```

### **Issue: Redis Connection Failed**

```bash
# Test Redis connection
redis-cli -h localhost -p 6379 -a redis123 ping

# Or with Docker
docker exec -it food-delivery-redis redis-cli -a redis123 ping
```

---

## 📝 Environment Variables Reference

### **Local Development (.env)**

```bash
# Database (Local PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery

# RabbitMQ (Local)
RABBITMQ_URL=amqp://admin:admin123@localhost:5672

# Redis (Local)
REDIS_URL=redis://:redis123@localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# API
VITE_API_URL=http://localhost:3000/api
PORT=3000

# Environment
NODE_ENV=development
```

### **Cloud Services (.env.cloud)**

```bash
# Database (Neon)
DATABASE_URL=postgresql://mac@localhost:5432/food_delivery?sslmode=disable

# RabbitMQ (CloudAMQP)
RABBITMQ_URL=amqps://khfkynkj:3Qr2oS_S-Y8k3-DjAvE7_N3b_GBLQT_b@chameleon.lmq.cloudamqp.com/khfkynkj

# Redis (Upstash)
REDIS_URL=redis://default:gQAAAAAAAbbpAAIgcDE0ODYwNWFhMDMyMmY0NDYzOGEzOTlkZTdiODEwMDI4NQ@sacred-tetra-112361.upstash.io:6379

# JWT
JWT_SECRET=osdmovnaonvonfwpefeopewmofmwfpeofwepfemewmfpmpomfw
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production

# API
VITE_API_URL=http://localhost:3000/api
```

---

## 🎯 Recommended Setup for Different Scenarios

### **For Development:**
```bash
# Option 1: Quick Start
npm start
# Uses cloud services (RabbitMQ, Redis)
# Fast setup, no Docker needed
```

### **For Testing:**
```bash
# Option 2: Local Infrastructure
docker-compose -f docker-compose.local.yml up -d
npm start
# All services local
# Full control
```

### **For Demo/Presentation:**
```bash
# Option 3: Full Stack with Monitoring
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
# Shows all dashboards
# Complete infrastructure
```

### **For Learning Kubernetes:**
```bash
# Option 4: Minikube
minikube start
kubectl apply -f k8s/
# Kubernetes experience
# Production-like setup
```

---

## 🚀 Quick Commands Cheat Sheet

### **Start Services**
```bash
# Minimal (just API)
npm start

# With local DB/RabbitMQ/Redis
docker-compose -f docker-compose.local.yml up -d && npm start

# Full stack with monitoring
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Kubernetes
minikube start && kubectl apply -f k8s/
```

### **Stop Services**
```bash
# Stop API
Ctrl+C (in terminal running npm start)

# Stop Docker services
docker-compose down

# Stop all Docker containers
docker stop $(docker ps -aq)

# Stop Minikube
minikube stop
```

### **View Logs**
```bash
# API logs
npm start (shows in terminal)

# Docker service logs
docker-compose logs -f postgres
docker-compose logs -f rabbitmq
docker-compose logs -f redis

# All logs
docker-compose logs -f

# Kubernetes logs
kubectl logs -f <pod-name> -n food-delivery
```

### **Database Operations**
```bash
# Connect to database
psql -h localhost -U postgres -d food_delivery

# Run migrations
psql -h localhost -U postgres -d food_delivery -f init-database.sql

# Seed data
psql -h localhost -U postgres -d food_delivery -f seed-data.sql

# Backup database
pg_dump -h localhost -U postgres food_delivery > backup.sql

# Restore database
psql -h localhost -U postgres -d food_delivery < backup.sql
```

### **Health Checks**
```bash
# API health
curl http://localhost:3000/health

# PostgreSQL
docker exec food-delivery-postgres pg_isready

# RabbitMQ
curl -u admin:admin123 http://localhost:15672/api/healthchecks/node

# Redis
docker exec food-delivery-redis redis-cli -a redis123 ping

# All services
docker-compose ps
```

---

## 📦 Complete Setup Script

Save this as `setup-local.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up Food Delivery Platform locally..."

# 1. Start Docker services
echo "📦 Starting Docker services..."
docker-compose -f docker-compose.local.yml up -d

# 2. Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# 3. Initialize database
echo "🗄️  Initializing database..."
docker exec -i food-delivery-postgres psql -U postgres -d food_delivery < init-database.sql
docker exec -i food-delivery-postgres psql -U postgres -d food_delivery < seed-data.sql

# 4. Install dependencies
echo "📚 Installing dependencies..."
npm install

# 5. Start application
echo "🎉 Starting application..."
npm start
```

Make it executable:
```bash
chmod +x setup-local.sh
./setup-local.sh
```

---

## ✅ Verification Checklist

After starting everything, verify:

- [ ] Docker containers running: `docker-compose ps`
- [ ] PostgreSQL accessible: `psql -h localhost -U postgres -d food_delivery -c "SELECT 1"`
- [ ] RabbitMQ UI accessible: http://localhost:15672
- [ ] Redis accessible: `redis-cli -h localhost -a redis123 ping`
- [ ] API health check: `curl http://localhost:3000/health`
- [ ] Login works: Test with Postman
- [ ] Restaurants endpoint: `curl http://localhost:3000/api/restaurants`

---

## 🎯 Summary

**Easiest:** `npm start` (uses cloud services)
**Recommended:** Docker Compose local (full control)
**For Demo:** Docker Compose with monitoring (all dashboards)
**Advanced:** Kubernetes with Minikube (production-like)

Choose based on your needs! 🚀
