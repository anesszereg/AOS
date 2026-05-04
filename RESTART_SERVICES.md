# 🔄 Restart Services to Load Admin Endpoints

**Issue:** The admin endpoints are implemented but services need to be restarted to load the new code.

---

## 🚀 **QUICK FIX - Restart Services**

### **Option 1: Restart with Docker Compose (Recommended)**

```bash
# Stop all services
docker-compose down

# Rebuild and start services
docker-compose up --build -d

# Check logs
docker-compose logs -f user-service
```

### **Option 2: Restart User Service Only**

```bash
# Stop user-service container
docker-compose stop user-service

# Rebuild user-service
docker-compose build user-service

# Start user-service
docker-compose up -d user-service

# Check logs
docker-compose logs -f user-service
```

### **Option 3: Development Mode (Without Docker)**

```bash
# Navigate to user-service
cd services/user-service

# Install dependencies (if needed)
npm install

# Build the service
npm run build

# Start in development mode
npm run dev
```

---

## ✅ **VERIFY IT'S WORKING**

### **1. Check Service Health**
```bash
curl http://localhost:3001/health
# Should return: {"status":"healthy","service":"user-service"}
```

### **2. Test Admin Endpoint**
```bash
# First, login as admin to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123456!"}'

# Copy the access_token from response

# Test admin stats endpoint
curl http://localhost:3001/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return user statistics, not 404
```

### **3. Test in Frontend**
```bash
# Login as admin in the frontend
Email: admin@test.com
Password: Test123456!

# Navigate to admin pages
# Should see real data instead of empty states
```

---

## 📋 **WHAT TO EXPECT**

### **Before Restart:**
```
❌ GET /admin/users → 404 Not Found
❌ GET /admin/stats → 404 Not Found
⚠️ Console warnings: "Admin endpoint not implemented"
```

### **After Restart:**
```
✅ GET /admin/users → 200 OK with user data
✅ GET /admin/stats → 200 OK with statistics
✅ No console warnings
✅ Admin pages show real data
```

---

## 🐛 **TROUBLESHOOTING**

### **If services don't start:**

1. **Check Docker is running**
   ```bash
   docker ps
   ```

2. **Check for port conflicts**
   ```bash
   lsof -i :3001  # User service port
   ```

3. **View service logs**
   ```bash
   docker-compose logs user-service
   ```

4. **Check database connection**
   ```bash
   docker-compose logs postgres
   ```

### **If still getting 404:**

1. **Verify the build included new files**
   ```bash
   cd services/user-service
   ls -la dist/controllers/
   # Should see: admin.controller.js
   
   ls -la dist/routes/
   # Should see: admin.routes.js
   ```

2. **Check if routes are mounted**
   ```bash
   # Look for this in logs:
   docker-compose logs user-service | grep "admin"
   ```

---

## 🔍 **CHECK WHAT'S RUNNING**

```bash
# See all running services
docker-compose ps

# Or check processes
ps aux | grep node

# Check which ports are in use
netstat -an | grep LISTEN | grep 300
```

---

## 📝 **QUICK COMMANDS**

```bash
# Full restart (recommended)
docker-compose down && docker-compose up --build -d

# Watch logs
docker-compose logs -f

# Restart just one service
docker-compose restart user-service

# Check service health
curl http://localhost:3001/health
```

---

## ✅ **EXPECTED RESULT**

After restarting, when you login as admin and navigate to admin pages:

- ✅ **Dashboard** - Shows real user statistics
- ✅ **User Management** - Shows list of all users
- ✅ **No 404 errors** in console
- ✅ **No warnings** about unimplemented endpoints

---

**Status:** 🟡 **Services need restart to load new code**

**Action Required:** Run `docker-compose restart user-service` or `docker-compose up --build -d`
