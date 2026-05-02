const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS configuration - Allow all origins for now
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy routes to microservices
// Use environment variables for service URLs (Render deployment) or localhost (local dev)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3003';
const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL || 'http://localhost:3004';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3005';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3007';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008';

// Rewrite /api/auth/* to /api/v1/auth/*
app.use('/api/auth', createProxyMiddleware({ 
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/v1/auth' }
}));

app.use('/api/users', createProxyMiddleware({ 
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/v1/users' }
}));

app.use('/api/restaurants', createProxyMiddleware({ 
  target: RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/restaurants': '/api/v1/restaurants' }
}));

app.use('/api/menu', createProxyMiddleware({ 
  target: MENU_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/menu': '/api/v1/menu' }
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '/api/v1/orders' }
}));

app.use('/api/payments', createProxyMiddleware({ 
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '/api/v1/payments' }
}));

app.use('/api/delivery', createProxyMiddleware({ 
  target: DELIVERY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/delivery': '/api/v1/delivery' }
}));

app.use('/api/notifications', createProxyMiddleware({ 
  target: NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '/api/v1/notifications' }
}));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
