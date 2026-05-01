const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy routes to microservices
app.use('/api/auth', createProxyMiddleware({ 
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

app.use('/api/users', createProxyMiddleware({ 
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/restaurants', createProxyMiddleware({ 
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/restaurants': '' }
}));

app.use('/api/menu', createProxyMiddleware({ 
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/menu': '' }
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: 'http://localhost:3005',
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' }
}));

app.use('/api/payments', createProxyMiddleware({ 
  target: 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '' }
}));

app.use('/api/delivery', createProxyMiddleware({ 
  target: 'http://localhost:3007',
  changeOrigin: true,
  pathRewrite: { '^/api/delivery': '' }
}));

app.use('/api/notifications', createProxyMiddleware({ 
  target: 'http://localhost:3008',
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '' }
}));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
