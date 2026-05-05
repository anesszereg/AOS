# Local Development Guide

## 🎯 **Setup Overview**

**Architecture:**
- **Backend**: All microservices running locally on `localhost:3000`
- **Frontend**: Deployed on Vercel at `https://fooddelevryapp.vercel.app`
- **Database**: PostgreSQL (local or cloud)

---

## 📋 **Prerequisites**

1. **Node.js** (v18 or higher)
2. **PostgreSQL** database running
3. **npm** or **yarn**

---

## 🚀 **Quick Start**

### **Option 1: Automated Start (Recommended)**

```bash
./start-local-dev.sh
```

This script will:
1. Install dependencies
2. Build all microservices
3. Create `.env.local` file
4. Start the local server on port 3000

### **Option 2: Manual Start**

```bash
# 1. Install dependencies
npm install

# 2. Build all services
npm run build

# 3. Create frontend .env.local
echo "VITE_API_URL=http://localhost:3000/api" > frontend/food-delivery-app/.env.local

# 4. Start local server
node local-server.js
```

---

## 🔧 **Configuration**

### **Database Setup**

Set your database connection in environment variables:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/food_delivery"
```

Or use individual variables:
```bash
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_NAME=food_delivery
export DATABASE_USER=your_user
export DATABASE_PASSWORD=your_password
```

### **Frontend Configuration**

The frontend is deployed on Vercel and configured to call your local backend.

**File**: `frontend/food-delivery-app/.env.local`
```
VITE_API_URL=http://localhost:3000/api
```

---

## 📡 **Available Services**

All services run on `localhost:3000` with the following paths:

| Service | Base Path | Description |
|---------|-----------|-------------|
| Auth | `/api/auth` | Authentication & registration |
| Restaurants | `/api/restaurants` | Restaurant management |
| Menu | `/api/menu` | Menu items management |
| Users | `/api/users` | User profiles |
| Orders | `/api/orders` | Order management |
| Payments | `/api/payments` | Payment processing |
| Delivery | `/api/delivery` | Delivery tracking |
| Notifications | `/api/notifications` | Push notifications |

---

## 🔐 **Authentication**

### **Register a User**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "customer",
    "name": "John Doe"
  }'
```

### **Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response!

---

## 🧪 **Testing Endpoints**

### **Get All Restaurants**

```bash
curl http://localhost:3000/api/restaurants
```

### **Create Restaurant (Authenticated)**

```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Restaurant",
    "cuisine": "Italian",
    "address": "123 Main St, City, State, 12345",
    "phone": "+1234567890",
    "email": "restaurant@example.com"
  }'
```

### **Get Menu Items**

```bash
curl http://localhost:3000/api/menu/restaurant/RESTAURANT_ID
```

### **Create Order**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "uuid",
    "items": [
      {"menuItemId": "uuid", "quantity": 2}
    ],
    "deliveryAddress": "456 Oak St, City, State"
  }'
```

---

## 👨‍💼 **Admin Access**

### **Create Admin Account**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin",
    "name": "Admin User"
  }'
```

### **Admin Endpoints**

```bash
# Get all users
curl http://localhost:3000/api/users/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Get platform stats
curl http://localhost:3000/api/users/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Get pending restaurants
curl http://localhost:3000/api/restaurants/admin/restaurants/pending \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🌐 **Frontend Access**

The frontend is deployed on Vercel and automatically configured to use your local backend.

**URL**: https://fooddelevryapp.vercel.app

**How it works:**
1. Frontend reads `VITE_API_URL` from environment
2. All API calls go to `http://localhost:3000/api`
3. CORS is configured to allow Vercel domain

---

## 🐛 **Troubleshooting**

### **Port 3000 already in use**

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 node local-server.js
```

### **Database connection failed**

1. Check PostgreSQL is running:
   ```bash
   psql -U postgres -c "SELECT 1"
   ```

2. Verify DATABASE_URL is set:
   ```bash
   echo $DATABASE_URL
   ```

3. Check database exists:
   ```bash
   psql -U postgres -l
   ```

### **Services not loading**

1. Rebuild services:
   ```bash
   npm run build
   ```

2. Check for TypeScript errors:
   ```bash
   cd services/restaurant-service
   npm run build
   ```

### **CORS errors from frontend**

1. Check local server is running on port 3000
2. Verify `.env.local` has correct URL
3. Check browser console for exact error

---

## 📊 **Development Workflow**

### **1. Start Backend**

```bash
./start-local-dev.sh
```

### **2. Access Frontend**

Open https://fooddelevryapp.vercel.app in your browser

### **3. Make Changes**

- **Backend**: Edit files in `services/*/src/`
- **Frontend**: Changes auto-deploy to Vercel on git push

### **4. Rebuild After Changes**

```bash
# Rebuild specific service
cd services/restaurant-service
npm run build

# Or rebuild all
npm run build
```

### **5. Restart Server**

```bash
# Stop with Ctrl+C
# Start again
node local-server.js
```

---

## 📝 **Environment Variables**

### **Required**

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/food_delivery
```

### **Optional**

```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment
JWT_SECRET=your-secret-key   # For auth service
```

---

## 🔄 **Deployment**

### **Backend (Render)**

The monolith server is deployed on Render:
- URL: https://food-delevery-app-g73l.onrender.com
- Auto-deploys on git push to main

### **Frontend (Vercel)**

The frontend is deployed on Vercel:
- URL: https://fooddelevryapp.vercel.app
- Auto-deploys on git push to main
- Set `VITE_API_URL` in Vercel environment variables

---

## 📚 **Additional Documentation**

- `ADMIN_ENDPOINTS_ANALYSIS.md` - Admin features documentation
- `ADMIN_CURL_TESTS.md` - Admin API testing guide
- `RESTAURANT_API_ENDPOINTS.md` - Restaurant API documentation
- `PROJECT_STATUS_REPORT.md` - Project status and features

---

## 🆘 **Getting Help**

1. Check server logs in terminal
2. Check browser console for frontend errors
3. Use `curl` to test endpoints directly
4. Check database logs: `tail -f /var/log/postgresql/postgresql.log`

---

## ✅ **Checklist**

Before starting development:

- [ ] PostgreSQL is running
- [ ] DATABASE_URL is set
- [ ] Dependencies installed (`npm install`)
- [ ] Services built (`npm run build`)
- [ ] `.env.local` created in frontend
- [ ] Local server started (`node local-server.js`)
- [ ] Frontend accessible at Vercel URL
- [ ] Test endpoint: `curl http://localhost:3000/health`

---

## 🎉 **You're Ready!**

Your local development environment is set up. The backend runs on your machine while the frontend is on Vercel, giving you the best of both worlds!

**Happy coding! 🚀**
