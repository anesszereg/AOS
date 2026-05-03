# 🎯 Complete UI Workflow & Testing Guide

## 📱 **NAVIGATION FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────────┐
│                     LANDING PAGE (/)                         │
│  - Hero section with search                                  │
│  - Popular categories                                        │
│  - Featured restaurants                                      │
│  - How it works                                             │
│  Actions: Login | Register | Browse                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ├─────────────────┬─────────────────┐
                           ▼                 ▼                 ▼
                      ┌─────────┐      ┌──────────┐     ┌──────────┐
                      │  LOGIN  │      │ REGISTER │     │  BROWSE  │
                      └─────────┘      └──────────┘     └──────────┘
                           │                 │                 │
                           └────────┬────────┘                 │
                                    ▼                          │
                          ┌──────────────────┐                 │
                          │   DASHBOARD      │◄────────────────┘
                          │  (Role-based)    │
                          └──────────────────┘
                                    │
         ┌──────────────┬───────────┼───────────┬──────────────┐
         ▼              ▼           ▼           ▼              ▼
    CUSTOMER       RESTAURANT    DRIVER      ADMIN       SHARED
    Dashboard      Dashboard    Dashboard   Dashboard    Routes
```

---

## 👥 **ROLE-BASED SCREENS & FUNCTIONS**

### 🔓 **PUBLIC ROUTES (No Login Required)**

#### **1. Landing Page** - `/landing`
**Purpose:** Marketing page, first impression  
**Functions:**
- ✅ View hero section
- ✅ Search for food/restaurants
- ✅ Browse categories (Italian, Chinese, etc.)
- ✅ See how it works
- ✅ Navigate to Login/Register

**Test Steps:**
```
1. Go to /landing
2. Check hero image loads
3. Click "Search" button → should go to /browse
4. Click category card → should go to /browse
5. Click "Login" → should go to /login
6. Click "Register" → should go to /register
```

---

#### **2. Login Page** - `/login`
**Purpose:** User authentication  
**Functions:**
- ✅ Email/password login
- ✅ Show/hide password
- ✅ Remember me (optional)
- ✅ Error handling
- ✅ Success toast notification
- ✅ Redirect to role-based dashboard

**Test Steps:**
```
1. Go to /login
2. Enter invalid email → should show validation error
3. Enter valid email + wrong password → should show "Invalid credentials"
4. Enter valid credentials:
   - Customer: test@customer.com / Test123456!
   - Restaurant: owner@restaurant.com / SecurePass123!
   - Driver: driver@test.com / Test123456!
   - Admin: admin@test.com / Test123456!
5. Click "Login" → should show success toast
6. Should redirect to dashboard based on role
7. Check localStorage has: user, accessToken, refreshToken
```

---

#### **3. Register Page** - `/register`
**Purpose:** New user registration  
**Functions:**
- ✅ Email/password registration
- ✅ Role selection (customer/restaurant/driver)
- ✅ Password strength validation
- ✅ Auto-login after registration
- ✅ Redirect to dashboard

**Test Steps:**
```
1. Go to /register
2. Enter email (must be unique)
3. Enter password < 8 chars → should show error
4. Enter password ≥ 8 chars → should pass
5. Select role: Customer/Restaurant/Driver
6. Click "Register" → should create account
7. Should auto-login and redirect to dashboard
8. Check localStorage has user data
```

---

### 🛍️ **CUSTOMER ROLE** (role: 'customer')

#### **Dashboard** - `/` or `/browse`
**Purpose:** Browse and order food  
**Functions:**
- ✅ View all restaurants
- ✅ Filter by category (All, Italian, Chinese, etc.)
- ✅ Search restaurants
- ✅ See restaurant ratings
- ✅ See delivery time & fee
- ✅ Click restaurant → go to details

**Test Steps:**
```
1. Login as customer
2. Should see /browse page
3. Check restaurants load (3 restaurants)
4. Click category filter → should filter list
5. Click restaurant card → should go to /restaurant/:id
6. Check header shows user email
7. Check cart icon in header
```

---

#### **Set Location** - `/set-location`
**Purpose:** Set delivery address  
**Functions:**
- ✅ Enter address manually
- ✅ Use current location (GPS)
- ✅ Save address
- ✅ Continue to browse

**Test Steps:**
```
1. Go to /set-location
2. Enter address: "123 Main St, City, State"
3. Click "Use Current Location" → should request GPS
4. Click "Continue" → should save and go to /browse
```

---

#### **Restaurant Details** - `/restaurant/:id`
**Purpose:** View menu and add items to cart  
**Functions:**
- ✅ View restaurant info (name, rating, hours)
- ✅ View menu items with prices
- ✅ Add items to cart
- ✅ Customize items (size, toppings)
- ✅ View cart summary
- ✅ Proceed to checkout

**Test Steps:**
```
1. From /browse, click a restaurant
2. Should see restaurant details
3. Should see menu items
4. Click "Add to Cart" on item → should add to cart
5. Click cart icon → should show cart items
6. Click "Checkout" → should go to /checkout
```

---

#### **Cart** - `/cart`
**Purpose:** Review order before checkout  
**Functions:**
- ✅ View cart items
- ✅ Update quantities
- ✅ Remove items
- ✅ See subtotal, delivery fee, tax
- ✅ Apply promo code
- ✅ Proceed to checkout

**Test Steps:**
```
1. Add items to cart from restaurant page
2. Go to /cart
3. Should see all cart items
4. Click "+" to increase quantity
5. Click "-" to decrease quantity
6. Click "Remove" to delete item
7. Enter promo code → should apply discount
8. Click "Proceed to Checkout" → go to /checkout
```

---

#### **Checkout** - `/checkout`
**Purpose:** Complete order and payment  
**Functions:**
- ✅ Confirm delivery address
- ✅ Select payment method
- ✅ Enter payment details
- ✅ Add delivery instructions
- ✅ Review order summary
- ✅ Place order

**Test Steps:**
```
1. Go to /checkout (with items in cart)
2. Verify delivery address
3. Select payment: Credit Card / PayPal / Cash
4. Enter card details (if credit card)
5. Add delivery instructions (optional)
6. Review order total
7. Click "Place Order" → should process payment
8. Should go to /order-confirmation
```

---

#### **Order Confirmation** - `/order-confirmation`
**Purpose:** Show order success  
**Functions:**
- ✅ Display order number
- ✅ Show estimated delivery time
- ✅ Show order summary
- ✅ Track order button
- ✅ Continue shopping button

**Test Steps:**
```
1. After placing order, should redirect here
2. Should see order number
3. Should see "Estimated delivery: 30-45 min"
4. Click "Track Order" → go to /order-tracking
5. Click "Continue Shopping" → go to /browse
```

---

#### **Order Tracking** - `/order-tracking`
**Purpose:** Real-time order status  
**Functions:**
- ✅ View order status (Preparing, On the way, Delivered)
- ✅ See driver location on map
- ✅ See estimated arrival time
- ✅ Contact driver
- ✅ Contact restaurant

**Test Steps:**
```
1. Go to /order-tracking
2. Should see order status steps
3. Should see map with driver location (if assigned)
4. Should see driver info (name, photo, rating)
5. Click "Call Driver" → should initiate call
6. Click "Message Driver" → should open chat
```

---

#### **Order History** - `/order-history`
**Purpose:** View past orders  
**Functions:**
- ✅ View all past orders
- ✅ Filter by status (All, Delivered, Cancelled)
- ✅ Search orders
- ✅ View order details
- ✅ Reorder
- ✅ Leave review

**Test Steps:**
```
1. Go to /order-history
2. Should see list of past orders
3. Click filter dropdown → select "Delivered"
4. Click order card → should expand details
5. Click "Reorder" → should add items to cart
6. Click "Leave Review" → should open review modal
7. Submit review with rating and comment
```

---

#### **Search Results** - `/search`
**Purpose:** Search for restaurants/food  
**Functions:**
- ✅ Search by restaurant name
- ✅ Search by cuisine type
- ✅ Search by dish name
- ✅ Filter results
- ✅ Sort results (rating, delivery time, price)

**Test Steps:**
```
1. From header, enter search query "pizza"
2. Should go to /search?q=pizza
3. Should see matching restaurants
4. Click filter icon → should show filters
5. Select "Italian" cuisine → should filter
6. Sort by "Rating" → should reorder results
7. Click restaurant → go to details
```

---

### 🍽️ **RESTAURANT ROLE** (role: 'restaurant')

#### **Restaurant Dashboard** - `/restaurant/dashboard`
**Purpose:** Overview of restaurant operations  
**Functions:**
- ✅ View today's stats (orders, revenue)
- ✅ View pending orders
- ✅ View active orders
- ✅ Quick actions (accept/reject orders)
- ✅ View recent reviews
- ✅ Navigate to other sections

**Test Steps:**
```
1. Login as restaurant owner
2. Should redirect to /restaurant/dashboard
3. Should see stats cards:
   - Total Orders Today
   - Revenue Today
   - Pending Orders
   - Average Rating
4. Should see pending orders list
5. Click "Accept" on order → should update status
6. Click "Reject" on order → should show reason modal
7. Click "View All Orders" → go to /restaurant/orders
```

---

#### **Order Management** - `/restaurant/orders`
**Purpose:** Manage incoming orders  
**Functions:**
- ✅ View all orders (Pending, Preparing, Ready, Completed)
- ✅ Filter by status
- ✅ Accept/reject orders
- ✅ Update order status
- ✅ View order details
- ✅ Print order receipt
- ✅ Contact customer

**Test Steps:**
```
1. Go to /restaurant/orders
2. Should see tabs: All | Pending | Preparing | Ready | Completed
3. Click "Pending" tab → should show pending orders
4. Click order card → should expand details
5. Click "Accept Order" → should move to "Preparing"
6. Click "Mark as Ready" → should notify driver
7. Click "Print Receipt" → should open print dialog
8. Click "Contact Customer" → should show phone/message
```

---

#### **Menu Management** - `/restaurant/menu`
**Purpose:** Manage restaurant menu  
**Functions:**
- ✅ View all menu items
- ✅ Add new item
- ✅ Edit item (name, price, description, image)
- ✅ Delete item
- ✅ Toggle item availability
- ✅ Organize by categories
- ✅ Set item as featured

**Test Steps:**
```
1. Go to /restaurant/menu
2. Should see all menu items
3. Click "Add New Item" → should open form
4. Fill in:
   - Name: "Margherita Pizza"
   - Description: "Classic pizza with tomato and mozzarella"
   - Price: $12.99
   - Category: "Pizza"
   - Upload image
5. Click "Save" → should add to menu
6. Click "Edit" on existing item → should open edit form
7. Toggle "Available" switch → should update availability
8. Click "Delete" → should show confirmation
9. Confirm delete → should remove item
```

---

#### **Restaurant Profile** - `/restaurant/profile`
**Purpose:** Manage restaurant information  
**Functions:**
- ✅ Edit restaurant name
- ✅ Edit description
- ✅ Update address
- ✅ Update phone/email
- ✅ Set opening hours
- ✅ Upload restaurant photos
- ✅ Set delivery fee
- ✅ Set minimum order amount

**Test Steps:**
```
1. Go to /restaurant/profile
2. Should see profile form
3. Edit restaurant name
4. Update description
5. Change opening hours
6. Upload new restaurant photo
7. Update delivery fee: $3.99
8. Set minimum order: $15.00
9. Click "Save Changes" → should update profile
10. Should show success toast
```

---

#### **Reviews** - `/restaurant/reviews`
**Purpose:** Manage customer reviews  
**Functions:**
- ✅ View all reviews
- ✅ Filter by rating (1-5 stars)
- ✅ Respond to reviews
- ✅ Report inappropriate reviews
- ✅ View review analytics

**Test Steps:**
```
1. Go to /restaurant/reviews
2. Should see all customer reviews
3. Should see average rating
4. Click filter "5 stars" → should show only 5-star reviews
5. Click "Respond" on review → should open text box
6. Type response and click "Submit"
7. Should see response appear under review
8. Click "Report" on inappropriate review
9. Should see analytics: rating distribution chart
```

---

### 🚗 **DRIVER ROLE** (role: 'driver')

#### **Driver Dashboard** - `/driver/dashboard`
**Purpose:** Overview of delivery operations  
**Functions:**
- ✅ View today's stats (deliveries, earnings)
- ✅ Toggle online/offline status
- ✅ View current delivery
- ✅ View available orders
- ✅ Quick navigation

**Test Steps:**
```
1. Login as driver
2. Should redirect to /driver/dashboard
3. Should see stats:
   - Deliveries Today
   - Earnings Today
   - Average Rating
   - Online Time
4. Toggle "Online" switch → should change status
5. Should see current delivery (if any)
6. Click "View Available Orders" → go to /driver/available-orders
7. Click "View Earnings" → go to /driver/earnings
```

---

#### **Available Orders** - `/driver/available-orders`
**Purpose:** Browse and accept delivery orders  
**Functions:**
- ✅ View available deliveries
- ✅ See pickup location
- ✅ See delivery location
- ✅ See estimated distance
- ✅ See delivery fee
- ✅ Accept order
- ✅ Decline order

**Test Steps:**
```
1. Go to /driver/available-orders
2. Should see list of available orders
3. Each order should show:
   - Restaurant name & address
   - Customer address
   - Distance (e.g., "2.5 miles")
   - Delivery fee (e.g., "$5.00")
4. Click "View Details" → should expand order
5. Click "Accept" → should assign order to driver
6. Should go to /driver/active-delivery
```

---

#### **Active Delivery** - `/driver/active-delivery`
**Purpose:** Manage current delivery  
**Functions:**
- ✅ View order details
- ✅ See pickup location on map
- ✅ See delivery location on map
- ✅ Get directions
- ✅ Update delivery status
- ✅ Contact customer
- ✅ Contact restaurant
- ✅ Mark as delivered

**Test Steps:**
```
1. Accept an order from available orders
2. Should redirect to /driver/active-delivery
3. Should see map with:
   - Restaurant location (pickup)
   - Customer location (delivery)
   - Current driver location
4. Click "Get Directions" → should open maps app
5. Click "Picked Up" → should update status
6. Click "Contact Customer" → should show phone
7. Click "Arrived" → should notify customer
8. Click "Mark as Delivered" → should complete delivery
9. Should prompt for delivery photo
10. Should go back to dashboard
```

---

#### **Earnings** - `/driver/earnings`
**Purpose:** View earnings and payouts  
**Functions:**
- ✅ View total earnings
- ✅ View earnings by period (Today, Week, Month)
- ✅ See earnings breakdown
- ✅ View payout history
- ✅ Request payout
- ✅ Download earnings report

**Test Steps:**
```
1. Go to /driver/earnings
2. Should see total earnings
3. Click "Today" tab → should show today's earnings
4. Click "This Week" → should show weekly earnings
5. Should see earnings breakdown:
   - Delivery fees
   - Tips
   - Bonuses
6. Should see payout history table
7. Click "Request Payout" → should open payout form
8. Click "Download Report" → should download PDF
```

---

#### **Driver Profile** - `/driver/profile`
**Purpose:** Manage driver information  
**Functions:**
- ✅ Edit personal info
- ✅ Update vehicle info
- ✅ Upload documents (license, insurance)
- ✅ Set availability schedule
- ✅ Update bank details
- ✅ View rating & reviews

**Test Steps:**
```
1. Go to /driver/profile
2. Should see profile form
3. Edit name, phone
4. Update vehicle info:
   - Type: Car/Bike/Scooter
   - Make/Model
   - License plate
5. Upload driver's license photo
6. Upload insurance document
7. Set availability schedule
8. Update bank account for payouts
9. Click "Save" → should update profile
10. Should see driver rating and reviews
```

---

### 👨‍💼 **ADMIN ROLE** (role: 'admin')

#### **Admin Dashboard** - `/admin/dashboard`
**Purpose:** Platform overview and analytics  
**Functions:**
- ✅ View platform statistics
- ✅ See total users, restaurants, orders
- ✅ View revenue analytics
- ✅ See recent activity
- ✅ View pending approvals
- ✅ Quick actions

**Test Steps:**
```
1. Login as admin
2. Should redirect to /admin/dashboard
3. Should see stats cards:
   - Total Users
   - Total Restaurants
   - Total Orders
   - Platform Revenue
4. Should see charts:
   - Orders over time
   - Revenue over time
   - User growth
5. Should see recent activity feed
6. Should see pending restaurant approvals
7. Click "View All Users" → go to /admin/users
```

---

#### **User Management** - `/admin/users`
**Purpose:** Manage all platform users  
**Functions:**
- ✅ View all users
- ✅ Filter by role (Customer, Restaurant, Driver)
- ✅ Search users
- ✅ View user details
- ✅ Suspend/activate users
- ✅ Delete users
- ✅ Send notifications

**Test Steps:**
```
1. Go to /admin/users
2. Should see all users table
3. Click "Filter by Role" → select "Customer"
4. Search for user by email
5. Click user row → should expand details
6. Click "Suspend" → should deactivate account
7. Click "Activate" → should reactivate
8. Click "Delete" → should show confirmation
9. Click "Send Notification" → should open message form
10. Send notification → should deliver to user
```

---

#### **Restaurant Onboarding** - `/admin/restaurants`
**Purpose:** Approve/manage restaurants  
**Functions:**
- ✅ View pending restaurant applications
- ✅ Review restaurant details
- ✅ Approve restaurants
- ✅ Reject restaurants (with reason)
- ✅ View active restaurants
- ✅ Suspend restaurants
- ✅ Edit restaurant info

**Test Steps:**
```
1. Go to /admin/restaurants
2. Should see tabs: Pending | Active | Suspended
3. Click "Pending" → should show applications
4. Click application → should show details:
   - Restaurant name
   - Owner info
   - Documents
   - Business license
5. Click "Approve" → should activate restaurant
6. Click "Reject" → should open reason form
7. Enter rejection reason → should notify owner
8. Click "Active" tab → should show active restaurants
9. Click "Suspend" on restaurant → should deactivate
```

---

#### **Content Management** - `/admin/content`
**Purpose:** Manage platform content  
**Functions:**
- ✅ Manage promo banners
- ✅ Create/edit coupons
- ✅ Manage categories
- ✅ Edit static pages
- ✅ Manage email templates
- ✅ Upload media

**Test Steps:**
```
1. Go to /admin/content
2. Click "Banners" tab
3. Click "Add Banner" → upload image, set link
4. Click "Coupons" tab
5. Click "Create Coupon":
   - Code: SAVE20
   - Discount: 20%
   - Expiry: 30 days
6. Click "Save" → should create coupon
7. Click "Categories" tab
8. Add new category: "Desserts"
9. Click "Email Templates" tab
10. Edit "Order Confirmation" template
```

---

#### **Support Tickets** - `/admin/support`
**Purpose:** Handle customer support  
**Functions:**
- ✅ View all support tickets
- ✅ Filter by status (Open, In Progress, Resolved)
- ✅ Filter by priority
- ✅ Assign tickets to agents
- ✅ Respond to tickets
- ✅ Close tickets
- ✅ View ticket history

**Test Steps:**
```
1. Go to /admin/support
2. Should see all tickets
3. Click filter "Open" → should show open tickets
4. Click ticket → should open details
5. Should see conversation history
6. Type response in text box
7. Click "Send" → should add to conversation
8. Click "Assign to" → select agent
9. Click "Mark as Resolved" → should close ticket
10. Should see ticket in "Resolved" tab
```

---

### 🔄 **SHARED ROUTES (All Roles)**

#### **Profile** - `/profile`
**Purpose:** User profile management  
**Functions:**
- ✅ View profile info
- ✅ Edit name, email, phone
- ✅ Change password
- ✅ Upload profile photo
- ✅ Manage notifications
- ✅ Logout

**Test Steps:**
```
1. Go to /profile (any role)
2. Should see user info
3. Click "Edit Profile"
4. Update name, phone
5. Click "Change Password"
6. Enter old password, new password
7. Click "Save" → should update password
8. Upload profile photo
9. Toggle notification preferences
10. Click "Logout" → should clear session and go to /login
```

---

## 🧪 **COMPLETE TESTING WORKFLOW**

### **Test Scenario 1: Customer Order Flow**
```
1. Register as customer → /register
2. Login → /login
3. Browse restaurants → /browse
4. Click restaurant → /restaurant/:id
5. Add items to cart
6. View cart → /cart
7. Proceed to checkout → /checkout
8. Place order → /order-confirmation
9. Track order → /order-tracking
10. View order history → /order-history
11. Leave review
```

### **Test Scenario 2: Restaurant Order Fulfillment**
```
1. Login as restaurant → /restaurant/dashboard
2. See new order notification
3. Go to orders → /restaurant/orders
4. Accept order
5. Mark as preparing
6. Mark as ready
7. Wait for driver pickup
8. Mark as completed
9. View review from customer → /restaurant/reviews
10. Respond to review
```

### **Test Scenario 3: Driver Delivery Flow**
```
1. Login as driver → /driver/dashboard
2. Toggle online
3. View available orders → /driver/available-orders
4. Accept order
5. Go to active delivery → /driver/active-delivery
6. Navigate to restaurant
7. Mark as "Picked Up"
8. Navigate to customer
9. Mark as "Delivered"
10. Upload delivery photo
11. View earnings → /driver/earnings
```

### **Test Scenario 4: Admin Platform Management**
```
1. Login as admin → /admin/dashboard
2. Review pending restaurant → /admin/restaurants
3. Approve restaurant
4. Create promo coupon → /admin/content
5. Handle support ticket → /admin/support
6. Suspend problematic user → /admin/users
7. View platform analytics → /admin/dashboard
```

---

## 📊 **TESTING CHECKLIST**

### **Authentication**
- [ ] Register new user (all roles)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Logout
- [ ] Session persists after page reload
- [ ] Protected routes redirect to login

### **Customer Features**
- [ ] Browse restaurants
- [ ] Filter by category
- [ ] Search restaurants
- [ ] View restaurant details
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove from cart
- [ ] Apply promo code
- [ ] Checkout and pay
- [ ] Track order
- [ ] View order history
- [ ] Leave review

### **Restaurant Features**
- [ ] View dashboard stats
- [ ] Accept/reject orders
- [ ] Update order status
- [ ] Add menu item
- [ ] Edit menu item
- [ ] Delete menu item
- [ ] Update restaurant profile
- [ ] Respond to reviews

### **Driver Features**
- [ ] Toggle online/offline
- [ ] View available orders
- [ ] Accept delivery
- [ ] Update delivery status
- [ ] Mark as delivered
- [ ] View earnings
- [ ] Update profile

### **Admin Features**
- [ ] View platform stats
- [ ] Manage users
- [ ] Approve restaurants
- [ ] Create coupons
- [ ] Handle support tickets
- [ ] Suspend accounts

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue: "Route not found" error**
**Fix:** Make sure backend service is running and routes are mounted correctly

### **Issue: "map is not a function" error**
**Fix:** Already fixed - API response handling updated

### **Issue: User not staying logged in**
**Fix:** Already working - localStorage persists user data

### **Issue: CORS error**
**Fix:** Update CORS_ORIGIN in Render (remove trailing slash)

---

## 📝 **TESTING NOTES**

- Use different browsers to test
- Test on mobile devices
- Test with slow network (throttle in DevTools)
- Test with different screen sizes
- Check console for errors
- Verify localStorage data
- Test all toast notifications
- Verify all API calls in Network tab

---

**Happy Testing!** 🎉
