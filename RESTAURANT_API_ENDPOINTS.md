# Restaurant Service API Endpoints

**Base URL:** `https://food-delevery-app-g73l.onrender.com/api`

## Authentication
Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📋 **PUBLIC ENDPOINTS** (No Auth Required)

### 1. Get All Restaurants
```
GET /restaurants
```

**Query Parameters:**
- `cuisine` (optional): Filter by cuisine type
- `search` (optional): Search by name
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```
GET /restaurants?cuisine=Italian&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Restaurant Name",
      "cuisine": "Italian",
      "rating": 4.5,
      "estimated_delivery_time": "30-45 min",
      "delivery_fee": 2.99,
      "description": "Description",
      "address_street": "123 Main St",
      "address_city": "City",
      "address_state": "State",
      "address_zip": "12345",
      "phone": "+1234567890",
      "email": "restaurant@example.com",
      "image": "https://...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Search Restaurants
```
GET /restaurants/search?q=pizza
```

**Query Parameters:**
- `q` (required): Search query

**Response:** Same as Get All Restaurants

---

### 3. Get Restaurant by ID
```
GET /restaurants/:id
```

**Example:**
```
GET /restaurants/a9af60b4-09ed-4d57-8220-d27f8a2732f0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a9af60b4-09ed-4d57-8220-d27f8a2732f0",
    "name": "Restaurant 59",
    "cuisine": "Algerian",
    "rating": 4.2,
    "estimated_delivery_time": "20-30 min",
    "delivery_fee": 228.18,
    "description": "Quality food and great service #59",
    "address_street": "121 Rue Hydra",
    "address_city": "Annaba",
    "address_state": "Blida",
    "address_zip": "76853",
    "phone": "+213883152820",
    "email": "restaurant59@example.com",
    "image": "https://...",
    "owner_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 🔒 **PROTECTED ENDPOINTS** (Auth Required)

### 4. Get My Restaurant
```
GET /restaurants/my-restaurant
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Restaurant",
    "cuisine": "Italian",
    "rating": 4.5,
    "estimated_delivery_time": "30-45 min",
    "delivery_fee": 2.99,
    "description": "Description",
    "address_street": "123 Main St",
    "address_city": "City",
    "address_state": "State",
    "address_zip": "12345",
    "phone": "+1234567890",
    "email": "restaurant@example.com",
    "image": "https://...",
    "owner_id": "your-user-id",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error (404 - No Restaurant):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "No restaurant found for this owner"
  }
}
```

---

### 5. Create Restaurant
```
POST /restaurants
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "My New Restaurant",
  "cuisine": "Italian",
  "description": "Best Italian food in town",
  "address": "123 Main St, City, State, 12345",
  "phone": "+1234567890",
  "email": "myrestaurant@example.com",
  "image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "My New Restaurant",
    "cuisine": "Italian",
    "rating": 0,
    "estimated_delivery_time": "30-45 min",
    "delivery_fee": 0,
    "description": "Best Italian food in town",
    "address_street": "123 Main St",
    "address_city": "City",
    "address_state": "State",
    "address_zip": "12345",
    "phone": "+1234567890",
    "email": "myrestaurant@example.com",
    "image": "https://example.com/image.jpg",
    "owner_id": "your-user-id",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 6. Update Restaurant
```
PUT /restaurants/:id
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Updated Restaurant Name",
  "cuisine": "French",
  "description": "Updated description",
  "address": "456 New St, New City, New State, 54321",
  "phone": "+9876543210",
  "email": "updated@example.com",
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Restaurant Name",
    "cuisine": "French",
    ...
  }
}
```

**Error (403 - Not Owner):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to update this restaurant"
  }
}
```

**Error (404 - Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Restaurant not found"
  }
}
```

---

### 7. Delete Restaurant
```
DELETE /restaurants/:id
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

---

## 🧪 **POSTMAN TESTING GUIDE**

### Step 1: Get Access Token
1. Login via auth service to get access token
2. Copy the `accessToken` from response

### Step 2: Set Environment Variables
Create Postman environment with:
- `BASE_URL`: `https://food-delevery-app-g73l.onrender.com/api`
- `ACCESS_TOKEN`: `your-token-here`

### Step 3: Test Public Endpoints
```
GET {{BASE_URL}}/restaurants
GET {{BASE_URL}}/restaurants/search?q=pizza
GET {{BASE_URL}}/restaurants/a9af60b4-09ed-4d57-8220-d27f8a2732f0
```

### Step 4: Test Protected Endpoints
Add header to all protected requests:
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Test Get My Restaurant:**
```
GET {{BASE_URL}}/restaurants/my-restaurant
```

**Test Create Restaurant:**
```
POST {{BASE_URL}}/restaurants
Body (JSON):
{
  "name": "Test Restaurant",
  "cuisine": "Italian",
  "description": "Test description",
  "address": "123 Test St, Test City, TS, 12345",
  "phone": "+1234567890",
  "email": "test@example.com"
}
```

**Test Update Restaurant:**
```
PUT {{BASE_URL}}/restaurants/YOUR_RESTAURANT_ID
Body (JSON):
{
  "name": "Updated Name",
  "cuisine": "French"
}
```

**Test Delete Restaurant:**
```
DELETE {{BASE_URL}}/restaurants/YOUR_RESTAURANT_ID
```

---

## 🐛 **COMMON ERRORS**

### 500 Internal Server Error
- Check if you're authenticated (Bearer token)
- Verify restaurant ownership for update/delete
- Check address format (should be comma-separated)
- Check Render logs for detailed error

### 404 Not Found
- Restaurant doesn't exist
- Wrong restaurant ID
- No restaurant for authenticated user (my-restaurant endpoint)

### 403 Forbidden
- Trying to update/delete restaurant you don't own
- Invalid or expired token

### 401 Unauthorized
- Missing Authorization header
- Invalid or expired token
- Token not in "Bearer TOKEN" format

---

## 📝 **NOTES**

1. **Address Format:** Address should be a single string with comma-separated parts:
   `"street, city, state, zip"`
   
2. **Owner Verification:** Update and Delete endpoints verify that the authenticated user owns the restaurant

3. **Rating:** Rating is calculated from reviews (default 0 for new restaurants)

4. **Delivery Fee:** Default 0, can be updated later

5. **Estimated Delivery Time:** Default "30-45 min"

---

## 🔗 **RELATED ENDPOINTS**

- **Menu Service:** `/api/menu/restaurant/:restaurantId`
- **Reviews:** `/api/reviews/restaurant/:restaurantId`
- **Orders:** `/api/orders/restaurant/:restaurantId`
