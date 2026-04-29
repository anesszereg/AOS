#!/bin/bash

echo "🚀 Starting all microservices..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to start a service
start_service() {
  local service_name=$1
  local port=$2
  
  echo -e "${BLUE}Starting $service_name on port $port...${NC}"
  cd "services/$service_name"
  npm run dev > "../../logs/$service_name.log" 2>&1 &
  echo $! > "../../logs/$service_name.pid"
  cd ../..
  echo -e "${GREEN}✅ $service_name started (PID: $(cat logs/$service_name.pid))${NC}"
}

# Create logs directory
mkdir -p logs

# Start all backend services
start_service "auth-service" "3001"
sleep 2
start_service "user-service" "3002"
sleep 2
start_service "restaurant-service" "3003"
sleep 2
start_service "menu-service" "3004"
sleep 2
start_service "order-service" "3005"
sleep 2
start_service "payment-service" "3006"
sleep 2
start_service "delivery-service" "3007"
sleep 2
start_service "notification-service" "3008"
sleep 2

# Start frontend
echo -e "${BLUE}Starting React Frontend on port 3000...${NC}"
cd frontend/food-delivery-app
npm run dev > ../../logs/frontend.log 2>&1 &
echo $! > ../../logs/frontend.pid
cd ../..
echo -e "${GREEN}✅ Frontend started (PID: $(cat logs/frontend.pid))${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All services started successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Service Status:"
echo "  • Auth Service:         http://localhost:3001"
echo "  • User Service:         http://localhost:3002"
echo "  • Restaurant Service:   http://localhost:3003"
echo "  • Menu Service:         http://localhost:3004"
echo "  • Order Service:        http://localhost:3005"
echo "  • Payment Service:      http://localhost:3006"
echo "  • Delivery Service:     http://localhost:3007"
echo "  • Notification Service: http://localhost:3008"
echo "  • Frontend:             http://localhost:3000"
echo ""
echo "📝 Logs are being written to: ./logs/"
echo ""
echo "To stop all services, run: ./stop-all-services.sh"
echo "To view logs: tail -f logs/[service-name].log"
echo ""
