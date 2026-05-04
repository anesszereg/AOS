const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize databases before mounting services
async function initializeDatabases() {
  console.log('🔧 Initializing databases...');
  
  try {
    // Initialize restaurant service database
    const restaurantDb = require('./services/restaurant-service/dist/config/database');
    if (restaurantDb.db && restaurantDb.db.initializeSchema) {
      await restaurantDb.db.initializeSchema();
      console.log('✅ Restaurant database initialized');
    }
  } catch (error) {
    console.warn('⚠️  Restaurant database initialization failed:', error.message);
  }

  try {
    // Initialize menu service database
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

// Import and mount service routes (from compiled dist folders)
try {
  // Auth Service
  const authApp = require('./services/auth-service/dist/app');
  app.use('/api/auth', authApp.createApp ? authApp.createApp() : authApp);
  console.log('✅ Auth service mounted at /api/auth');
} catch (error) {
  console.warn('⚠️  Auth service not available:', error.message);
}

try {
  // Restaurant Service
  const restaurantApp = require('./services/restaurant-service/dist/app');
  app.use('/api/restaurants', restaurantApp.createApp ? restaurantApp.createApp() : restaurantApp);
  console.log('✅ Restaurant service mounted at /api/restaurants');
} catch (error) {
  console.warn('⚠️  Restaurant service not available:', error.message);
}

try {
  // Menu Service
  const menuApp = require('./services/menu-service/dist/app');
  app.use('/api/menu', menuApp.createApp ? menuApp.createApp() : menuApp);
  console.log('✅ Menu service mounted at /api/menu');
} catch (error) {
  console.warn('⚠️  Menu service not available:', error.message);
}

try {
  // User Service
  const userApp = require('./services/user-service/dist/app');
  const userAppInstance = userApp.createApp ? userApp.createApp() : userApp;
  app.use('/api/users', userAppInstance);
  console.log('✅ User service mounted at /api/users');
  
  // Mount user admin routes at /api/admin
  try {
    const userAdminRoutes = require('./services/user-service/dist/routes/admin.routes');
    app.use('/api/admin', userAdminRoutes.default || userAdminRoutes);
    console.log('✅ User admin routes mounted at /api/admin');
  } catch (adminError) {
    console.warn('⚠️  User admin routes not available:', adminError.message);
  }
} catch (error) {
  console.warn('⚠️  User service not available:', error.message);
}

try {
  // Restaurant admin routes at /api/admin
  const restaurantAdminRoutes = require('./services/restaurant-service/dist/routes/admin.routes');
  app.use('/api/admin', restaurantAdminRoutes.default || restaurantAdminRoutes);
  console.log('✅ Restaurant admin routes mounted at /api/admin');
} catch (error) {
  console.warn('⚠️  Restaurant admin routes not available:', error.message);
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

// Start server after database initialization
async function startServer() {
  try {
    // Initialize databases first
    await initializeDatabases();
    
    // Then start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Monolith server listening on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`\n📍 Available endpoints:`);
      console.log(`\n   🔐 Auth:`);
      console.log(`   - POST   /api/auth/register`);
      console.log(`   - POST   /api/auth/login`);
      console.log(`\n   🍽️  Restaurants:`);
      console.log(`   - GET    /api/restaurants`);
      console.log(`   - GET    /api/restaurants/my-restaurant`);
      console.log(`   - POST   /api/restaurants`);
      console.log(`   - PUT    /api/restaurants/:id`);
      console.log(`\n   📋 Menu:`);
      console.log(`   - GET    /api/menu/restaurant/:id`);
      console.log(`   - POST   /api/menu`);
      console.log(`\n   👨‍💼 Admin:`);
      console.log(`   - GET    /api/admin/users`);
      console.log(`   - PATCH  /api/admin/users/:id/status`);
      console.log(`   - GET    /api/admin/stats`);
      console.log(`   - GET    /api/admin/restaurants/pending`);
      console.log(`   - PATCH  /api/admin/restaurants/:id/approve`);
      console.log(`   - PATCH  /api/admin/restaurants/:id/reject`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
