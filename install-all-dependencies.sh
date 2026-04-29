#!/bin/bash

echo "📦 Installing dependencies for all services..."
echo ""

services=(
  "restaurant-service"
  "menu-service"
  "order-service"
  "payment-service"
  "delivery-service"
  "notification-service"
)

for service in "${services[@]}"; do
  echo "📦 Installing dependencies for $service..."
  cd "services/$service"
  npm install --silent
  cd ../..
  echo "  ✅ Done"
done

echo ""
echo "✅ All dependencies installed!"
