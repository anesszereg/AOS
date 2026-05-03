const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'websocket-server' }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store connected users
const connectedUsers = new Map();
const driverLocations = new Map();

// Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  
  if (!token) {
    return next(new Error('Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.sub || decoded.userId;
    socket.userRole = decoded.role;
    socket.userEmail = decoded.email;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// Connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId} (${socket.userRole})`);
  
  // Store user connection
  connectedUsers.set(socket.userId, {
    socketId: socket.id,
    role: socket.userRole,
    email: socket.userEmail,
    connectedAt: new Date()
  });

  // Join user-specific room
  socket.join(`user:${socket.userId}`);
  
  // Join role-specific room
  socket.join(`role:${socket.userRole}`);

  // Send connection confirmation
  socket.emit('connected', {
    userId: socket.userId,
    role: socket.userRole,
    message: 'Connected to WebSocket server'
  });

  // Handle order updates
  socket.on('order:update', (data) => {
    console.log('Order update:', data);
    
    // Notify customer
    if (data.customerId) {
      io.to(`user:${data.customerId}`).emit('order:status', {
        orderId: data.orderId,
        status: data.status,
        message: data.message,
        timestamp: new Date()
      });
    }

    // Notify restaurant
    if (data.restaurantId) {
      io.to(`user:${data.restaurantId}`).emit('order:new', {
        orderId: data.orderId,
        items: data.items,
        customer: data.customer,
        timestamp: new Date()
      });
    }

    // Notify driver
    if (data.driverId) {
      io.to(`user:${data.driverId}`).emit('delivery:assigned', {
        orderId: data.orderId,
        pickupAddress: data.pickupAddress,
        deliveryAddress: data.deliveryAddress,
        timestamp: new Date()
      });
    }
  });

  // Handle driver location updates
  socket.on('driver:location', (data) => {
    if (socket.userRole !== 'driver') {
      return socket.emit('error', { message: 'Only drivers can update location' });
    }

    const location = {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date()
    };

    driverLocations.set(socket.userId, location);

    // Notify customers tracking this driver
    if (data.orderId) {
      io.to(`order:${data.orderId}`).emit('driver:location:update', {
        driverId: socket.userId,
        location: location
      });
    }

    console.log(`Driver ${socket.userId} location updated:`, location);
  });

  // Handle order tracking
  socket.on('order:track', (data) => {
    const { orderId } = data;
    socket.join(`order:${orderId}`);
    
    // Send current driver location if available
    const driver = driverLocations.get(data.driverId);
    if (driver) {
      socket.emit('driver:location:update', {
        driverId: data.driverId,
        location: driver
      });
    }
  });

  // Handle notifications
  socket.on('notification:send', (data) => {
    if (data.userId) {
      io.to(`user:${data.userId}`).emit('notification', {
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date()
      });
    }
  });

  // Handle driver status
  socket.on('driver:status', (data) => {
    if (socket.userRole !== 'driver') {
      return socket.emit('error', { message: 'Only drivers can update status' });
    }

    // Broadcast to all restaurants
    io.to('role:restaurant').emit('driver:available', {
      driverId: socket.userId,
      status: data.status,
      location: data.location
    });
  });

  // Handle typing indicators (for chat)
  socket.on('chat:typing', (data) => {
    if (data.recipientId) {
      io.to(`user:${data.recipientId}`).emit('chat:typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    }
  });

  // Handle chat messages
  socket.on('chat:message', (data) => {
    if (data.recipientId) {
      io.to(`user:${data.recipientId}`).emit('chat:message', {
        senderId: socket.userId,
        message: data.message,
        timestamp: new Date()
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
    
    if (socket.userRole === 'driver') {
      driverLocations.delete(socket.userId);
      
      // Notify restaurants that driver is offline
      io.to('role:restaurant').emit('driver:offline', {
        driverId: socket.userId
      });
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Broadcast system messages
setInterval(() => {
  const stats = {
    connectedUsers: connectedUsers.size,
    activeDrivers: Array.from(connectedUsers.values()).filter(u => u.role === 'driver').length,
    timestamp: new Date()
  };
  
  io.emit('system:stats', stats);
}, 30000); // Every 30 seconds

// Start server
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  io.close(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  io.close(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});
