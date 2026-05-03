# 🌱 Quick Seeding Instructions

## ⚠️ **Important Note**

Your database uses **separate databases** for each service:
- `auth_db` - Users
- `restaurant_db` - Restaurants  
- `menu_db` - Menu items
- `user_db` - Profiles

The seeding scripts need to connect to each database separately.

---

## 🚀 **Easiest Method: Use the API**

Since your services are already running and have created the tables, the easiest way to seed data is through the API:

### **1. Run the Existing Seed Script**

You already have `seed-restaurants.sh` which creates restaurants:

```bash
chmod +x seed-restaurants.sh
./seed-restaurants.sh
```

This creates:
- 1 restaurant owner account
- 5 restaurants with data

### **2. Create More Test Users**

```bash
# Create customer accounts
curl -X POST https://food-delevery-app-g73l.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"Test123456!","role":"customer"}'

curl -X POST https://food-delevery-app-g73l.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"customer2@test.com","password":"Test123456!","role":"customer"}'

# Create driver accounts
curl -X POST https://food-delevery-app-g73l.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"driver1@test.com","password":"Test123456!","role":"driver"}'

# Create admin account
curl -X POST https://food-delevery-app-g73l.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123456!","role":"admin"}'
```

---

## ✅ **Current Data Available**

You already have:
- ✅ **3 Restaurants** (from previous seeding)
  - Luigi's Pizzeria
  - Sushi Palace
  - Burger House

These are enough to test the frontend!

---

## 🧪 **Test Credentials**

### **Existing Accounts**
```
owner@restaurant.com - Password: SecurePass123!
```

### **Create These for Testing**
```
customer1@test.com - Password: Test123456!
driver1@test.com - Password: Test123456!
admin@test.com - Password: Test123456!
```

---

## 📝 **Quick Test Script**

Save this as `create-test-users.sh`:

```bash
#!/bin/bash

BASE_URL="https://food-delevery-app-g73l.onrender.com"

echo "Creating test users..."

# Customer
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"Test123456!","role":"customer"}' | jq .

# Driver
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"driver1@test.com","password":"Test123456!","role":"driver"}' | jq .

# Admin
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123456!","role":"admin"}' | jq .

echo "✅ Test users created!"
```

Then run:
```bash
chmod +x create-test-users.sh
./create-test-users.sh
```

---

## 🎯 **What You Can Test Now**

### **Customer Flow**
1. Login as `customer1@test.com`
2. Browse `/browse` - See 3 restaurants
3. Click restaurant - View details
4. Add items to cart
5. Checkout

### **Restaurant Owner Flow**
1. Login as `owner@restaurant.com`
2. View dashboard
3. Manage restaurant
4. View orders

### **Driver Flow**
1. Login as `driver1@test.com`
2. View available orders
3. Accept delivery

### **Admin Flow**
1. Login as `admin@test.com`
2. View all users
3. Manage restaurants

---

## 📊 **Verify Data**

```bash
# Check restaurants
curl https://food-delevery-app-g73l.onrender.com/api/restaurants | jq .

# Should return 3 restaurants
```

---

**You're ready to test!** 🎉
