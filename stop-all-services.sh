#!/bin/bash

echo "🛑 Stopping all microservices..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Function to stop a service
stop_service() {
  local service_name=$1
  
  if [ -f "logs/$service_name.pid" ]; then
    pid=$(cat "logs/$service_name.pid")
    if ps -p $pid > /dev/null 2>&1; then
      kill $pid
      echo -e "${GREEN}✅ Stopped $service_name (PID: $pid)${NC}"
    else
      echo -e "${RED}⚠️  $service_name was not running${NC}"
    fi
    rm "logs/$service_name.pid"
  else
    echo -e "${RED}⚠️  No PID file for $service_name${NC}"
  fi
}

# Stop all services
stop_service "auth-service"
stop_service "user-service"
stop_service "restaurant-service"
stop_service "menu-service"
stop_service "order-service"
stop_service "payment-service"
stop_service "delivery-service"
stop_service "notification-service"
stop_service "frontend"

echo ""
echo "✅ All services stopped!"
echo ""
