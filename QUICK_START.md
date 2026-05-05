# Quick Start Guide

## 🚀 **Start Local Development in 3 Steps**

### **Step 1: Set Database URL**

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/food_delivery"
```

### **Step 2: Start Server**

```bash
./start-local-dev.sh
```

### **Step 3: Access Frontend**

Open: **https://fooddelevryapp.vercel.app**

---

## ✅ **That's It!**

- ✅ Backend runs on `localhost:3000`
- ✅ Frontend on Vercel (already deployed)
- ✅ All APIs automatically connected
- ✅ Database tables auto-created

---

## 📡 **Test It Works**

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"customer","name":"Test User"}'
```

---

## 🔧 **Common Commands**

```bash
# Start server
./start-local-dev.sh

# Rebuild services
npm run build

# Check logs
# (logs appear in terminal)

# Stop server
# Press Ctrl+C
```

---

## 📚 **Full Documentation**

See `LOCAL_DEVELOPMENT_GUIDE.md` for complete instructions.

---

## 🆘 **Troubleshooting**

**Port 3000 in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**Database not connecting?**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"
```

**Services not building?**
```bash
npm install
npm run build
```

---

## 🎯 **Project Structure**

```
food-delivery-platform/
├── local-server.js          ← Local dev server
├── start-local-dev.sh       ← Startup script
├── services/                ← All microservices
│   ├── auth-service/
│   ├── restaurant-service/
│   ├── menu-service/
│   ├── order-service/
│   └── ...
└── frontend/
    └── food-delivery-app/   ← Deployed on Vercel
```

---

## 🌐 **URLs**

- **Local Backend**: http://localhost:3000
- **Frontend (Vercel)**: https://fooddelevryapp.vercel.app
- **Health Check**: http://localhost:3000/health

---

**Happy coding! 🎉**
