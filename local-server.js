require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - Allow Vercel frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://fooddelevryapp.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🚀 Starting Local Development Server...\n');

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'local-development'
  });
});

// Initialize databases before mounting services
async function initializeDatabases() {
  console.log('🔧 Initializing databases...\n');
  
  try {
    const restaurantDb = require('./services/restaurant-service/dist/config/database');
    if (restaurantDb.db && restaurantDb.db.initializeSchema) {
      await restaurantDb.db.initializeSchema();
      console.log('✅ Restaurant database initialized');
    }
  } catch (error) {
    console.warn('⚠️  Restaurant database initialization failed:', error.message);
  }

  try {
    const menuDb = require('./services/menu-service/dist/config/database');
    if (menuDb.db && menuDb.db.initializeSchema) {
      await menuDb.db.initializeSchema();
      console.log('✅ Menu database initialized');
    }
  } catch (error) {
    console.warn('⚠️  Menu database initialization failed:', error.message);
  }

  console.log('✅ Database initialization complete\n');
}

// Mount services
console.log('📦 Loading microservices...\n');

try {
  const authApp = require('./services/auth-service/dist/app');
  app.use('/api/auth', authApp.createApp ? authApp.createApp() : authApp);
  console.log('✅ Auth service mounted at /api/auth');
} catch (error) {
  console.warn('⚠️  Auth service not available:', error.message);
}

try {
  const restaurantApp = require('./services/restaurant-service/dist/app');
  app.use('/api/restaurants', restaurantApp.createApp ? restaurantApp.createApp() : restaurantApp);
  console.log('✅ Restaurant service mounted at /api/restaurants');
  console.log('   - Includes: /api/restaurants/admin/* routes');
} catch (error) {
  console.warn('⚠️  Restaurant service not available:', error.message);
}

try {
  const menuApp = require('./services/menu-service/dist/app');
  app.use('/api/menu', menuApp.createApp ? menuApp.createApp() : menuApp);
  console.log('✅ Menu service mounted at /api/menu');
} catch (error) {
  console.warn('⚠️  Menu service not available:', error.message);
}

try {
  const userApp = require('./services/user-service/dist/app');
  app.use('/api/users', userApp.createApp ? userApp.createApp() : userApp);
  console.log('✅ User service mounted at /api/users');
  console.log('   - Includes: /api/users/admin/* routes');
} catch (error) {
  console.warn('⚠️  User service not available:', error.message);
}

try {
  const orderApp = require('./services/order-service/dist/app');
  app.use('/api/orders', orderApp.createApp ? orderApp.createApp() : orderApp);
  console.log('✅ Order service mounted at /api/orders');
} catch (error) {
  console.warn('⚠️  Order service not available:', error.message);
}

try {
  const paymentApp = require('./services/payment-service/dist/app');
  app.use('/api/payments', paymentApp.createApp ? paymentApp.createApp() : paymentApp);
  console.log('✅ Payment service mounted at /api/payments');
} catch (error) {
  console.warn('⚠️  Payment service not available:', error.message);
}

try {
  const deliveryApp = require('./services/delivery-service/dist/app');
  app.use('/api/delivery', deliveryApp.createApp ? deliveryApp.createApp() : deliveryApp);
  console.log('✅ Delivery service mounted at /api/delivery');
} catch (error) {
  console.warn('⚠️  Delivery service not available:', error.message);
}

try {
  const notificationApp = require('./services/notification-service/dist/app');
  app.use('/api/notifications', notificationApp.createApp ? notificationApp.createApp() : notificationApp);
  console.log('✅ Notification service mounted at /api/notifications');
} catch (error) {
  console.warn('⚠️  Notification service not available:', error.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      path: req.path
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

// Start server
async function startServer() {
  try {
    await initializeDatabases();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 LOCAL DEVELOPMENT SERVER RUNNING');
      console.log('='.repeat(60));
      console.log(`\n📍 Server URL: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`\n🌐 Frontend (Vercel): https://fooddelevryapp.vercel.app`);
      console.log(`   Configure frontend to use: http://localhost:${PORT}/api`);
      
      console.log(`\n📡 Available Endpoints:\n`);
      console.log('   🔐 Auth:');
      console.log('   - POST   /api/auth/register');
      console.log('   - POST   /api/auth/login');
      console.log('   - POST   /api/auth/logout');
      
      console.log('\n   🍽️  Restaurants:');
      console.log('   - GET    /api/restaurants');
      console.log('   - GET    /api/restaurants/:id');
      console.log('   - GET    /api/restaurants/my-restaurant');
      console.log('   - POST   /api/restaurants');
      console.log('   - PUT    /api/restaurants/:id');
      
      console.log('\n   📋 Menu:');
      console.log('   - GET    /api/menu/restaurant/:id');
      console.log('   - POST   /api/menu');
      console.log('   - PUT    /api/menu/:id');
      console.log('   - DELETE /api/menu/:id');
      
      console.log('\n   👥 Users:');
      console.log('   - GET    /api/users/profile');
      console.log('   - PUT    /api/users/profile');
      
      console.log('\n   📦 Orders:');
      console.log('   - GET    /api/orders');
      console.log('   - POST   /api/orders');
      console.log('   - GET    /api/orders/:id');
      console.log('   - PATCH  /api/orders/:id/status');
      
      console.log('\n   💳 Payments:');
      console.log('   - POST   /api/payments/intent');
      console.log('   - POST   /api/payments/confirm');
      
      console.log('\n   🚚 Delivery:');
      console.log('   - GET    /api/delivery/active');
      console.log('   - PATCH  /api/delivery/:id/status');
      
      console.log('\n   👨‍💼 Admin:');
      console.log('   - GET    /api/users/admin/users');
      console.log('   - PATCH  /api/users/admin/users/:id/status');
      console.log('   - GET    /api/users/admin/stats');
      console.log('   - GET    /api/restaurants/admin/restaurants/pending');
      console.log('   - PATCH  /api/restaurants/admin/restaurants/:id/approve');
      
      console.log('\n' + '='.repeat(60));
      console.log('✨ Ready for development!');
      console.log('='.repeat(60) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
