#!/bin/bash

echo "🔍 Testing All Services..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test function
test_service() {
    local name=$1
    local url=$2
    
    if curl -s --max-time 2 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name - Working${NC}"
        return 0
    else
        echo -e "${RED}❌ $name - Not responding${NC}"
        return 1
    fi
}

# Test API
echo "📡 Testing API Services:"
test_service "Health Check" "http://localhost:3000/health"
test_service "Restaurants API" "http://localhost:3000/api/restaurants"

echo ""
echo "🎛️ Testing Infrastructure:"
test_service "Consul UI" "http://localhost:8500"
test_service "Traefik Dashboard" "http://localhost:8080"
test_service "RabbitMQ UI" "http://localhost:15672"
test_service "Prometheus" "http://localhost:9090"
test_service "Grafana" "http://localhost:3001"

echo ""
echo "🗄️ Testing Database:"
if psql -h localhost -U postgres -d food_delivery -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL - Working${NC}"
else
    echo -e "${RED}❌ PostgreSQL - Not responding${NC}"
fi

echo ""
echo "📊 Summary:"
echo "Run this in your browser to test:"
echo "  • API: http://localhost:3000/health"
echo "  • Restaurants: http://localhost:3000/api/restaurants"
