const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import and mount all service apps directly
async function startServer() {
  try {
    console.log('🚀 Loading all services...');

    // Import service apps (they export the Express app, not start the server)
    const { createApp: createAuthApp } = require('./services/auth-service/dist/app');
    const { createApp: createUserApp } = require('./services/user-service/dist/app');
    const { createApp: createRestaurantApp } = require('./services/restaurant-service/dist/app');
    const { createApp: createMenuApp } = require('./services/menu-service/dist/app');
    const { createApp: createOrderApp } = require('./services/order-service/dist/app');
    const { createApp: createPaymentApp } = require('./services/payment-service/dist/app');
    const { createApp: createDeliveryApp } = require('./services/delivery-service/dist/app');
    const { createApp: createNotificationApp } = require('./services/notification-service/dist/app');

    // Create service apps
    const authApp = createAuthApp();
    const userApp = createUserApp();
    const restaurantApp = createRestaurantApp();
    const menuApp = createMenuApp();
    const orderApp = createOrderApp();
    const paymentApp = createPaymentApp();
    const deliveryApp = createDeliveryApp();
    const notificationApp = createNotificationApp();

    // Mount services
    app.use('/api/v1/auth', authApp);
    app.use('/api/v1/users', userApp);
    app.use('/api/v1/restaurants', restaurantApp);
    app.use('/api/v1/menu', menuApp);
    app.use('/api/v1/orders', orderApp);
    app.use('/api/v1/payments', paymentApp);
    app.use('/api/v1/delivery', deliveryApp);
    app.use('/api/v1/notifications', notificationApp);

    // Also mount with /api prefix for frontend compatibility
    app.use('/api/auth', authApp);
    app.use('/api/users', userApp);
    app.use('/api/restaurants', restaurantApp);
    app.use('/api/menu', menuApp);
    app.use('/api/orders', orderApp);
    app.use('/api/payments', paymentApp);
    app.use('/api/delivery', deliveryApp);
    app.use('/api/notifications', notificationApp);

    console.log('✅ All services loaded');

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Unified server listening on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log('📡 Services mounted:');
      console.log('  - /api/v1/auth');
      console.log('  - /api/v1/users');
      console.log('  - /api/v1/restaurants');
      console.log('  - /api/v1/menu');
      console.log('  - /api/v1/orders');
      console.log('  - /api/v1/payments');
      console.log('  - /api/v1/delivery');
      console.log('  - /api/v1/notifications');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
