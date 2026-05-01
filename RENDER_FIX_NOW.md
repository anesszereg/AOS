# 🚨 URGENT: Fix Render Database Connection

## ❌ Current Error
```
ECONNREFUSED ::1:5432 - Failed to start server
```

Your services can't connect to the database because `DATABASE_URL` is not set in Render.

---

## ✅ QUICK FIX (5 minutes)

### Step 1: Get Your Database URL

**Option A: Using Neon (Recommended - Free)**
1. Go to https://console.neon.tech
2. Sign in / Sign up
3. Create a new project (if you haven't)
4. Copy the connection string - looks like:
   ```
   postgresql://username:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
   ```

**Option B: Using Render PostgreSQL**
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Name it `food-delivery-db`
4. Select "Free" plan
5. Click "Create Database"
6. Copy the "External Database URL"

### Step 2: Add to Render Environment

1. Go to https://dashboard.render.com
2. Click on your `food-delivery-backend` service
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"**
5. Add:
   ```
   Key: DATABASE_URL
   Value: [paste your database URL here]
   ```
6. Click **"Save Changes"**

### Step 3: Wait for Redeploy

- Render will automatically redeploy (takes 5-10 minutes)
- Watch the logs - you should see services starting successfully

---

## 🎯 What You Should See After Fix

### ✅ Good Logs (Success):
```
🚀 API Gateway listening on port 10000
📊 Health check: http://localhost:10000/health
==> Your service is live 🎉

[info]: Database schema initialized successfully {"service":"auth-service"}
[info]: Auth service listening on port 3001 {"service":"auth-service"}
[info]: User service listening on port 3002 {"service":"user-service"}
[info]: Restaurant service listening on port 3003 {"service":"restaurant-service"}
... (all 8 services starting)
```

### ❌ Bad Logs (Current):
```
[error]: Failed to start server {"service":"user-service","error":{"errno":-111,"code":"ECONNREFUSED"}}
PM2 log: App [user-service:2] exited with code [1]
```

---

## 🔍 Optional: Add Redis & RabbitMQ

If you want full functionality, also add:

### Redis (Upstash - Free)
1. Go to https://console.upstash.com
2. Create Redis database
3. Copy the connection string
4. Add to Render:
   ```
   Key: REDIS_URL
   Value: [your upstash redis url]
   ```

### RabbitMQ (CloudAMQP - Free)
1. Go to https://customer.cloudamqp.com
2. Create instance
3. Copy the AMQP URL
4. Add to Render:
   ```
   Key: RABBITMQ_URL
   Value: [your cloudamqp url]
   ```

---

## 📊 Check If It's Working

### Method 1: Check Render Logs
1. Go to your service in Render
2. Click "Logs" tab
3. Look for "Database schema initialized successfully"

### Method 2: Test Health Endpoint
```bash
curl https://food-delevery-app-g73l.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T20:30:00.000Z"
}
```

### Method 3: Test Auth Endpoint
```bash
curl https://food-delevery-app-g73l.onrender.com/auth/health
```

---

## 🚨 Common Issues

### Issue 1: "Connection timeout"
**Solution:** Make sure your DATABASE_URL includes `?sslmode=require` for Neon

### Issue 2: "Too many connections"
**Solution:** Neon free tier has limits. Reduce pool size or upgrade.

### Issue 3: "Still seeing ECONNREFUSED"
**Solution:** 
1. Make sure you clicked "Save Changes" in Render
2. Wait for redeploy to complete
3. Check the environment variable is actually set (Environment tab)

---

## 📝 Current Environment Variables Needed

**Required:**
- ✅ `PORT=10000` (already set)
- ✅ `NODE_ENV=production` (already set)
- ✅ `JWT_SECRET` (already set - auto-generated)
- ❌ `DATABASE_URL` **← YOU NEED TO ADD THIS**

**Optional (for full features):**
- ⚪ `REDIS_URL` (for caching)
- ⚪ `RABBITMQ_URL` (for messaging)

---

## 🎯 Next Steps After Fix

1. **Verify services are running** - Check Render logs
2. **Test frontend** - Try to login/register
3. **Check CORS** - Make sure frontend can call backend
4. **Monitor** - Watch for any other errors

---

## 💡 Pro Tips

1. **Use Neon** - It's free and works great with Render
2. **Enable SSL** - Always use `?sslmode=require` in connection string
3. **Monitor logs** - Keep Render logs open during deployment
4. **Test locally** - Set DATABASE_URL locally to test before deploying

---

## 🆘 Still Not Working?

If you're still having issues:

1. **Check the exact error** in Render logs
2. **Verify DATABASE_URL format**:
   ```
   postgresql://user:pass@host:5432/dbname?sslmode=require
   ```
3. **Test connection** from your local machine:
   ```bash
   psql "your-database-url-here" -c "SELECT version();"
   ```

---

## ✅ Quick Checklist

- [ ] Created Neon database (or Render PostgreSQL)
- [ ] Copied connection string
- [ ] Added DATABASE_URL to Render environment
- [ ] Clicked "Save Changes"
- [ ] Waited for redeploy
- [ ] Checked logs for success messages
- [ ] Tested health endpoint
- [ ] Tested frontend login

---

**🚀 Once DATABASE_URL is set, your services will start working!**

Let me know when you've added it and I'll help verify it's working!
