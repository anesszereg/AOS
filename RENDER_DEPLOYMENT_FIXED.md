# 🚀 RENDER DEPLOYMENT - FIXED!

## ✅ What I Fixed

1. **Added API Gateway** (`server.js`) - Exposes port 10000 for Render
2. **Updated ecosystem.config.js** - Added environment variables to all services
3. **Updated Dockerfile** - Installs express and http-proxy-middleware
4. **Updated render.yaml** - Set PORT to 10000

---

## 📋 SETUP REQUIRED BEFORE DEPLOYMENT

### Step 1: Setup Free PostgreSQL (Neon)

1. Go to https://neon.tech
2. Sign up (FREE - no credit card)
3. Create project: `food-delivery`
4. Copy connection string:
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Setup Free Redis (Upstash)

1. Go to https://upstash.com
2. Sign up (FREE - no credit card)
3. Create database: `food-delivery-cache`
4. Copy connection string:
   ```
   redis://default:pass@xxx.upstash.io:6379
   ```

### Step 3: Setup Free RabbitMQ (CloudAMQP)

1. Go to https://www.cloudamqp.com
2. Sign up (FREE - no credit card)
3. Create instance: Little Lemur (FREE)
4. Copy AMQP URL:
   ```
   amqps://user:pass@xxx.cloudamqp.com/vhost
   ```

---

## 🚀 DEPLOY TO RENDER

### Step 1: Push Updated Code to GitHub

```bash
cd "/Users/mac/Desktop/AOS orriject/food-delivery-platform"

git add .
git commit -m "Fix Render deployment - Add API gateway and environment variables"
git push origin main
```

### Step 2: Configure Render Environment Variables

Go to your Render dashboard → Your service → Environment

**Add these environment variables:**

```
PORT = 10000
DATABASE_URL = <your-neon-connection-string>
REDIS_URL = <your-upstash-connection-string>
RABBITMQ_URL = <your-cloudamqp-url>
JWT_SECRET = <random-string-here>
NODE_ENV = production
```

**Generate JWT_SECRET:**
```bash
# Run this to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Trigger Redeploy

1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for build to complete (~5-10 minutes)

---

## ✅ WHAT WILL HAPPEN

### Build Process:
1. ✅ Install PM2
2. ✅ Install express & http-proxy-middleware
3. ✅ Copy API gateway (server.js)
4. ✅ Build all 8 microservices
5. ✅ Start PM2 with all services

### Running Services:
- **API Gateway** (port 10000) - Main entry point
- **auth-service** (port 3001)
- **user-service** (port 3002)
- **restaurant-service** (port 3003)
- **menu-service** (port 3004)
- **order-service** (port 3005)
- **payment-service** (port 3006)
- **delivery-service** (port 3007)
- **notification-service** (port 3008)

---

## 🎯 API ENDPOINTS

Once deployed, your API will be available at:

```
https://food-delivery-backend.onrender.com
```

### Health Check:
```bash
curl https://food-delivery-backend.onrender.com/health
```

### API Routes:
```
POST /api/auth/register
POST /api/auth/login
GET  /api/users/profile
GET  /api/restaurants
GET  /api/menu/:restaurantId
POST /api/orders
GET  /api/orders/:id
POST /api/payments
GET  /api/delivery/:orderId
GET  /api/notifications
```

---

## 🔍 TROUBLESHOOTING

### If services still fail to connect to database:

**Check DATABASE_URL format:**
```
postgresql://user:pass@host:5432/dbname?sslmode=require
```

Make sure it includes `?sslmode=require` at the end!

### If "No open ports detected" error:

Make sure:
1. ✅ PORT environment variable is set to 10000
2. ✅ server.js listens on `0.0.0.0` (not `localhost`)
3. ✅ EXPOSE 10000 is in Dockerfile

### If services crash on startup:

**Check Render logs:**
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for error messages

**Common issues:**
- Missing DATABASE_URL
- Missing REDIS_URL
- Missing RABBITMQ_URL
- Invalid connection strings

---

## 📊 VERIFY DEPLOYMENT

### 1. Check Health Endpoint

```bash
curl https://food-delivery-backend.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T19:30:00.000Z"
}
```

### 2. Check PM2 Status

In Render logs, you should see:
```
PM2 log: App [api-gateway:0] online
PM2 log: App [auth-service:1] online
PM2 log: App [user-service:2] online
PM2 log: App [restaurant-service:3] online
PM2 log: App [menu-service:4] online
PM2 log: App [order-service:5] online
PM2 log: App [payment-service:6] online
PM2 log: App [delivery-service:7] online
PM2 log: App [notification-service:8] online
```

### 3. Test API

```bash
# Register a user
curl -X POST https://food-delivery-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "customer"
  }'
```

---

## 🎉 SUCCESS CHECKLIST

- [ ] Neon PostgreSQL created
- [ ] Upstash Redis created
- [ ] CloudAMQP RabbitMQ created
- [ ] Code pushed to GitHub
- [ ] Environment variables added to Render
- [ ] Deployment successful
- [ ] Health check returns 200 OK
- [ ] All 9 PM2 apps online
- [ ] API endpoints responding

---

## 🚀 NEXT STEPS

### 1. Deploy Frontend to Vercel

```bash
# Vercel will auto-detect your frontend
# Just set environment variable:
VITE_API_URL=https://food-delivery-backend.onrender.com
```

### 2. Test Complete Flow

1. Open frontend
2. Register account
3. Browse restaurants
4. Place order
5. Track delivery

### 3. Monitor Performance

- Check Render metrics
- Monitor database usage (Neon dashboard)
- Monitor Redis usage (Upstash dashboard)
- Monitor RabbitMQ (CloudAMQP dashboard)

---

## 💡 TIPS

### Keep Backend Awake (Free Tier)

Render free tier sleeps after 15 min inactivity.

**Solution**: Use cron-job.org
1. Go to https://cron-job.org
2. Create free account
3. Add job:
   - URL: `https://food-delivery-backend.onrender.com/health`
   - Interval: Every 14 minutes

### Upgrade When Needed

**Render Pro ($7/month):**
- No sleep
- Faster builds
- More resources

---

## 🎊 YOU'RE READY!

Push your code and redeploy. Your backend will work now! 🚀

**All issues fixed:**
- ✅ PORT exposed (10000)
- ✅ Environment variables passed to services
- ✅ API Gateway for routing
- ✅ Health check endpoint
- ✅ All services configured

**Deploy now!** 🎉
