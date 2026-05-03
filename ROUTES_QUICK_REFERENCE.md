# 🗺️ Routes Quick Reference

## 📋 **ALL ROUTES BY ROLE**

| Route | Role | Screen Name | Key Functions |
|-------|------|-------------|---------------|
| `/landing` | Public | Landing Page | Hero, Categories, Features |
| `/login` | Public | Login | Email/Password login |
| `/register` | Public | Register | Create account, Select role |
| `/` | All | Dashboard | Role-based redirect |
| `/profile` | All | Profile | Edit profile, Change password, Logout |

---

## 🛍️ **CUSTOMER ROUTES**

| Route | Screen | Functions |
|-------|--------|-----------|
| `/browse` | Browse Restaurants | View all restaurants, Filter, Search |
| `/set-location` | Set Location | Enter address, Use GPS |
| `/search` | Search Results | Search restaurants/food |
| `/restaurant/:id` | Restaurant Details | View menu, Add to cart |
| `/cart` | Shopping Cart | Review items, Update quantities |
| `/checkout` | Checkout | Payment, Delivery info |
| `/order-confirmation` | Order Success | Order number, Track button |
| `/order-tracking` | Track Order | Live tracking, Driver location |
| `/order-history` | Order History | Past orders, Reorder, Review |

---

## 🍽️ **RESTAURANT ROUTES**

| Route | Screen | Functions |
|-------|--------|-----------|
| `/restaurant/dashboard` | Dashboard | Stats, Pending orders, Quick actions |
| `/restaurant/orders` | Order Management | Accept/reject, Update status |
| `/restaurant/menu` | Menu Management | Add/edit/delete items |
| `/restaurant/profile` | Restaurant Profile | Edit info, Hours, Photos |
| `/restaurant/reviews` | Reviews | View reviews, Respond |

---

## 🚗 **DRIVER ROUTES**

| Route | Screen | Functions |
|-------|--------|-----------|
| `/driver/dashboard` | Dashboard | Stats, Online toggle, Current delivery |
| `/driver/available-orders` | Available Orders | Browse orders, Accept delivery |
| `/driver/active-delivery` | Active Delivery | Navigate, Update status, Contact |
| `/driver/earnings` | Earnings | View earnings, Request payout |
| `/driver/profile` | Profile | Vehicle info, Documents, Schedule |

---

## 👨‍💼 **ADMIN ROUTES**

| Route | Screen | Functions |
|-------|--------|-----------|
| `/admin/dashboard` | Dashboard | Platform stats, Analytics |
| `/admin/users` | User Management | View/suspend/delete users |
| `/admin/restaurants` | Restaurant Onboarding | Approve/reject restaurants |
| `/admin/content` | Content Management | Banners, Coupons, Categories |
| `/admin/support` | Support Tickets | Handle customer support |

---

## 🔐 **ROUTE PROTECTION**

### **Public Routes (No Auth Required)**
- `/landing`
- `/login`
- `/register`

### **Protected Routes (Auth Required)**
- `/` - Redirects to role-based dashboard
- `/profile` - All authenticated users

### **Role-Protected Routes**
- `/restaurant/*` - Only restaurant owners
- `/driver/*` - Only drivers
- `/admin/*` - Only admins

### **Customer Routes (Open to All)**
- `/browse` - Anyone can browse
- `/restaurant/:id` - Anyone can view
- `/cart` - Anyone can add to cart
- `/checkout` - Requires auth to complete

---

## 🎯 **NAVIGATION PATTERNS**

### **Customer Journey**
```
Landing → Register → Browse → Restaurant → Cart → Checkout → Confirmation → Tracking
```

### **Restaurant Journey**
```
Login → Dashboard → Orders → Accept → Preparing → Ready → Completed
```

### **Driver Journey**
```
Login → Dashboard → Available Orders → Accept → Active Delivery → Delivered → Earnings
```

### **Admin Journey**
```
Login → Dashboard → Users/Restaurants/Content/Support → Manage
```

---

## 🧪 **TEST ACCOUNTS**

Create these accounts for testing:

```javascript
// Customer
{
  email: "customer@test.com",
  password: "Test123456!",
  role: "customer"
}

// Restaurant Owner
{
  email: "restaurant@test.com",
  password: "Test123456!",
  role: "restaurant"
}

// Driver
{
  email: "driver@test.com",
  password: "Test123456!",
  role: "driver"
}

// Admin
{
  email: "admin@test.com",
  password: "Test123456!",
  role: "admin"
}
```

---

## 📱 **HEADER NAVIGATION**

### **Logged Out**
- Logo (→ /landing)
- Login (→ /login)
- Register (→ /register)

### **Customer**
- Logo (→ /browse)
- Search bar
- Cart icon (→ /cart)
- Profile dropdown:
  - Profile (→ /profile)
  - Order History (→ /order-history)
  - Logout

### **Restaurant**
- Logo (→ /restaurant/dashboard)
- Navigation:
  - Dashboard
  - Orders
  - Menu
  - Reviews
  - Profile
- Logout

### **Driver**
- Logo (→ /driver/dashboard)
- Online/Offline toggle
- Navigation:
  - Dashboard
  - Available Orders
  - Earnings
  - Profile
- Logout

### **Admin**
- Logo (→ /admin/dashboard)
- Navigation:
  - Dashboard
  - Users
  - Restaurants
  - Content
  - Support
- Logout

---

## 🔄 **REDIRECT LOGIC**

```javascript
// After Login
if (role === 'customer') → /browse
if (role === 'restaurant') → /restaurant/dashboard
if (role === 'driver') → /driver/dashboard
if (role === 'admin') → /admin/dashboard

// After Logout
All roles → /login

// Accessing Protected Route (Not Logged In)
Any protected route → /login

// Accessing Wrong Role Route
Customer accessing /restaurant/* → /browse
Restaurant accessing /driver/* → /restaurant/dashboard
etc.
```

---

## 📊 **ROUTE PARAMETERS**

| Route | Parameter | Example | Description |
|-------|-----------|---------|-------------|
| `/restaurant/:id` | id | `/restaurant/123` | Restaurant ID |
| `/order-tracking` | ?orderId= | `/order-tracking?orderId=456` | Order ID |
| `/search` | ?q= | `/search?q=pizza` | Search query |

---

## 🎨 **PAGE STATES**

### **Loading States**
- Show spinner while fetching data
- Disable buttons during submission
- Show skeleton loaders for lists

### **Empty States**
- No restaurants found
- Cart is empty
- No orders yet
- No reviews

### **Error States**
- Network error
- 404 Not Found
- 500 Server Error
- Validation errors

---

**Use this as your testing checklist!** ✅
