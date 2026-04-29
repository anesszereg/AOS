# 📡 API Design Specification

## Base URLs

```
Development: http://localhost/api/v1
Production: https://api.fooddelivery.com/v1
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Auth Service API (Port 3001)

### POST /api/v1/auth/register
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "customer|restaurant|driver",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "customer"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /api/v1/auth/login
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "customer"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /api/v1/auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

### POST /api/v1/auth/logout
Logout user

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/v1/auth/verify
Verify token validity

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "customer"
    }
  }
}
```

---

## 2. User Service API (Port 3002)

### GET /api/v1/users/profile
Get current user profile

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "auth_user_id",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "user@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    },
    "avatar": "https://cdn.example.com/avatar.jpg",
    "preferences": {
      "notifications": true,
      "language": "en"
    }
  }
}
```

### PUT /api/v1/users/profile
Update user profile

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": {...}
  }
}
```

### GET /api/v1/users/:userId
Get user by ID (Admin only)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

---

## 3. Restaurant Service API (Port 3003)

### GET /api/v1/restaurants
Get all restaurants

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (optional)
- `cuisine` (optional)
- `rating` (optional, min rating)
- `lat` (optional, for nearby)
- `lng` (optional, for nearby)
- `radius` (optional, in km)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "uuid",
        "name": "Pizza Palace",
        "description": "Best pizza in town",
        "cuisine": "Italian",
        "address": {
          "street": "456 Food St",
          "city": "New York",
          "coordinates": {
            "lat": 40.7128,
            "lng": -74.0060
          }
        },
        "phone": "+1234567890",
        "rating": 4.5,
        "reviewCount": 120,
        "deliveryTime": "30-45 min",
        "minimumOrder": 15.00,
        "deliveryFee": 2.99,
        "isOpen": true,
        "image": "https://cdn.example.com/restaurant.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### GET /api/v1/restaurants/:id
Get restaurant details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "cuisine": "Italian",
    "address": {...},
    "phone": "+1234567890",
    "rating": 4.5,
    "reviewCount": 120,
    "deliveryTime": "30-45 min",
    "minimumOrder": 15.00,
    "deliveryFee": 2.99,
    "isOpen": true,
    "operatingHours": [
      {
        "day": "monday",
        "openTime": "10:00",
        "closeTime": "22:00"
      }
    ],
    "images": ["url1", "url2"]
  }
}
```

### POST /api/v1/restaurants
Create restaurant (Restaurant owner/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Pizza Palace",
  "description": "Best pizza in town",
  "cuisine": "Italian",
  "address": {
    "street": "456 Food St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "phone": "+1234567890",
  "minimumOrder": 15.00,
  "deliveryFee": 2.99,
  "operatingHours": [...]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Pizza Palace",
    ...
  }
}
```

### PUT /api/v1/restaurants/:id
Update restaurant (Restaurant owner/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:** Same as POST

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

### PATCH /api/v1/restaurants/:id/status
Update restaurant status (Restaurant owner/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "isOpen": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isOpen": true
  }
}
```

---

## 4. Menu Service API (Port 3004)

### GET /api/v1/menu/restaurants/:restaurantId
Get menu for restaurant

**Response (200):**
```json
{
  "success": true,
  "data": {
    "restaurantId": "uuid",
    "categories": [
      {
        "id": "uuid",
        "name": "Pizzas",
        "description": "Our delicious pizzas",
        "items": [
          {
            "id": "uuid",
            "name": "Margherita",
            "description": "Classic tomato and mozzarella",
            "price": 12.99,
            "image": "https://cdn.example.com/margherita.jpg",
            "available": true,
            "vegetarian": true,
            "spicy": false,
            "allergens": ["dairy", "gluten"],
            "customizations": [
              {
                "name": "Size",
                "options": ["Small", "Medium", "Large"],
                "required": true
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### POST /api/v1/menu/categories
Create menu category (Restaurant owner/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "restaurantId": "uuid",
  "name": "Pizzas",
  "description": "Our delicious pizzas",
  "displayOrder": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "restaurantId": "uuid",
    "name": "Pizzas",
    "description": "Our delicious pizzas"
  }
}
```

### POST /api/v1/menu/items
Create menu item (Restaurant owner/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "categoryId": "uuid",
  "name": "Margherita",
  "description": "Classic tomato and mozzarella",
  "price": 12.99,
  "image": "https://cdn.example.com/margherita.jpg",
  "vegetarian": true,
  "spicy": false,
  "allergens": ["dairy", "gluten"],
  "customizations": [...]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Margherita",
    ...
  }
}
```

### PUT /api/v1/menu/items/:id
Update menu item (Restaurant owner/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:** Same as POST

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

### PATCH /api/v1/menu/items/:id/availability
Update item availability (Restaurant owner/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "available": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "available": false
  }
}
```

---

## 5. Order Service API (Port 3005)

### POST /api/v1/orders
Create new order (Customer)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "restaurantId": "uuid",
  "items": [
    {
      "menuItemId": "uuid",
      "quantity": 2,
      "customizations": {
        "Size": "Large",
        "Toppings": ["Extra Cheese"]
      },
      "specialInstructions": "No onions"
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "paymentMethod": "card",
  "tip": 5.00,
  "notes": "Ring doorbell"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20240413-001",
    "userId": "uuid",
    "restaurantId": "uuid",
    "items": [...],
    "subtotal": 25.98,
    "deliveryFee": 2.99,
    "tax": 2.60,
    "tip": 5.00,
    "total": 36.57,
    "status": "pending",
    "deliveryAddress": {...},
    "estimatedDeliveryTime": "2024-04-13T13:30:00Z",
    "createdAt": "2024-04-13T12:00:00Z"
  }
}
```

### GET /api/v1/orders
Get user's orders (Customer)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: pending|confirmed|preparing|ready|picked_up|delivered|cancelled)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-20240413-001",
        "restaurantName": "Pizza Palace",
        "total": 36.57,
        "status": "delivered",
        "createdAt": "2024-04-13T12:00:00Z",
        "deliveredAt": "2024-04-13T12:45:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### GET /api/v1/orders/:id
Get order details

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20240413-001",
    "userId": "uuid",
    "restaurantId": "uuid",
    "restaurantName": "Pizza Palace",
    "items": [
      {
        "menuItemId": "uuid",
        "name": "Margherita",
        "quantity": 2,
        "price": 12.99,
        "subtotal": 25.98,
        "customizations": {...}
      }
    ],
    "subtotal": 25.98,
    "deliveryFee": 2.99,
    "tax": 2.60,
    "tip": 5.00,
    "total": 36.57,
    "status": "delivered",
    "paymentStatus": "paid",
    "deliveryAddress": {...},
    "driver": {
      "id": "uuid",
      "name": "Driver Name",
      "phone": "+1234567890",
      "vehicle": "Honda Civic - ABC123"
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2024-04-13T12:00:00Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-04-13T12:02:00Z"
      },
      {
        "status": "preparing",
        "timestamp": "2024-04-13T12:05:00Z"
      },
      {
        "status": "ready",
        "timestamp": "2024-04-13T12:25:00Z"
      },
      {
        "status": "picked_up",
        "timestamp": "2024-04-13T12:30:00Z"
      },
      {
        "status": "delivered",
        "timestamp": "2024-04-13T12:45:00Z"
      }
    ],
    "estimatedDeliveryTime": "2024-04-13T13:30:00Z",
    "createdAt": "2024-04-13T12:00:00Z"
  }
}
```

### PATCH /api/v1/orders/:id/status
Update order status (Restaurant/Driver/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "confirmed|preparing|ready|picked_up|delivered|cancelled",
  "reason": "Optional cancellation reason"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "confirmed",
    "updatedAt": "2024-04-13T12:02:00Z"
  }
}
```

### GET /api/v1/orders/restaurant/:restaurantId
Get restaurant orders (Restaurant owner)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional)
- `date` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [...]
  }
}
```

---

## 6. Payment Service API (Port 3006)

### POST /api/v1/payments/process
Process payment

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "orderId": "uuid",
  "amount": 36.57,
  "method": "card|cash|wallet",
  "cardDetails": {
    "number": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123",
    "name": "John Doe"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "amount": 36.57,
    "status": "success|failed|pending",
    "method": "card",
    "transactionId": "TXN-123456",
    "processedAt": "2024-04-13T12:01:00Z"
  }
}
```

### GET /api/v1/payments/:id
Get payment details

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "amount": 36.57,
    "status": "success",
    "method": "card",
    "transactionId": "TXN-123456",
    "last4": "1111",
    "processedAt": "2024-04-13T12:01:00Z"
  }
}
```

### POST /api/v1/payments/:id/refund
Refund payment (Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "amount": 36.57,
  "reason": "Order cancelled"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "paymentId": "uuid",
    "amount": 36.57,
    "status": "refunded",
    "refundedAt": "2024-04-13T13:00:00Z"
  }
}
```

---

## 7. Delivery Service API (Port 3007)

### GET /api/v1/delivery/available-drivers
Get available drivers (Internal/Admin)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `lat` (required)
- `lng` (required)
- `radius` (default: 5km)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "drivers": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "Driver Name",
        "phone": "+1234567890",
        "vehicleType": "bike|scooter|car",
        "vehicleNumber": "ABC123",
        "rating": 4.8,
        "currentLocation": {
          "lat": 40.7128,
          "lng": -74.0060
        },
        "distance": 2.5
      }
    ]
  }
}
```

### POST /api/v1/delivery/assign
Assign driver to order (System/Admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "orderId": "uuid",
  "driverId": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "driverId": "uuid",
    "status": "assigned",
    "assignedAt": "2024-04-13T12:28:00Z",
    "estimatedPickupTime": "2024-04-13T12:30:00Z",
    "estimatedDeliveryTime": "2024-04-13T12:45:00Z"
  }
}
```

### GET /api/v1/delivery/driver/active
Get driver's active deliveries (Driver)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deliveries": [
      {
        "id": "uuid",
        "orderId": "uuid",
        "orderNumber": "ORD-20240413-001",
        "restaurantName": "Pizza Palace",
        "restaurantAddress": {...},
        "deliveryAddress": {...},
        "customerName": "John Doe",
        "customerPhone": "+1234567890",
        "status": "assigned|picked_up|in_transit|delivered",
        "estimatedDeliveryTime": "2024-04-13T12:45:00Z"
      }
    ]
  }
}
```

### PATCH /api/v1/delivery/:id/location
Update driver location (Driver)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "lat": 40.7128,
  "lng": -74.0060
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "currentLocation": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "updatedAt": "2024-04-13T12:35:00Z"
  }
}
```

### PATCH /api/v1/delivery/:id/status
Update delivery status (Driver)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "picked_up|in_transit|delivered",
  "proof": "Optional delivery proof URL"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "delivered",
    "deliveredAt": "2024-04-13T12:45:00Z"
  }
}
```

---

## 8. Notification Service API (Port 3008)

### POST /api/v1/notifications/send
Send notification (Internal)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "userId": "uuid",
  "type": "email|sms|push",
  "template": "order_confirmed",
  "data": {
    "orderNumber": "ORD-20240413-001",
    "restaurantName": "Pizza Palace",
    "total": 36.57
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "type": "email",
    "status": "sent",
    "sentAt": "2024-04-13T12:02:00Z"
  }
}
```

### GET /api/v1/notifications
Get user notifications

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `read` (optional: true|false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "push",
        "title": "Order Confirmed",
        "message": "Your order #ORD-20240413-001 has been confirmed",
        "read": false,
        "createdAt": "2024-04-13T12:02:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### PATCH /api/v1/notifications/:id/read
Mark notification as read

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "read": true
  }
}
```

---

## Error Responses

All endpoints follow consistent error format:

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req-uuid"
  }
}
```

## Rate Limiting

All endpoints are rate limited:
- **Global**: 1000 requests/minute
- **Per IP**: 100 requests/minute
- **Per User**: 200 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1681392000
```

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering & Sorting

**Query Parameters:**
- `sort`: Field to sort by (prefix with `-` for descending)
- `filter[field]`: Filter by field value

**Example:**
```
GET /api/v1/orders?sort=-createdAt&filter[status]=delivered&page=1&limit=20
```
