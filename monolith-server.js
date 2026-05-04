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
  app.use('/api/users', userApp.createApp ? userApp.createApp() : userApp);
  console.log('✅ User service mounted at /api/users');
} catch (error) {
  console.warn('⚠️  User service not available:', error.message);
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Monolith server listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
