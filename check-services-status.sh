#!/bin/bash

echo "🔍 Checking all services status..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
  local name=$1
  local port=$2
  
  if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ $name (port $port) - Running${NC}"
  else
    echo -e "${RED}❌ $name (port $port) - Not responding${NC}"
  fi
}

echo "Backend Services:"
check_service "Auth Service      " 3001
check_service "User Service      " 3002
check_service "Restaurant Service" 3003
check_service "Menu Service      " 3004
check_service "Order Service     " 3005
check_service "Payment Service   " 3006
check_service "Delivery Service  " 3007
check_service "Notification Svc  " 3008

echo ""
echo "Frontend:"
if curl -s "http://localhost:3000" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ React Frontend (port 3000) - Running${NC}"
else
  echo -e "${RED}❌ React Frontend (port 3000) - Not responding${NC}"
fi

echo ""
echo "Database:"
if psql -U mac -d postgres -c "SELECT 1" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ PostgreSQL - Running${NC}"
  echo ""
  echo "Databases:"
  psql -U mac -d postgres -c "SELECT datname FROM pg_database WHERE datname LIKE '%_db' OR datname = 'postgres'" -t | grep -v "^$"
else
  echo -e "${RED}❌ PostgreSQL - Not running${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Process Count:"
echo "  Node processes: $(ps aux | grep "node" | grep -v grep | wc -l | xargs)"
echo "  Service processes: $(ps aux | grep "ts-node-dev" | grep -v grep | wc -l | xargs)"
echo ""
