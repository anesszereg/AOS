# Admin Endpoints Analysis

## 📊 **SUMMARY**

**Status:** ⚠️ **PARTIALLY IMPLEMENTED**

- ✅ **4 endpoints** implemented in backend
- ❌ **7 endpoints** NOT implemented (frontend expects them)
- ⚠️ Admin routes NOT mounted in monolith server
- ⚠️ Support tickets service doesn't exist

---

## 🎯 **ADMIN PAGES**

### 1. **Dashboard** (`/admin/dashboard`)
**Purpose:** Overview statistics

**API Calls:**
- `GET /admin/stats` - Get platform statistics

**Status:** ⚠️ **PARTIALLY WORKING**
- Backend: ✅ Implemented in user-service
- Monolith: ❌ NOT mounted
- Returns: totalRevenue, totalOrders, activeUsers, activeRestaurants, activeDrivers, todayOrders

---

### 2. **User Management** (`/admin/users`)
**Purpose:** Manage all users

**API Calls:**
- `GET /admin/users?role=customer` - Get all users with optional role filter
- `PATCH /admin/users/:userId/status` - Update user status (active/suspended)
- `DELETE /admin/users/:userId` - Delete user

**Status:** ⚠️ **PARTIALLY WORKING**
- Backend: ✅ Implemented in user-service
- Monolith: ❌ NOT mounted

---

### 3. **Restaurant Onboarding** (`/admin/restaurants`)
**Purpose:** Approve/reject restaurant applications

**API Calls:**
- `GET /admin/restaurants/pending` - Get pending restaurant applications
- `PATCH /admin/restaurants/:id/approve` - Approve restaurant
- `PATCH /admin/restaurants/:id/reject` - Reject restaurant with reason

**Status:** ⚠️ **PARTIALLY WORKING**
- Backend: ✅ Implemented in restaurant-service
- Monolith: ❌ NOT mounted

---

### 4. **Support Tickets** (`/admin/support`)
**Purpose:** Manage customer support tickets

**API Calls:**
- `GET /admin/support-tickets?status=open` - Get support tickets
- `PATCH /admin/support-tickets/:id` - Update ticket
- `POST /admin/support-tickets` - Create ticket

**Status:** ❌ **NOT IMPLEMENTED**
- Backend: ❌ No support-service exists
- Monolith: ❌ NOT mounted
- Frontend: Has fallback (returns empty array)

---

### 5. **Content Management** (`/admin/content`)
**Purpose:** Manage coupons and promotions

**API Calls:**
- `GET /admin/coupons` - Get all coupons
- `POST /admin/coupons` - Create coupon

**Status:** ❌ **NOT IMPLEMENTED**
- Backend: ❌ No coupon service/controller exists
- Monolith: ❌ NOT mounted

---

## 🔧 **BACKEND IMPLEMENTATION STATUS**

### ✅ **Implemented Endpoints**

#### **User Service** (`/api/users/admin`)
```typescript
GET    /admin/users                    // Get all users
GET    /admin/users/:userId            // Get user by ID
PATCH  /admin/users/:userId/status     // Update user status
DELETE /admin/users/:userId            // Delete user
GET    /admin/stats                    // Platform statistics
```

#### **Restaurant Service** (`/api/restaurants/admin`)
```typescript
GET    /admin/restaurants/pending      // Get pending restaurants
PATCH  /admin/restaurants/:id/approve  // Approve restaurant
PATCH  /admin/restaurants/:id/reject   // Reject restaurant
```

### ❌ **NOT Implemented**

```typescript
// Support Tickets (no service exists)
GET    /admin/support-tickets
PATCH  /admin/support-tickets/:id
POST   /admin/support-tickets

// Coupons (no controller exists)
GET    /admin/coupons
POST   /admin/coupons
```

---

## 🚨 **CRITICAL ISSUES**

### **Issue 1: Admin Routes NOT Mounted in Monolith**

**Problem:**
The monolith server mounts services at:
- `/api/auth` → auth-service
- `/api/restaurants` → restaurant-service
- `/api/menu` → menu-service
- `/api/users` → user-service

But admin routes are mounted INSIDE each service at `/admin`:
- User service: `app.use('/admin', adminRoutes)`
- Restaurant service: `app.use('/admin', adminRoutes)`

**Result:**
Admin endpoints are accessible at:
- ❌ `/api/users/admin/users` (WRONG - doesn't work)
- ✅ Should be: `/api/admin/users`

**Fix Needed:**
Create a dedicated admin service or mount admin routes separately in monolith.

---

### **Issue 2: Missing Services**

**Support Tickets:**
- No `support-service` exists
- Frontend expects `/admin/support-tickets`
- Currently returns empty array (fallback)

**Coupons:**
- No coupon controller exists
- Frontend expects `/admin/coupons`
- Will get 404 errors

---

### **Issue 3: Frontend Fallbacks**

The frontend has 404 fallbacks for missing endpoints:
```typescript
catch (error: any) {
  if (error.response?.status === 404) {
    console.warn('Admin endpoint not implemented yet');
    return { data: { data: [] } };
  }
  throw error;
}
```

This **hides errors** but means admin pages show **empty data** instead of failing.

---

## ✅ **FIXES NEEDED**

### **Fix 1: Mount Admin Routes in Monolith**

Add admin route mounting in `monolith-server.js`:

```javascript
// Admin routes aggregator
app.use('/api/admin', (req, res, next) => {
  // Route to appropriate service based on path
  if (req.path.startsWith('/users')) {
    // Forward to user-service admin routes
  } else if (req.path.startsWith('/restaurants')) {
    // Forward to restaurant-service admin routes
  } else if (req.path.startsWith('/stats')) {
    // Forward to user-service stats
  }
});
```

### **Fix 2: Create Missing Services**

**Option A: Create support-service**
```bash
cd services
mkdir support-service
# Implement support ticket CRUD
```

**Option B: Add to existing service**
Add support tickets to user-service or create admin-service

### **Fix 3: Implement Coupon Management**

Add coupon controller to restaurant-service or order-service

---

## 📋 **TESTING CHECKLIST**

### **User Management**
- [ ] GET /api/admin/users - List all users
- [ ] GET /api/admin/users?role=customer - Filter by role
- [ ] PATCH /api/admin/users/:id/status - Suspend user
- [ ] DELETE /api/admin/users/:id - Delete user

### **Restaurant Management**
- [ ] GET /api/admin/restaurants/pending - List pending
- [ ] PATCH /api/admin/restaurants/:id/approve - Approve
- [ ] PATCH /api/admin/restaurants/:id/reject - Reject

### **Statistics**
- [ ] GET /api/admin/stats - Get platform stats

### **Support Tickets** (NOT IMPLEMENTED)
- [ ] GET /api/admin/support-tickets
- [ ] PATCH /api/admin/support-tickets/:id
- [ ] POST /api/admin/support-tickets

### **Coupons** (NOT IMPLEMENTED)
- [ ] GET /api/admin/coupons
- [ ] POST /api/admin/coupons

---

## 🎯 **RECOMMENDED ACTIONS**

### **Priority 1: Fix Admin Route Mounting** ⚠️ CRITICAL
Mount admin routes correctly in monolith so they're accessible

### **Priority 2: Test Existing Endpoints**
Test the 4 implemented endpoints to ensure they work

### **Priority 3: Implement Missing Features** (Optional)
- Support tickets service
- Coupon management

### **Priority 4: Remove Fallbacks**
Once endpoints work, remove the 404 fallbacks so real errors show

---

## 📝 **ENDPOINT MAPPING**

| Frontend Expects | Backend Has | Monolith Mounts | Status |
|-----------------|-------------|-----------------|--------|
| `/api/admin/users` | ✅ `/admin/users` (user-service) | ❌ Not mounted | ⚠️ |
| `/api/admin/users/:id/status` | ✅ `/admin/users/:id/status` | ❌ Not mounted | ⚠️ |
| `/api/admin/stats` | ✅ `/admin/stats` (user-service) | ❌ Not mounted | ⚠️ |
| `/api/admin/restaurants/pending` | ✅ `/admin/restaurants/pending` | ❌ Not mounted | ⚠️ |
| `/api/admin/restaurants/:id/approve` | ✅ `/admin/restaurants/:id/approve` | ❌ Not mounted | ⚠️ |
| `/api/admin/restaurants/:id/reject` | ✅ `/admin/restaurants/:id/reject` | ❌ Not mounted | ⚠️ |
| `/api/admin/support-tickets` | ❌ Not implemented | ❌ Not mounted | ❌ |
| `/api/admin/coupons` | ❌ Not implemented | ❌ Not mounted | ❌ |

---

## 🔗 **FILES TO CHECK**

**Backend:**
- `services/user-service/src/routes/admin.routes.ts`
- `services/user-service/src/controllers/admin.controller.ts`
- `services/restaurant-service/src/routes/admin.routes.ts`
- `services/restaurant-service/src/controllers/admin.controller.ts`

**Frontend:**
- `frontend/food-delivery-app/src/pages/admin/Dashboard.tsx`
- `frontend/food-delivery-app/src/pages/admin/UserManagement.tsx`
- `frontend/food-delivery-app/src/pages/admin/RestaurantOnboarding.tsx`
- `frontend/food-delivery-app/src/pages/admin/SupportTickets.tsx`
- `frontend/food-delivery-app/src/pages/admin/ContentManagement.tsx`
- `frontend/food-delivery-app/src/services/apiWithToast.ts`

**Monolith:**
- `monolith-server.js` - Needs admin route mounting

---

## ✅ **CONCLUSION**

**Current State:**
- 4/11 admin endpoints implemented in backend
- 0/11 admin endpoints accessible (not mounted in monolith)
- Admin pages will show empty data due to fallbacks

**To Make Admin Work:**
1. Mount admin routes in monolith server
2. Test existing 4 endpoints
3. Optionally implement missing 7 endpoints
