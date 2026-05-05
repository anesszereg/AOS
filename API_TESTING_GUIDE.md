# API Testing Guide

## 📦 Postman Collection

**File**: `Food-Delivery-API.postman_collection.json`

### **Import to Postman:**
1. Open Postman
2. Click "Import" button
3. Select `Food-Delivery-API.postman_collection.json`
4. Collection will be imported with all endpoints

---

## 🔧 Setup

### **Base URL:**
```
http://localhost:3000/api
```

### **Collection Variables:**
The collection uses variables that auto-populate:
- `{{baseUrl}}` - API base URL
- `{{token}}` - Auth token (auto-set on login)
- `{{restaurantId}}` - Restaurant ID (auto-set)
- `{{menuItemId}}` - Menu item ID (auto-set)
- `{{orderId}}` - Order ID (auto-set)

---

## 🧪 Testing Workflow

### **Step 1: Health Check**
```
GET http://localhost:3000/health
```
Expected: `{"status": "ok"}`

### **Step 2: Login**
Use one of these accounts:

**Customer:**
```json
POST /api/auth/login
{
  "email": "customer1@example.com",
  "password": "password123"
}
```

**Restaurant Owner:**
```json
POST /api/auth/login
{
  "email": "owner1@restaurant.com",
  "password": "password123"
}
```

**Admin:**
```json
POST /api/auth/login
{
  "email": "admin@fooddelivery.com",
  "password": "password123"
}
```

**Driver:**
```json
POST /api/auth/login
{
  "email": "driver1@delivery.com",
  "password": "password123"
}
```

✅ Token will be automatically saved to `{{token}}` variable

### **Step 3: Test Endpoints**
Now you can test any endpoint. The token is automatically included in headers.

---

## 📋 All API Endpoints

### **🔐 Authentication** (5 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/refresh` | Refresh token | Yes |

**Test Account Credentials:**
- All passwords: `password123`
- See SEED_DATA_INFO.md for all accounts

---

### **🍽️ Restaurants** (7 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/restaurants` | Get all restaurants | No |
| GET | `/restaurants/:id` | Get restaurant by ID | No |
| GET | `/restaurants?cuisine=Italian` | Search restaurants | No |
| GET | `/restaurants/my-restaurant` | Get my restaurant | Yes (Owner) |
| POST | `/restaurants` | Create restaurant | Yes (Owner) |
| PUT | `/restaurants/:id` | Update restaurant | Yes (Owner) |
| DELETE | `/restaurants/:id` | Delete restaurant | Yes (Owner) |

**Example: Get All Restaurants**
```bash
curl http://localhost:3000/api/restaurants
```

**Example: Create Restaurant**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Restaurant",
    "cuisine": "French",
    "description": "Fine dining",
    "address": "123 Main St, City, State 12345",
    "phone": "+1234567890",
    "email": "contact@restaurant.com"
  }'
```

---

### **📋 Menu** (5 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/menu/restaurant/:id` | Get menu for restaurant | No |
| POST | `/menu` | Create menu item | Yes (Owner) |
| PUT | `/menu/:id` | Update menu item | Yes (Owner) |
| PATCH | `/menu/:id/availability` | Toggle availability | Yes (Owner) |
| DELETE | `/menu/:id` | Delete menu item | Yes (Owner) |

**Example: Get Menu**
```bash
curl http://localhost:3000/api/menu/restaurant/RESTAURANT_ID
```

**Example: Create Menu Item**
```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "name": "Delicious Dish",
    "description": "Amazing food",
    "price": 19.99,
    "category": "Main Course",
    "isAvailable": true
  }'
```

---

### **👥 Users** (2 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get my profile | Yes |
| PUT | `/users/profile` | Update my profile | Yes |

**Example: Get Profile**
```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### **📦 Orders** (8 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order | Yes (Customer) |
| GET | `/orders/my-orders` | Get my orders | Yes |
| GET | `/orders/:id` | Get order by ID | Yes |
| PATCH | `/orders/:id/status` | Update order status | Yes |
| GET | `/orders/restaurant/:id` | Get restaurant orders | Yes (Owner) |
| PATCH | `/orders/:id/accept` | Accept order | Yes (Owner) |
| PATCH | `/orders/:id/complete` | Complete order | Yes |
| PATCH | `/orders/:id/cancel` | Cancel order | Yes |

**Example: Create Order**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "items": [
      {
        "menuItemId": "MENU_ITEM_ID",
        "quantity": 2
      }
    ],
    "deliveryAddress": "123 Main St, City, State 12345",
    "notes": "Please ring doorbell"
  }'
```

---

### **💳 Payments** (3 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/intent` | Create payment intent | Yes |
| POST | `/payments/confirm` | Confirm payment | Yes |
| GET | `/payments/history` | Get payment history | Yes |

**Example: Create Payment Intent**
```bash
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID",
    "amount": 50.00
  }'
```

---

### **🚚 Delivery** (5 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PATCH | `/delivery/drivers/status` | Update driver status | Yes (Driver) |
| GET | `/delivery/drivers/available-orders` | Get available orders | Yes (Driver) |
| PATCH | `/delivery/drivers/location` | Update location | Yes (Driver) |
| GET | `/delivery/drivers/stats` | Get driver stats | Yes (Driver) |
| GET | `/delivery/drivers/active-delivery` | Get active delivery | Yes (Driver) |

**Example: Update Driver Status**
```bash
curl -X PATCH http://localhost:3000/api/delivery/drivers/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "online"}'
```

---

### **👨‍💼 Admin** (7 endpoints)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/admin/users` | Get all users | Yes (Admin) |
| GET | `/users/admin/users?role=customer` | Filter users by role | Yes (Admin) |
| PATCH | `/users/admin/users/:id/status` | Update user status | Yes (Admin) |
| GET | `/users/admin/stats` | Get platform stats | Yes (Admin) |
| GET | `/restaurants/admin/restaurants/pending` | Get pending restaurants | Yes (Admin) |
| PATCH | `/restaurants/admin/restaurants/:id/approve` | Approve restaurant | Yes (Admin) |
| PATCH | `/restaurants/admin/restaurants/:id/reject` | Reject restaurant | Yes (Admin) |

**Example: Get Platform Stats**
```bash
curl http://localhost:3000/api/users/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example: Get All Users**
```bash
curl http://localhost:3000/api/users/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Testing Scenarios

### **Scenario 1: Customer Orders Food**

1. **Login as Customer**
   ```
   POST /auth/login
   Email: customer1@example.com
   ```

2. **Browse Restaurants**
   ```
   GET /restaurants
   ```

3. **View Menu**
   ```
   GET /menu/restaurant/{restaurantId}
   ```

4. **Create Order**
   ```
   POST /orders
   ```

5. **View My Orders**
   ```
   GET /orders/my-orders
   ```

---

### **Scenario 2: Restaurant Owner Manages Menu**

1. **Login as Owner**
   ```
   POST /auth/login
   Email: owner1@restaurant.com
   ```

2. **Get My Restaurant**
   ```
   GET /restaurants/my-restaurant
   ```

3. **Add Menu Item**
   ```
   POST /menu
   ```

4. **Update Menu Item**
   ```
   PUT /menu/{menuItemId}
   ```

5. **View Restaurant Orders**
   ```
   GET /orders/restaurant/{restaurantId}
   ```

---

### **Scenario 3: Admin Manages Platform**

1. **Login as Admin**
   ```
   POST /auth/login
   Email: admin@fooddelivery.com
   ```

2. **View Platform Stats**
   ```
   GET /users/admin/stats
   ```

3. **Get All Users**
   ```
   GET /users/admin/users
   ```

4. **Get Pending Restaurants**
   ```
   GET /restaurants/admin/restaurants/pending
   ```

5. **Approve Restaurant**
   ```
   PATCH /restaurants/admin/restaurants/{id}/approve
   ```

---

### **Scenario 4: Driver Delivers Order**

1. **Login as Driver**
   ```
   POST /auth/login
   Email: driver1@delivery.com
   ```

2. **Go Online**
   ```
   PATCH /delivery/drivers/status
   Body: {"status": "online"}
   ```

3. **Get Available Orders**
   ```
   GET /delivery/drivers/available-orders
   ```

4. **Update Location**
   ```
   PATCH /delivery/drivers/location
   Body: {"lat": 40.7128, "lng": -74.0060}
   ```

---

## 📊 Response Formats

### **Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### **Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### **Paginated Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100
  }
}
```

---

## 🔑 Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

The Postman collection automatically handles this using the `{{token}}` variable.

---

## ⚠️ Common Issues

### **401 Unauthorized**
- Token expired or invalid
- Solution: Login again to get new token

### **403 Forbidden**
- User doesn't have permission
- Solution: Use correct role (admin, owner, etc.)

### **404 Not Found**
- Resource doesn't exist
- Solution: Check ID is correct

### **500 Internal Server Error**
- Server error
- Solution: Check server logs

---

## 📝 Tips

1. **Use Postman Collection** - Automatically handles tokens and IDs
2. **Test in Order** - Login first, then test other endpoints
3. **Check Variables** - Ensure `{{token}}`, `{{restaurantId}}`, etc. are set
4. **Use Different Roles** - Test with customer, owner, admin, driver accounts
5. **Check Responses** - Verify data structure matches expected format

---

## ✅ Quick Test Checklist

- [ ] Health check works
- [ ] Can register new user
- [ ] Can login with test accounts
- [ ] Can get all restaurants
- [ ] Can get menu items
- [ ] Can create order (as customer)
- [ ] Can view orders (as owner)
- [ ] Can access admin panel (as admin)
- [ ] Can update driver status (as driver)
- [ ] All CRUD operations work

---

## 🚀 Total Endpoints: 47

- Authentication: 5
- Restaurants: 7
- Menu: 5
- Users: 2
- Orders: 8
- Payments: 3
- Delivery: 5
- Admin: 7
- Health: 1

**All endpoints documented and ready to test!**
