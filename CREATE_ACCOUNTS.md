# 🔐 CREATE TEST ACCOUNTS

## ✅ Solution: Create Accounts via API

The seed script was for MongoDB, but your services use PostgreSQL. I've created a script that creates accounts via the auth-service API instead.

---

## 🚀 RUN THIS TO CREATE ACCOUNTS

```bash
cd "/Users/mac/Desktop/AOS orriject/food-delivery-platform"

# Make sure services are running first
docker compose ps

# Create test accounts
./create-test-accounts.sh
```

---

## 📋 WHAT IT CREATES

### **3 Customer Accounts:**
- ✅ customer1@example.com / password123
- ✅ customer2@example.com / password123
- ✅ customer3@example.com / password123

### **3 Restaurant Accounts:**
- ✅ restaurant1@example.com / password123
- ✅ restaurant2@example.com / password123
- ✅ restaurant3@example.com / password123

### **3 Driver Accounts:**
- ✅ driver1@example.com / password123
- ✅ driver2@example.com / password123
- ✅ driver3@example.com / password123

### **1 Admin Account:**
- ✅ admin@example.com / admin123

---

## 🎮 HOW TO USE

### Step 1: Make Sure Services Are Running
```bash
# Check if auth-service is running
curl http://localhost:3001/health

# If not running, start everything
./integrate-all.sh
```

### Step 2: Create Accounts
```bash
./create-test-accounts.sh
```

You'll see:
```
🔐 Creating Test Accounts...

✅ Auth service is ready

Creating customer accounts...
Creating customer account: customer1@example.com... ✅
Creating customer account: customer2@example.com... ✅
Creating customer account: customer3@example.com... ✅

Creating restaurant accounts...
Creating restaurant account: restaurant1@example.com... ✅
Creating restaurant account: restaurant2@example.com... ✅
Creating restaurant account: restaurant3@example.com... ✅

Creating driver accounts...
Creating driver account: driver1@example.com... ✅
Creating driver account: driver2@example.com... ✅
Creating driver account: driver3@example.com... ✅

Creating admin account...
Creating admin account: admin@example.com... ✅

🎉 Test accounts created successfully!
```

### Step 3: Login
```bash
open http://localhost:3000
```

Use any of the credentials above!

---

## 🔍 VERIFY ACCOUNTS WORK

### Test Customer Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@example.com",
    "password": "password123"
  }'
```

You should get a response with an access token!

### Test Restaurant Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "restaurant1@example.com",
    "password": "password123"
  }'
```

### Test Driver Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver1@example.com",
    "password": "password123"
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

---

## 🎯 COMPLETE CREDENTIALS LIST

### CUSTOMERS (password123):
```
customer1@example.com
customer2@example.com
customer3@example.com
```

### RESTAURANTS (password123):
```
restaurant1@example.com
restaurant2@example.com
restaurant3@example.com
```

### DRIVERS (password123):
```
driver1@example.com
driver2@example.com
driver3@example.com
```

### ADMIN (admin123):
```
admin@example.com
```

---

## 🚨 TROUBLESHOOTING

### "Auth service not ready"
```bash
# Check if auth-service is running
docker compose ps auth-service

# Check logs
docker compose logs auth-service

# Restart auth-service
docker compose restart auth-service

# Wait 10 seconds then try again
./create-test-accounts.sh
```

### "Account already exists"
That's OK! The script will show a warning but continue. The accounts are already created.

### "Connection refused"
```bash
# Make sure services are running
docker compose ps

# If not running, start them
./integrate-all.sh
```

---

## 📝 MANUAL ACCOUNT CREATION

If the script doesn't work, you can create accounts manually via the frontend:

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in:
   - Email: youremail@example.com
   - Password: yourpassword
   - Role: customer/restaurant/driver
4. Click "Register"

---

## ✅ QUICK START

```bash
# 1. Make sure services are running
docker compose ps

# 2. Create accounts
./create-test-accounts.sh

# 3. Login at frontend
open http://localhost:3000

# 4. Use any credential:
# customer1@example.com / password123
```

---

## 🎉 SUMMARY

**Problem**: Old seed script was for MongoDB, but services use PostgreSQL

**Solution**: Create accounts via auth-service API

**How**: Run `./create-test-accounts.sh`

**Result**: 10 test accounts created and ready to use!

---

**Ready to login!** 🚀
