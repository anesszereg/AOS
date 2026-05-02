#!/bin/bash

echo "🚀 Starting all microservices..."

# Start all services in background
cd services/auth-service && npm start &
cd services/user-service && npm start &
cd services/restaurant-service && npm start &
cd services/menu-service && npm start &
cd services/order-service && npm start &
cd services/payment-service && npm start &
cd services/delivery-service && npm start &
cd services/notification-service && npm start &

# Wait a bit for services to start
sleep 5

# Start API Gateway in foreground
echo "🌐 Starting API Gateway..."
cd ../.. && node server.js
