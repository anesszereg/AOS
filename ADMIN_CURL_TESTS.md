# Admin Endpoints - cURL Testing Guide

## 🔐 **Step 1: Get Admin Token**

First, you need to login as an admin user to get an access token.

### Option A: Login with existing admin account

```bash
curl -X POST https://food-delevery-app-g73l.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-admin-password"
  }'
```

### Option B: Create new admin account (if you don't have one)

```bash
curl -X POST https://food-delevery-app-g73l.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fooddelivery.com",
    "password": "Admin@123",
    "role": "admin",
    "name": "Admin User"
  }'
```

**Save the `accessToken` from the response!**

---

## 📋 **Step 2: Test Admin Endpoints**

Replace `YOUR_TOKEN_HERE` with the actual token from Step 1.

### ✅ **Test 1: Get All Users**

```bash
curl -X GET "https://food-delevery-app-g73l.onrender.com/api/users/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "customer",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### ✅ **Test 2: Get Users by Role (Filter)**

```bash
curl -X GET "https://food-delevery-app-g73l.onrender.com/api/users/admin/users?role=customer" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Try different roles:**
- `?role=customer`
- `?role=restaurant`
- `?role=driver`
- `?role=admin`

---

### ✅ **Test 3: Get Platform Statistics**

```bash
curl -X GET "https://food-delevery-app-g73l.onrender.com/api/users/admin/stats" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 0,
    "totalOrders": 0,
    "activeUsers": 5,
    "activeRestaurants": 2,
    "activeDrivers": 0,
    "todayOrders": 0
  }
}
```

---

### ✅ **Test 4: Get Pending Restaurant Applications**

```bash
curl -X GET "https://food-delevery-app-g73l.onrender.com/api/restaurants/admin/restaurants/pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "New Restaurant",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### ✅ **Test 5: Update User Status**

First, get a user ID from Test 1, then:

```bash
curl -X PATCH "https://food-delevery-app-g73l.onrender.com/api/users/admin/users/USER_ID_HERE/status" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "suspended"
  }'
```

**Status options:**
- `"active"` - Activate user
- `"suspended"` - Suspend user

---

### ✅ **Test 6: Approve Restaurant**

First, get a restaurant ID from Test 4, then:

```bash
curl -X PATCH "https://food-delevery-app-g73l.onrender.com/api/restaurants/admin/restaurants/RESTAURANT_ID_HERE/approve" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

### ✅ **Test 7: Reject Restaurant**

```bash
curl -X PATCH "https://food-delevery-app-g73l.onrender.com/api/restaurants/admin/restaurants/RESTAURANT_ID_HERE/reject" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Incomplete documentation"
  }'
```

---

## 🧪 **Quick Test Script**

Save this as `test-admin.sh`:

```bash
#!/bin/bash

# Set your token here
TOKEN="YOUR_TOKEN_HERE"
BASE_URL="https://food-delevery-app-g73l.onrender.com"

echo "Testing Admin Endpoints..."
echo ""

echo "1. Get All Users:"
curl -s -X GET "$BASE_URL/api/admin/users" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "2. Get Platform Stats:"
curl -s -X GET "$BASE_URL/api/admin/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "3. Get Pending Restaurants:"
curl -s -X GET "$BASE_URL/api/admin/restaurants/pending" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

Then run:
```bash
chmod +x test-admin.sh
./test-admin.sh
```

---

## 🔍 **Troubleshooting**

### **401 Unauthorized**
- Token expired or invalid
- Not logged in as admin
- Token not in correct format

**Solution:** Login again and get a fresh token

### **403 Forbidden**
- User is not an admin
- Role check failing

**Solution:** Make sure you registered with `"role": "admin"`

### **404 Not Found**
- Endpoint not mounted correctly
- Service not running

**Solution:** Check Render logs for service startup

### **500 Internal Server Error**
- Database connection issue
- Service crashed

**Solution:** Check Render logs for error details

---

## 📊 **Expected Results**

After testing, you should see:

✅ **Working:**
- Get all users (returns array of users)
- Get users by role (filtered array)
- Get platform stats (returns statistics object)
- Get pending restaurants (returns array)
- Update user status (returns updated user)
- Approve restaurant (returns approved restaurant)
- Reject restaurant (returns rejected restaurant)

❌ **Not Working (Expected):**
- Support tickets endpoints (not implemented)
- Coupon endpoints (not implemented)

---

## 💡 **Tips**

1. **Use jq for pretty output:**
   ```bash
   curl ... | jq '.'
   ```

2. **Save token to variable:**
   ```bash
   TOKEN=$(curl -X POST .../login -d '...' | jq -r '.data.accessToken')
   ```

3. **Check response status:**
   ```bash
   curl -w "\nHTTP Status: %{http_code}\n" ...
   ```

4. **Verbose output for debugging:**
   ```bash
   curl -v ...
   ```

---

## 🎯 **Next Steps**

1. Run the tests above
2. Check which endpoints work
3. Report any errors
4. Test in Postman for easier debugging
