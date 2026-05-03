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
// Each service runs on separate Render instance
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3003';
const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL || 'http://localhost:3004';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3005';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3007';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008';

console.log('🔗 Service URLs:', {
  auth: AUTH_SERVICE_URL,
  user: USER_SERVICE_URL,
  restaurant: RESTAURANT_SERVICE_URL,
  menu: MENU_SERVICE_URL,
  order: ORDER_SERVICE_URL,
  payment: PAYMENT_SERVICE_URL,
  delivery: DELIVERY_SERVICE_URL,
  notification: NOTIFICATION_SERVICE_URL
});

// Rewrite /api/auth/* to /api/v1/auth/* and proxy to auth service
app.use('/api/auth', createProxyMiddleware({ 
  target: AUTH_SERVICE_URL,
  changeOrigin: false,  // Don't change origin - we're proxying to localhost
  pathRewrite: { '^/api/auth': '/api/v1/auth' },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} → ${AUTH_SERVICE_URL}${proxyReq.path}`);
    // Ensure we're using the correct host header
    proxyReq.setHeader('Host', 'localhost:3001');
  },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/auth:', err.message);
    console.error('Full error:', err);
    res.status(502).json({ error: 'Service unavailable', details: err.message });
  }
}));

app.use('/api/users', createProxyMiddleware({ 
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/v1/users' },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/users:', err.message);
    res.status(502).json({ error: 'Service unavailable' });
  }
}));

app.use('/api/restaurants', createProxyMiddleware({ 
  target: RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/restaurants': '/api/v1/restaurants' },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/restaurants:', err.message);
    res.status(502).json({ error: 'Service unavailable' });
  }
}));

app.use('/api/menu', createProxyMiddleware({ 
  target: MENU_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/menu': '/api/v1/menu' },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/menu:', err.message);
    res.status(502).json({ error: 'Service unavailable' });
  }
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '/api/v1/orders' },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/orders:', err.message);
    res.status(502).json({ error: 'Service unavailable' });
  }
}));

app.use('/api/payments', createProxyMiddleware({ 
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '/api/v1/payments' },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/payments:', err.message);
    res.status(502).json({ error: 'Service unavailable' });
  }
}));

app.use('/api/delivery', createProxyMiddleware({ 
  target: DELIVERY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/delivery': '/api/v1/delivery' },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/delivery:', err.message);
    res.status(502).json({ error: 'Service unavailable' });
  }
}));

app.use('/api/notifications', createProxyMiddleware({ 
  target: NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '/api/v1/notifications' },
  onError: (err, req, res) => {
    console.error('Proxy error for /api/notifications:', err.message);
    res.status(502).json({ error: 'Service unavailable' });
  }
}));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
