#!/bin/bash

echo "🚀 Starting Food Delivery Platform - Local Development"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
  npm install
fi

# Build all services
echo -e "${GREEN}🔨 Building all microservices...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f "frontend/food-delivery-app/.env.local" ]; then
  echo -e "${YELLOW}📝 Creating frontend .env.local file...${NC}"
  echo "VITE_API_URL=http://localhost:3000/api" > frontend/food-delivery-app/.env.local
  echo -e "${GREEN}✅ Created .env.local${NC}"
fi

echo ""
echo "========================================================"
echo -e "${GREEN}🎯 Starting Local Development Server${NC}"
echo "========================================================"
echo ""
echo "📍 Backend will run on: http://localhost:3000"
echo "🌐 Frontend (Vercel): https://fooddelevryapp.vercel.app"
echo ""
echo "⚠️  Make sure your PostgreSQL database is running!"
echo "   Database URL should be set in environment variables"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================================"
echo ""

# Start the local server
node local-server.js
