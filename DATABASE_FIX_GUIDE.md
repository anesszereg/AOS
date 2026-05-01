# 🔧 Database Connection Fix for Render

## ❌ Current Problem

Your services are failing with:
```
ECONNREFUSED ::1:5432
```

This means they're trying to connect to localhost PostgreSQL, but you need to connect to your Neon database.

## 🎯 Solution

You need to add the `DATABASE_URL` environment variable in Render.

---

## 📝 Step-by-Step Fix

### 1. Get Your Neon Database URL

Go to [Neon Console](https://console.neon.tech) and copy your connection string. It should look like:
```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. Add Environment Variable in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your `food-delivery-backend` service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string (paste it)
6. Click **Save Changes**

### 3. Optional: Add Redis and RabbitMQ

If you're using Redis and RabbitMQ:

**For Redis (Upstash):**
- Key: `REDIS_URL`
- Value: Your Upstash Redis URL

**For RabbitMQ (CloudAMQP):**
- Key: `RABBITMQ_URL`
- Value: Your CloudAMQP URL

### 4. Redeploy

After adding environment variables:
- Render will automatically redeploy
- Or click "Manual Deploy" → "Deploy latest commit"

---

## 🔍 Alternative: Use Individual Variables

If you prefer to use separate variables instead of DATABASE_URL, add these in Render:

```
DATABASE_HOST=ep-xxx-xxx.us-east-2.aws.neon.tech
DATABASE_PORT=5432
DATABASE_NAME=neondb
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
```

---

## ✅ Verification

After deployment, check the logs. You should see:
```
✅ Database schema initialized successfully
✅ Auth service listening on port 3001
✅ User service listening on port 3002
... (all services starting)
```

Instead of:
```
❌ ECONNREFUSED ::1:5432
```

---

## 🚨 Important Notes

1. **SSL Required:** Neon requires SSL, make sure your connection string has `?sslmode=require`
2. **Free Tier:** Neon free tier has connection limits (watch your pool size)
3. **Environment:** Make sure `NODE_ENV=production` is set

---

## 📞 Quick Fix Commands

If you want to test locally first:

```bash
# Export the DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

---

## 🎯 Expected Result

After fixing, your Render logs should show:
```
🚀 API Gateway listening on port 10000
✅ Database schema initialized successfully
✅ Auth service listening on port 3001
✅ User service listening on port 3002
✅ Restaurant service listening on port 3003
✅ Menu service listening on port 3004
✅ Order service listening on port 3005
✅ Payment service listening on port 3006
✅ Delivery service listening on port 3007
✅ Notification service listening on port 3008
```

---

**Need help getting your Neon URL? Let me know!**
