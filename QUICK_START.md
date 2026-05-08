# 🚀 Quick Start Guide

## One Command to Rule Them All!

```bash
npm start
```

That's it! This single command will:
- ✅ Start all Docker infrastructure (PostgreSQL, RabbitMQ, Redis, Consul, Traefik)
- ✅ Start Prometheus monitoring (lightweight)
- ✅ Wait for services to be ready
- ✅ Check service health
- ✅ Start the API server
- ✅ Display all access URLs

**Important Notes:**
- ❌ Frontend is **NOT** started locally (it's hosted on Vercel)
- ❌ Grafana and Promtail are NOT started by default (lightweight setup)
- ✅ All backend services and infrastructure run in Docker

---

## 📋 Prerequisites

1. **Docker Desktop** must be installed and running
2. **Node.js** v18 or higher
3. **npm** installed

---

## 🎯 Available Commands

### **Start Everything**
```bash
npm start
```
Starts infrastructure + API server

### **Stop Everything**
```bash
npm stop
```
Stops all Docker containers and API server

### **Test Services**
```bash
npm run test:services
```
Checks which services are running

### **Start API Only** (if infrastructure is already running)
```bash
npm run start:api
```

### **Docker Commands**
```bash
npm run docker:up      # Start basic infrastructure
npm run docker:full    # Start with monitoring
npm run docker:down    # Stop containers
npm run docker:logs    # View logs
```

---

## 🌐 Access Points

After running `npm start`, you can access:

### **API**
- Health Check: http://localhost:3000/health
- API Gateway: http://localhost:3000/api
- Restaurants: http://localhost:3000/api/restaurants

### **Infrastructure Dashboards**
- Consul (Service Registry): http://localhost:8500
- Traefik (Load Balancer): http://localhost:8080
- RabbitMQ (Message Queue): http://localhost:15672
  - Username: `admin`
  - Password: `admin123`

### **Monitoring**
- Prometheus: http://localhost:9090

**Note:** Grafana and Jaeger are not started by default. To start them manually:
```bash
docker compose -f docker-compose.monitoring.yml up -d grafana jaeger
```

### **Database**
- PostgreSQL: `localhost:5432`
- Username: `postgres`
- Password: `postgres`
- Database: `food_delivery`

---

## 👤 Test Accounts

All accounts use password: `password123`

- **Admin**: admin@fooddelivery.com
- **Restaurant Owner**: owner1@restaurant.com
- **Customer**: customer1@example.com
- **Driver**: driver1@delivery.com

---

## 🧪 Testing

### **Using cURL**
```bash
# Health check
curl http://localhost:3000/health

# Get restaurants
curl http://localhost:3000/api/restaurants

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@example.com","password":"password123"}'
```

### **Using Postman**
1. Import `Food-Delivery-API.postman_collection.json`
2. Test all 47 endpoints
3. Use environment variables for tokens

---

## 🔧 Troubleshooting

### **"Docker is not running"**
```bash
# Open Docker Desktop app
open /Applications/Docker.app

# Wait for it to start, then:
npm start
```

### **"Port already in use"**
```bash
# Stop everything first
npm stop

# Then start again
npm start
```

### **"Services not responding"**
```bash
# Check what's running
npm run test:services

# View Docker logs
npm run docker:logs

# Restart everything
npm stop
npm start
```

### **Database connection issues**
```bash
# Check PostgreSQL
docker exec food-delivery-postgres pg_isready -U postgres

# Reconnect
docker restart food-delivery-postgres
```

---

## 📊 What Happens When You Run `npm start`

1. **Checks Prerequisites**
   - Verifies Docker is installed
   - Verifies Docker is running

2. **Stops Existing Containers**
   - Cleans up any previous runs

3. **Starts Infrastructure**
   - PostgreSQL (database)
   - RabbitMQ (message queue)
   - Redis (cache)
   - Consul (service registry)
   - Traefik (load balancer)
   - Prometheus (metrics)
   - Grafana (dashboards)

4. **Waits for Services**
   - Each service gets time to start
   - Health checks are performed

5. **Starts API Server**
   - Loads all 8 microservices
   - Initializes databases
   - Starts on port 3000

6. **Displays Access Info**
   - Shows all URLs
   - Shows test accounts
   - Shows commands

---

## 🎬 For Presentation

```bash
# 1. Start everything
npm start

# 2. Wait for "ALL SERVICES RUNNING!" message

# 3. Open dashboards in browser:
open http://localhost:8500   # Consul
open http://localhost:8080   # Traefik
open http://localhost:15672  # RabbitMQ

# 4. Test API
curl http://localhost:3000/api/restaurants

# 5. Demo with Postman
# Import collection and test endpoints

# 6. When done
npm stop
```

---

## 💡 Pro Tips

1. **First Time Setup**: Run `npm start` and wait 1-2 minutes for everything to initialize

2. **Quick Restart**: If you only changed code, use `npm run start:api` (infrastructure keeps running)

3. **Check Status**: Use `npm run test:services` to see what's working

4. **View Logs**: Use `npm run docker:logs` to debug issues

5. **Clean Slate**: Run `npm stop` then `npm start` for a fresh start

---

## 🚀 Summary

**To start everything:**
```bash
npm start
```

**To stop everything:**
```bash
npm stop
```

**To test:**
```bash
npm run test:services
```

That's all you need to know! 🎉
