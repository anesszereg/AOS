# 🔌 Backend API Integration & Database Seeding Guide

## ✅ What's Been Done

1. **✅ react-icons installed** - Frontend now has access to all icon libraries
2. **✅ API Service Layer Created** - Complete API client with all endpoints
3. **✅ Database Seed Script Created** - Ready to populate database with real data

---

## 📦 Step 1: Seed the Database

### Run the Seed Script:

```bash
cd backend
npm run seed
```

### What Gets Seeded:

**8 Users**:
- 2 Customers (customer1@example.com, customer2@example.com)
- 3 Restaurant Owners (restaurant1@example.com, restaurant2@example.com, restaurant3@example.com)
- 2 Drivers (driver1@example.com, driver2@example.com)
- 1 Admin (admin@example.com)

**3 Restaurants**:
- Luigi's Pizzeria (Italian)
- Sushi Palace (Japanese)
- Burger House (American)

**16 Menu Items**:
- 6 items for Luigi's Pizzeria
- 5 items for Sushi Palace
- 5 items for Burger House

### Test Credentials:
```
Customer: customer1@example.com / password123
Restaurant: restaurant1@example.com / password123
Driver: driver1@example.com / password123
Admin: admin@example.com / admin123
```

---

## 🔌 Step 2: API Endpoints Available

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout

### Restaurants
- `GET /api/v1/restaurants` - Get all restaurants (with filters)
- `GET /api/v1/restaurants/:id` - Get restaurant by ID
- `POST /api/v1/restaurants` - Create restaurant
- `PUT /api/v1/restaurants/:id` - Update restaurant
- `DELETE /api/v1/restaurants/:id` - Delete restaurant

### Menu Items
- `GET /api/v1/restaurants/:id/menu` - Get restaurant menu
- `POST /api/v1/restaurants/:id/menu` - Add menu item
- `PUT /api/v1/restaurants/:id/menu/:itemId` - Update menu item
- `DELETE /api/v1/restaurants/:id/menu/:itemId` - Delete menu item

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/orders/my-orders` - Get user's orders
- `PATCH /api/v1/orders/:id/status` - Update order status
- `GET /api/v1/orders/restaurant/:id` - Get restaurant orders
- `GET /api/v1/orders/driver` - Get driver orders
- `PATCH /api/v1/orders/:id/accept` - Accept order (driver)
- `PATCH /api/v1/orders/:id/complete` - Complete order

### Reviews
- `POST /api/v1/reviews` - Create review
- `GET /api/v1/reviews/restaurant/:id` - Get restaurant reviews
- `PATCH /api/v1/reviews/:id/respond` - Respond to review

### Driver
- `PATCH /api/v1/drivers/status` - Update online/offline status
- `GET /api/v1/drivers/earnings` - Get earnings
- `GET /api/v1/drivers/available-orders` - Get available orders
- `PATCH /api/v1/drivers/location` - Update location

### Admin
- `GET /api/v1/admin/users` - Get all users
- `PATCH /api/v1/admin/users/:id/status` - Update user status
- `GET /api/v1/admin/restaurants/pending` - Get pending restaurants
- `PATCH /api/v1/admin/restaurants/:id/approve` - Approve restaurant
- `PATCH /api/v1/admin/restaurants/:id/reject` - Reject restaurant
- `POST /api/v1/admin/coupons` - Create coupon
- `GET /api/v1/admin/support-tickets` - Get support tickets
- `PATCH /api/v1/admin/support-tickets/:id` - Update ticket

---

## 🎨 Step 3: React Icons Usage

### Available Icon Libraries:
- **Fa** - Font Awesome
- **Md** - Material Design
- **Io** - Ionicons
- **Bi** - Bootstrap Icons
- **Ai** - Ant Design Icons
- **Fi** - Feather Icons
- **Hi** - Heroicons

### Example Usage:
```tsx
import { FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { MdRestaurant, MdDeliveryDining } from 'react-icons/md';
import { IoLocationSharp } from 'react-icons/io5';

<FaShoppingCart size={24} color="#FF6B35" />
<MdRestaurant className="icon" />
```

---

## 🔄 Step 4: Update Screens to Use Real APIs

### Example: Browse Restaurants

**Before (Mock Data)**:
```tsx
const restaurants = [
  { id: 1, name: "Luigi's", ... }
];
```

**After (Real API)**:
```tsx
import { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';

const [restaurants, setRestaurants] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchRestaurants();
}, []);
```

---

## 📋 Screens to Update

### Customer Screens:
- [ ] **NewCustomerHome** - Fetch restaurants from API
- [ ] **SearchResults** - Search restaurants/menu items
- [ ] **RestaurantDetails** - Fetch restaurant & menu from API
- [ ] **Cart** - Store cart in state/localStorage
- [ ] **Checkout** - Create order via API
- [ ] **OrderTracking** - Fetch order status from API
- [ ] **OrderHistory** - Fetch user orders from API

### Restaurant Screens:
- [ ] **Dashboard** - Fetch stats from API
- [ ] **OrderManagement** - Fetch & update orders
- [ ] **MenuManagement** - CRUD menu items
- [ ] **RestaurantProfile** - Update restaurant info
- [ ] **Reviews** - Fetch & respond to reviews

### Driver Screens:
- [ ] **Dashboard** - Update status, fetch stats
- [ ] **AvailableOrders** - Fetch available orders
- [ ] **ActiveDelivery** - Update delivery status
- [ ] **Earnings** - Fetch earnings data
- [ ] **Profile** - Update driver info

### Admin Screens:
- [ ] **Dashboard** - Fetch platform stats
- [ ] **UserManagement** - Fetch & manage users
- [ ] **RestaurantOnboarding** - Approve/reject restaurants
- [ ] **ContentManagement** - Manage coupons/banners
- [ ] **SupportTickets** - Fetch & update tickets

---

## 🚀 Quick Start

### 1. Start Backend:
```bash
cd backend
npm run dev
```

### 2. Seed Database:
```bash
cd backend
npm run seed
```

### 3. Start Frontend:
```bash
cd frontend/food-delivery-app
npm run dev
```

### 4. Test Login:
- Visit `http://localhost:3001/login`
- Use: `customer1@example.com` / `password123`
- Browse real restaurants from database!

---

## 📝 Next Implementation Steps

1. **Update NewCustomerHome.tsx** - Replace mock restaurants with API call
2. **Update RestaurantDetails.tsx** - Fetch menu from API
3. **Update Cart.tsx** - Implement cart state management
4. **Update Checkout.tsx** - Create order via API
5. **Update OrderHistory.tsx** - Fetch orders from API
6. **Replace all emojis with react-icons** across all screens

---

## 🎯 Icon Replacement Guide

### Common Icons to Use:

**Navigation**:
- `FaHome` - Home
- `FaUser` - Profile
- `FaShoppingCart` - Cart
- `FaSearch` - Search
- `FaBars` - Menu

**Food & Restaurant**:
- `MdRestaurant` - Restaurant
- `MdFastfood` - Food
- `MdDeliveryDining` - Delivery
- `FaUtensils` - Dining

**Actions**:
- `FaPlus` - Add
- `FaMinus` - Remove
- `FaEdit` - Edit
- `FaTrash` - Delete
- `FaCheck` - Confirm

**Status**:
- `FaClock` - Time
- `FaStar` - Rating
- `FaHeart` - Favorite
- `FaMapMarkerAlt` - Location

---

**Status**: Ready for implementation
**Database**: Ready to seed
**APIs**: Fully documented
**Icons**: Library installed
