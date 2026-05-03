# 🏗️ Infrastructure Setup Guide

## Complete guide to enable all optional infrastructure components

---

## 1️⃣ **RabbitMQ Setup (CloudAMQP - FREE)**

### **Step 1: Create Account**
1. Go to https://customer.cloudamqp.com/signup
2. Sign up with email or GitHub
3. Verify your email

### **Step 2: Create Instance**
1. Click "Create New Instance"
2. **Name:** food-delivery-rabbitmq
3. **Plan:** Little Lemur (FREE)
4. **Region:** Choose closest to your Render region
5. Click "Create Instance"

### **Step 3: Get Connection URL**
1. Click on your instance name
2. Copy the **AMQP URL** (starts with `amqps://`)
3. Example: `amqps://username:password@host.cloudamqp.com/vhost`

### **Step 4: Add to Render**
1. Go to Render Dashboard
2. Select your service
3. Go to "Environment" tab
4. Add variable:
   - **Key:** `RABBITMQ_URL`
   - **Value:** Your AMQP URL from step 3
5. Save and redeploy

---

## 2️⃣ **Redis Setup (Upstash - FREE)**

### **Step 1: Create Account**
1. Go to https://upstash.com
2. Sign up with email or GitHub
3. Verify your email

### **Step 2: Create Database**
1. Click "Create Database"
2. **Name:** food-delivery-redis
3. **Type:** Regional
4. **Region:** Choose closest to your Render region
5. **Eviction:** No eviction
6. Click "Create"

### **Step 3: Get Connection URL**
1. Click on your database
2. Scroll to "REST API" section
3. Copy the **Redis URL** (starts with `redis://` or `rediss://`)
4. Example: `rediss://default:password@host.upstash.io:6379`

### **Step 4: Add to Render**
1. Go to Render Dashboard
2. Select your service
3. Go to "Environment" tab
4. Add variable:
   - **Key:** `REDIS_URL`
   - **Value:** Your Redis URL from step 3
5. Save and redeploy

---

## 3️⃣ **Consul Setup (HashiCorp Cloud - FREE)**

### **Option A: Cloud (Recommended for Production)**

#### **Step 1: Create Account**
1. Go to https://portal.cloud.hashicorp.com/sign-up
2. Sign up with email or GitHub
3. Verify your email

#### **Step 2: Create Consul Cluster**
1. Click "Consul" in the sidebar
2. Click "Deploy Consul"
3. **Tier:** Development (FREE)
4. **Region:** Choose closest to your Render region
5. Click "Deploy cluster"
6. Wait 5-10 minutes for deployment

#### **Step 3: Get Connection Details**
1. Click on your cluster
2. Copy the **Public URL**
3. Example: `https://your-cluster.consul.hashicorp.cloud`

#### **Step 4: Add to Render**
1. Go to Render Dashboard
2. Select your service
3. Go to "Environment" tab
4. Add variable:
   - **Key:** `CONSUL_HOST`
   - **Value:** Your Consul URL from step 3
5. Save and redeploy

### **Option B: Skip Consul (Not Critical)**
Consul is optional for service discovery. Your app works fine without it using hardcoded service URLs.

---

## 4️⃣ **WebSocket Server Setup**

### **Option A: Deploy to Render**

#### **Step 1: Create websocket-server.js**
Already created in your project!

#### **Step 2: Create New Web Service on Render**
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. **Name:** food-delivery-websocket
5. **Environment:** Node
6. **Build Command:** `npm install`
7. **Start Command:** `node websocket-server.js`
8. **Plan:** Free
9. Click "Create Web Service"

#### **Step 3: Add Environment Variables**
Add these to the WebSocket service:
- `PORT`: 8080
- `JWT_SECRET`: (same as your main service)
- `REDIS_URL`: (your Redis URL)

#### **Step 4: Update Frontend**
Add WebSocket URL to frontend:
```typescript
const WS_URL = 'wss://food-delivery-websocket.onrender.com';
```

### **Option B: Use Render's Main Service (Simpler)**
WebSocket can run alongside your API Gateway. Already configured in ecosystem.config.js!

---

## 5️⃣ **Monitoring Stack Setup**

### **Option A: Self-Hosted (Docker Compose)**

#### **Step 1: Deploy Monitoring Stack**
```bash
# On your local machine or VPS
cd food-delivery-platform
docker-compose -f docker-compose.monitoring.yml up -d
```

#### **Step 2: Access Dashboards**
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3001 (admin/admin)
- **Jaeger:** http://localhost:16686

#### **Step 3: Configure Grafana**
1. Login to Grafana
2. Add Prometheus data source: http://prometheus:9090
3. Import dashboard from `infrastructure/grafana/dashboards/`

### **Option B: Cloud Monitoring (Recommended)**

#### **Grafana Cloud (FREE)**
1. Go to https://grafana.com/auth/sign-up/create-user
2. Sign up for free account
3. Create new stack
4. Get Prometheus remote write URL
5. Add to Render environment:
   - `GRAFANA_CLOUD_URL`: Your remote write URL
   - `GRAFANA_CLOUD_API_KEY`: Your API key

#### **Datadog (FREE Tier)**
1. Go to https://www.datadoghq.com
2. Sign up for free trial
3. Get API key
4. Add to Render:
   - `DATADOG_API_KEY`: Your API key

---

## 📋 **COMPLETE ENVIRONMENT VARIABLES CHECKLIST**

### **Required (Already Set):**
- ✅ `DATABASE_URL` - PostgreSQL connection
- ✅ `JWT_SECRET` - Authentication secret
- ✅ `PORT` - Service port

### **Optional (To Add):**
- ⬜ `RABBITMQ_URL` - Message queue
- ⬜ `REDIS_URL` - Cache
- ⬜ `CONSUL_HOST` - Service discovery
- ⬜ `GRAFANA_CLOUD_URL` - Monitoring
- ⬜ `GRAFANA_CLOUD_API_KEY` - Monitoring auth

---

## 🎯 **QUICK START (Recommended Order)**

### **Day 1: Core Infrastructure**
1. ✅ Set up RabbitMQ (5 minutes)
2. ✅ Set up Redis (5 minutes)
3. ✅ Add environment variables to Render
4. ✅ Redeploy services

### **Day 2: Real-time Features**
5. ✅ Deploy WebSocket server
6. ✅ Test real-time notifications

### **Day 3: Monitoring**
7. ✅ Set up Grafana Cloud
8. ✅ Configure dashboards

### **Optional: Service Discovery**
9. ⬜ Set up Consul (only if needed)

---

## 🧪 **TESTING AFTER SETUP**

### **Test RabbitMQ:**
```bash
# Check if events are being published
curl https://food-delevery-app-g73l.onrender.com/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"...","items":[...]}'

# Check RabbitMQ management console
# https://your-instance.cloudamqp.com (login with your credentials)
```

### **Test Redis:**
```bash
# Check if caching is working
curl https://food-delevery-app-g73l.onrender.com/api/restaurants
# First call: slow (database)
# Second call: fast (cache)
```

### **Test WebSocket:**
```javascript
// In browser console
const ws = new WebSocket('wss://food-delivery-websocket.onrender.com');
ws.onopen = () => console.log('Connected!');
ws.onmessage = (msg) => console.log('Message:', msg.data);
```

---

## 💰 **COST BREAKDOWN**

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **RabbitMQ** | Little Lemur | FREE | 1M messages/month |
| **Redis** | Free Tier | FREE | 10K commands/day |
| **Consul** | Development | FREE | 1 cluster |
| **Grafana Cloud** | Free Tier | FREE | 10K series |
| **Render** | Free | FREE | 750 hours/month |

**Total Monthly Cost: $0** 🎉

---

## 🚨 **TROUBLESHOOTING**

### **RabbitMQ Connection Failed**
- Check RABBITMQ_URL format: `amqps://user:pass@host/vhost`
- Verify CloudAMQP instance is running
- Check Render logs for connection errors

### **Redis Connection Failed**
- Check REDIS_URL format: `rediss://default:pass@host:6379`
- Verify Upstash database is active
- Test connection with redis-cli

### **WebSocket Not Connecting**
- Check WSS (not WS) for HTTPS sites
- Verify WebSocket service is deployed
- Check CORS settings

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify each component:

- [ ] RabbitMQ: Check CloudAMQP dashboard for connections
- [ ] Redis: Check Upstash dashboard for commands
- [ ] WebSocket: Test connection from browser
- [ ] Monitoring: See metrics in Grafana
- [ ] All services: Check Render logs for "Connected to..."

---

**🎉 Once complete, your application will have enterprise-grade infrastructure!**
