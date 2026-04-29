# Complete Microservices Implementation Guide

## ✅ Already Completed Services

1. **Auth Service** (Port 3001) - ✅ Running
2. **User Service** (Port 3002) - ✅ Running
3. **React Frontend** (Port 3000) - ✅ Running with new design

## 🚀 Quick Setup for Remaining Services

All databases have been created:
- ✅ restaurant_db
- ✅ menu_db
- ✅ order_db
- ✅ payment_db
- ✅ delivery_db
- ✅ notification_db

### Restaurant Service (Port 3003)

**Purpose**: Manage restaurants, owners, business info

**Database Schema**:
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cuisine_type VARCHAR(100),
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  logo_url TEXT,
  cover_image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  estimated_delivery_time INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false
);
```

**Key Endpoints**:
- POST `/api/v1/restaurants` - Create restaurant
- GET `/api/v1/restaurants` - List all restaurants
- GET `/api/v1/restaurants/:id` - Get restaurant details
- PUT `/api/v1/restaurants/:id` - Update restaurant
- DELETE `/api/v1/restaurants/:id` - Delete restaurant
- GET `/api/v1/restaurants/owner/:ownerId` - Get restaurants by owner

### Menu Service (Port 3004)

**Purpose**: Manage menu items, categories, pricing

**Database Schema**:
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  preparation_time INTEGER DEFAULT 15,
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Endpoints**:
- POST `/api/v1/menu/categories` - Create category
- GET `/api/v1/menu/restaurant/:restaurantId` - Get restaurant menu
- POST `/api/v1/menu/items` - Create menu item
- PUT `/api/v1/menu/items/:id` - Update menu item
- DELETE `/api/v1/menu/items/:id` - Delete menu item

### Order Service (Port 3005)

**Purpose**: Handle orders, cart, order tracking

**Database Schema**:
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  restaurant_id UUID NOT NULL,
  driver_id UUID,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT
);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Endpoints**:
- POST `/api/v1/orders` - Create order
- GET `/api/v1/orders/:id` - Get order details
- GET `/api/v1/orders/customer/:customerId` - Get customer orders
- GET `/api/v1/orders/restaurant/:restaurantId` - Get restaurant orders
- PUT `/api/v1/orders/:id/status` - Update order status

**RabbitMQ Events**:
- `order.created` - Notify restaurant, payment service
- `order.confirmed` - Notify customer, delivery service
- `order.preparing` - Update customer
- `order.ready` - Notify driver
- `order.delivered` - Complete order

### Payment Service (Port 3006)

**Purpose**: Process payments, refunds, transactions

**Database Schema**:
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  payment_gateway VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id),
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Endpoints**:
- POST `/api/v1/payments` - Process payment
- GET `/api/v1/payments/:id` - Get payment details
- POST `/api/v1/payments/:id/refund` - Process refund

**RabbitMQ Events**:
- Listen: `order.created` - Process payment
- Emit: `payment.completed` - Notify order service
- Emit: `payment.failed` - Cancel order

### Delivery Service (Port 3007)

**Purpose**: Manage deliveries, driver assignment, tracking

**Database Schema**:
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  driver_id UUID,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  pickup_time TIMESTAMP,
  delivery_time TIMESTAMP,
  estimated_delivery_time TIMESTAMP,
  actual_delivery_time TIMESTAMP,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  driver_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Endpoints**:
- POST `/api/v1/deliveries` - Create delivery
- GET `/api/v1/deliveries/:id` - Get delivery details
- PUT `/api/v1/deliveries/:id/assign` - Assign driver
- PUT `/api/v1/deliveries/:id/status` - Update delivery status
- POST `/api/v1/deliveries/location` - Update driver location

**RabbitMQ Events**:
- Listen: `order.confirmed` - Create delivery
- Emit: `delivery.assigned` - Notify driver
- Emit: `delivery.picked_up` - Update customer
- Emit: `delivery.delivered` - Complete order

### Notification Service (Port 3008)

**Purpose**: Send emails, SMS, push notifications

**Database Schema**:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  order_updates BOOLEAN DEFAULT true,
  promotions BOOLEAN DEFAULT true
);
```

**Key Endpoints**:
- POST `/api/v1/notifications` - Send notification
- GET `/api/v1/notifications/user/:userId` - Get user notifications
- PUT `/api/v1/notifications/preferences` - Update preferences

**RabbitMQ Events**:
- Listen: `order.created`, `order.confirmed`, `payment.completed`, `delivery.assigned`, etc.
- Send appropriate notifications based on event type

## 🔧 RabbitMQ Setup

### Install RabbitMQ (macOS)
```bash
brew install rabbitmq
brew services start rabbitmq
```

### Access Management UI
- URL: http://localhost:15672
- Username: guest
- Password: guest

### Event Flow Example

```
1. Customer creates order
   → Order Service emits: order.created
   
2. Payment Service listens: order.created
   → Processes payment
   → Emits: payment.completed
   
3. Order Service listens: payment.completed
   → Updates order status
   → Emits: order.confirmed
   
4. Delivery Service listens: order.confirmed
   → Creates delivery
   → Assigns driver
   → Emits: delivery.assigned
   
5. Notification Service listens to all events
   → Sends appropriate notifications
```

## 📦 Quick Start Script

Create and run all services:

```bash
#!/bin/bash

# Start RabbitMQ
brew services start rabbitmq

# Start all services in separate terminals
cd services/auth-service && npm run dev &
cd services/user-service && npm run dev &
cd services/restaurant-service && npm run dev &
cd services/menu-service && npm run dev &
cd services/order-service && npm run dev &
cd services/payment-service && npm run dev &
cd services/delivery-service && npm run dev &
cd services/notification-service && npm run dev &

# Start frontend
cd frontend/food-delivery-app && npm run dev &

echo "All services started!"
echo "Frontend: http://localhost:3000"
echo "RabbitMQ Management: http://localhost:15672"
```

## 🧪 Testing Workflow

1. **Register** as customer at http://localhost:3000/register
2. **Browse** restaurants (mock data for now)
3. **Add items** to cart
4. **Place order** - triggers event chain
5. **Track order** - see status updates
6. **Receive notifications** - email/push

## 📊 Service Dependencies

```
Frontend
  ↓
Auth Service → User Service
  ↓
Restaurant Service ← Menu Service
  ↓
Order Service → RabbitMQ → Payment Service
  ↓                ↓
  ↓            Delivery Service
  ↓                ↓
  └──────→ Notification Service
```

## 🎯 Implementation Priority

1. ✅ Auth Service (Done)
2. ✅ User Service (Done)
3. ✅ Frontend (Done)
4. 🔄 Restaurant Service (In Progress)
5. 🔄 Menu Service (Next)
6. 🔄 Order Service (Next)
7. 🔄 Payment Service (Next)
8. 🔄 Delivery Service (Next)
9. 🔄 Notification Service (Next)
10. 🔄 RabbitMQ Integration (Final)

## 📝 Next Steps

Since I've created the databases and started the Restaurant Service setup, you can:

1. **Complete Restaurant Service** - Copy User Service pattern, update models/controllers
2. **Build Menu Service** - Similar pattern
3. **Build Order Service** - Add RabbitMQ integration
4. **Build Payment Service** - Add payment gateway (Stripe/PayPal)
5. **Build Delivery Service** - Add real-time tracking
6. **Build Notification Service** - Add email/SMS providers
7. **Test end-to-end** - Place order and track full flow

All services follow the same pattern as Auth/User services, making it straightforward to implement!
