# 🧪 Complete Application Testing Checklist

## Step 1: Backend Services Health Check

### Check All Services Are Running

Open these URLs in your browser (replace with your actual Render URLs):

1. **API Gateway**: https://food-delevery-app-g73l.onrender.com/health
   - [ ] Should return: `{"status": "healthy", "service": "api-gateway"}`

2. **Auth Service**: https://food-delevery-app-g73l.onrender.com/api/auth/health
   - [ ] Should return: `{"status": "healthy", "service": "auth-service"}`

3. **User Service**: https://food-delevery-app-g73l.onrender.com/api/users/health
   - [ ] Should return: `{"status": "healthy", "service": "user-service"}`

4. **Restaurant Service**: https://food-delevery-app-g73l.onrender.com/api/restaurants/health
   - [ ] Should return: `{"status": "healthy", "service": "restaurant-service"}`

5. **Menu Service**: https://food-delevery-app-g73l.onrender.com/api/menu/health
   - [ ] Should return: `{"status": "healthy", "service": "menu-service"}`

6. **Order Service**: https://food-delevery-app-g73l.onrender.com/api/orders/health
   - [ ] Should return: `{"status": "healthy", "service": "order-service"}`

7. **Payment Service**: https://food-delevery-app-g73l.onrender.com/api/payments/health
   - [ ] Should return: `{"status": "healthy", "service": "payment-service"}`

8. **Delivery Service**: https://food-delevery-app-g73l.onrender.com/api/delivery/health
   - [ ] Should return: `{"status": "healthy", "service": "delivery-service"}`

9. **Notification Service**: https://food-delevery-app-g73l.onrender.com/api/notifications/health
   - [ ] Should return: `{"status": "healthy", "service": "notification-service"}`

---

## Step 2: Frontend - Landing Page

**URL**: https://aos-git-main-aness-projects.vercel.app/

### Visual Checks:
- [ ] Page loads without errors
- [ ] Logo displays correctly
- [ ] Navigation menu visible
- [ ] "Sign In" and "Create Account" buttons visible
- [ ] Hero section with food images displays
- [ ] No console errors (F12 → Console)

### Actions:
1. Open browser console (F12)
2. Navigate to the site
3. Check for any red errors
4. Take screenshot: `01-landing-page.png`

---

## Step 3: Registration Flow

**URL**: https://aos-git-main-aness-projects.vercel.app/register

### Test Case 1: Customer Registration

**Steps:**
1. Click "Create Account" or navigate to `/register`
2. Fill in the form:
   - Email: `customer1@test.com`
   - Password: `password123`
   - Role: Select "Customer - Order food"
3. Click "Sign In / Register" button

**Expected Results:**
- [ ] Form submits without errors
- [ ] Console shows: `[Registration] Starting registration...`
- [ ] Console shows: `[Registration] Login successful`
- [ ] Redirects to `/dashboard`
- [ ] No error messages displayed

**If Error Occurs:**
- [ ] Check console for error details
- [ ] Note the error message
- [ ] Take screenshot: `02-registration-error.png`

**If Success:**
- [ ] Take screenshot: `02-registration-success.png`

### Test Case 2: Restaurant Owner Registration

**Steps:**
1. Logout (if logged in)
2. Go to `/register`
3. Fill in:
   - Email: `restaurant1@test.com`
   - Password: `password123`
   - Role: Select "Restaurant Owner - Sell food"
4. Submit

**Expected Results:**
- [ ] Successful registration
- [ ] Redirects to restaurant dashboard
- [ ] Take screenshot: `03-restaurant-registration.png`

### Test Case 3: Driver Registration

**Steps:**
1. Logout
2. Go to `/register`
3. Fill in:
   - Email: `driver1@test.com`
   - Password: `password123`
   - Role: Select "Delivery Driver - Deliver orders"
4. Submit

**Expected Results:**
- [ ] Successful registration
- [ ] Redirects to driver dashboard
- [ ] Take screenshot: `04-driver-registration.png`

---

## Step 4: Login Flow

**URL**: https://aos-git-main-aness-projects.vercel.app/login

### Test Case 1: Login as Customer

**Steps:**
1. Navigate to `/login`
2. Enter:
   - Email: `customer1@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Results:**
- [ ] Console shows: `[Login] Starting login...`
- [ ] Console shows: `[Login] Login successful`
- [ ] Redirects to `/dashboard`
- [ ] User email displayed in header
- [ ] Take screenshot: `05-customer-login.png`

### Test Case 2: Invalid Credentials

**Steps:**
1. Logout
2. Try to login with:
   - Email: `wrong@test.com`
   - Password: `wrongpassword`

**Expected Results:**
- [ ] Error message displayed: "Route not found" or "Invalid credentials"
- [ ] Console shows error details
- [ ] User stays on login page
- [ ] Take screenshot: `06-login-error.png`

---

## Step 5: Customer Dashboard

**URL**: https://aos-git-main-aness-projects.vercel.app/dashboard

### Visual Checks:
- [ ] Header with logo and user info
- [ ] Search bar visible
- [ ] Category filters (All, Italian, Japanese, etc.)
- [ ] Restaurant cards displayed
- [ ] Each card shows:
  - Restaurant name
  - Cuisine type
  - Rating
  - Delivery time
  - Delivery fee

### Console Checks:
- [ ] `[CustomerHome] Fetching restaurants...`
- [ ] `[CustomerHome] Restaurants loaded: X items`
- [ ] No error messages

### Actions:
1. Click on different categories
2. Verify restaurants filter by category
3. Take screenshot: `07-customer-dashboard.png`

---

## Step 6: Restaurant Details & Menu

### Test Case: View Restaurant Menu

**Steps:**
1. From customer dashboard, click on any restaurant card
2. Should navigate to `/restaurant/:id`

**Expected Results:**
- [ ] Restaurant header with image
- [ ] Restaurant name and cuisine
- [ ] Rating, delivery time, delivery fee
- [ ] Menu items grouped by category
- [ ] Each menu item shows:
  - Name
  - Description
  - Price
  - "Add to Cart" button

### Console Checks:
- [ ] `[RestaurantDetails] Fetching data for restaurant: {id}`
- [ ] `[RestaurantDetails] Restaurant loaded: {name}`
- [ ] `[RestaurantDetails] Menu items: X`

### Actions:
1. Click "Add to Cart" on a menu item
2. Verify toast notification appears
3. Verify cart count increases
4. Take screenshot: `08-restaurant-menu.png`

---

## Step 7: Cart & Checkout

### Test Case: Add Items and Checkout

**Steps:**
1. Add 2-3 items to cart
2. Click cart icon
3. Review cart items
4. Click "Checkout" or "Proceed to Checkout"

**Expected Results:**
- [ ] Cart shows all added items
- [ ] Correct quantities
- [ ] Correct prices
- [ ] Total amount calculated
- [ ] Checkout form appears

### Checkout Form:
- [ ] Delivery address fields
- [ ] Payment method selection
- [ ] Order summary
- [ ] "Place Order" button

**Actions:**
1. Fill in delivery address
2. Select payment method
3. Click "Place Order"
4. Take screenshot: `09-checkout.png`

**Expected Results:**
- [ ] Console shows: `[Checkout] Processing order...`
- [ ] Order confirmation page appears
- [ ] Order number displayed
- [ ] Take screenshot: `10-order-confirmation.png`

---

## Step 8: Order History

**URL**: https://aos-git-main-aness-projects.vercel.app/orders

### Test Case: View Past Orders

**Steps:**
1. Navigate to order history
2. Check if previous order appears

**Expected Results:**
- [ ] List of orders displayed
- [ ] Each order shows:
  - Order number
  - Date
  - Restaurant name
  - Total amount
  - Status
- [ ] Console shows: `[OrderHistory] Fetching orders...`
- [ ] Take screenshot: `11-order-history.png`

---

## Step 9: Restaurant Owner Dashboard

### Test Case: Login as Restaurant Owner

**Steps:**
1. Logout
2. Login with: `restaurant1@test.com` / `password123`
3. Should redirect to restaurant dashboard

**Expected Results:**
- [ ] Restaurant dashboard loads
- [ ] Shows restaurant statistics
- [ ] Navigation menu with:
  - Dashboard
  - Menu Management
  - Orders
  - Reviews
  - Profile

**Visual Checks:**
- [ ] Revenue statistics
- [ ] Order counts
- [ ] Recent orders list
- [ ] Take screenshot: `12-restaurant-dashboard.png`

---

## Step 10: Menu Management

**URL**: Restaurant menu management page

### Test Case: View and Manage Menu

**Steps:**
1. Click "Menu Management" from restaurant dashboard
2. View existing menu items

**Expected Results:**
- [ ] Console shows: `[MenuManagement] Fetching menu items...`
- [ ] Console shows: `[MenuManagement] Menu loaded: X items`
- [ ] Menu items displayed in grid/list
- [ ] Each item shows:
  - Name
  - Category
  - Price
  - Availability toggle
  - Edit/Delete buttons

**Actions:**
1. Try to add new menu item (if form available)
2. Try to edit existing item
3. Toggle availability
4. Take screenshot: `13-menu-management.png`

---

## Step 11: Restaurant Order Management

**URL**: Restaurant orders page

### Test Case: View Incoming Orders

**Steps:**
1. Click "Orders" from restaurant dashboard
2. View orders in different tabs

**Expected Results:**
- [ ] Console shows: `[OrderManagement] Fetching restaurant orders...`
- [ ] Console shows: `[OrderManagement] Orders loaded: X`
- [ ] Tabs visible:
  - Incoming
  - Preparing
  - Completed
- [ ] Orders displayed with:
  - Order number
  - Customer name
  - Items
  - Total amount
  - Status
  - Action buttons

**Actions:**
1. Switch between tabs
2. Try to update order status (if available)
3. Take screenshot: `14-restaurant-orders.png`

---

## Step 12: Driver Dashboard

### Test Case: Login as Driver

**Steps:**
1. Logout
2. Login with: `driver1@test.com` / `password123`
3. Should redirect to driver dashboard

**Expected Results:**
- [ ] Driver dashboard loads
- [ ] Shows driver statistics:
  - Today's earnings
  - Deliveries completed
  - Average rating
  - Online hours
- [ ] "Go Online/Offline" toggle button
- [ ] Quick action buttons:
  - Available Orders
  - Earnings
  - Profile

**Actions:**
1. Click "Go Online"
2. Verify status changes
3. Console shows: `[DriverDashboard] Toggling online status: true`
4. Take screenshot: `15-driver-dashboard.png`

---

## Step 13: Available Orders (Driver)

**URL**: Driver available orders page

### Test Case: View Available Deliveries

**Steps:**
1. Click "Available Orders"
2. View list of orders available for pickup

**Expected Results:**
- [ ] List of available orders
- [ ] Each order shows:
  - Restaurant name
  - Delivery address
  - Distance
  - Payment amount
  - "Accept" button

**Actions:**
1. Try to accept an order (if available)
2. Take screenshot: `16-available-orders.png`

---

## Step 14: Profile Management

### Test Case: Update User Profile

**Steps:**
1. Navigate to profile page
2. View current profile information

**Expected Results:**
- [ ] Profile form displayed
- [ ] Fields for:
  - Name
  - Phone
  - Address
  - Avatar
- [ ] Save button

**Actions:**
1. Update profile information
2. Click save
3. Verify success message
4. Take screenshot: `17-profile.png`

---

## Step 15: API Testing with Console

### Test Case: Monitor API Calls

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Perform various actions (login, browse restaurants, etc.)

**Check for:**
- [ ] All API calls go to correct endpoints
- [ ] Status codes are 200 (success) or appropriate
- [ ] Response data is valid JSON
- [ ] No 404 or 500 errors
- [ ] Authorization headers present

**Take screenshots:**
- [ ] `18-network-tab.png`
- [ ] `19-api-responses.png`

---

## Step 16: Error Handling

### Test Case: Network Error Handling

**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to perform actions

**Expected Results:**
- [ ] Error messages displayed to user
- [ ] Console shows detailed error logs
- [ ] App doesn't crash
- [ ] Fallback to mock data (if implemented)

**Actions:**
1. Set network back to "Online"
2. Verify app recovers
3. Take screenshot: `20-error-handling.png`

---

## Step 17: Responsive Design

### Test Case: Mobile View

**Steps:**
1. Open DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Navigate through all pages

**Check:**
- [ ] Layout adapts to mobile
- [ ] All buttons are clickable
- [ ] Text is readable
- [ ] Images scale properly
- [ ] Navigation menu works

**Take screenshots:**
- [ ] `21-mobile-landing.png`
- [ ] `22-mobile-dashboard.png`
- [ ] `23-mobile-menu.png`

---

## Step 18: Browser Compatibility

### Test in Different Browsers:

1. **Chrome**
   - [ ] All features work
   - [ ] No console errors

2. **Firefox**
   - [ ] All features work
   - [ ] No console errors

3. **Safari** (if on Mac)
   - [ ] All features work
   - [ ] No console errors

---

## Step 19: Performance Check

### Test Case: Page Load Times

**Steps:**
1. Open DevTools → Network tab
2. Reload page
3. Check "Load" time at bottom

**Expected:**
- [ ] Landing page loads < 3 seconds
- [ ] Dashboard loads < 5 seconds
- [ ] No resources fail to load

**Take screenshot:** `24-performance.png`

---

## Step 20: Console Logs Review

### Final Console Check

**Steps:**
1. Open console (F12)
2. Review all logs from testing session

**Look for:**
- [ ] All `[PageName]` prefixed logs present
- [ ] No uncaught errors
- [ ] API calls logged correctly
- [ ] Error details logged when errors occur

**Take screenshot:** `25-console-logs.png`

---

## 📊 Summary Checklist

### Backend (9 services):
- [ ] API Gateway
- [ ] Auth Service
- [ ] User Service
- [ ] Restaurant Service
- [ ] Menu Service
- [ ] Order Service
- [ ] Payment Service
- [ ] Delivery Service
- [ ] Notification Service

### Frontend Pages:
- [ ] Landing Page
- [ ] Login Page
- [ ] Register Page
- [ ] Customer Dashboard
- [ ] Restaurant Details
- [ ] Cart & Checkout
- [ ] Order History
- [ ] Restaurant Dashboard
- [ ] Menu Management
- [ ] Restaurant Orders
- [ ] Driver Dashboard
- [ ] Available Orders
- [ ] Profile Page

### Features:
- [ ] Authentication (Login/Register/Logout)
- [ ] Restaurant Browsing
- [ ] Menu Viewing
- [ ] Cart Management
- [ ] Order Placement
- [ ] Order Tracking
- [ ] Restaurant Management
- [ ] Driver Management
- [ ] Profile Management
- [ ] Error Handling
- [ ] Responsive Design

---

## 🐛 Issues Found

Document any issues here:

| Issue # | Page/Feature | Description | Severity | Screenshot |
|---------|-------------|-------------|----------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## ✅ Final Status

- **Total Tests**: 20 steps
- **Passed**: ___
- **Failed**: ___
- **Blocked**: ___

**Overall Status**: ⬜ PASS / ⬜ FAIL

**Notes:**
