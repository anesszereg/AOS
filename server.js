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
// Rewrite /api/auth/* to /api/v1/auth/*
app.use('/api/auth', createProxyMiddleware({ 
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/v1/auth' }
}));

app.use('/api/users', createProxyMiddleware({ 
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/v1/users' }
}));

app.use('/api/restaurants', createProxyMiddleware({ 
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/restaurants': '/api/v1/restaurants' }
}));

app.use('/api/menu', createProxyMiddleware({ 
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/menu': '/api/v1/menu' }
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: 'http://localhost:3005',
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '/api/v1/orders' }
}));

app.use('/api/payments', createProxyMiddleware({ 
  target: 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '/api/v1/payments' }
}));

app.use('/api/delivery', createProxyMiddleware({ 
  target: 'http://localhost:3007',
  changeOrigin: true,
  pathRewrite: { '^/api/delivery': '/api/v1/delivery' }
}));

app.use('/api/notifications', createProxyMiddleware({ 
  target: 'http://localhost:3008',
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '/api/v1/notifications' }
}));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
