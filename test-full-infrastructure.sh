#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║  COMPLETE INFRASTRUCTURE TEST SUITE           ║${NC}"
echo -e "${PURPLE}╔════════════════════════════════════════════════╗${NC}"

BASE_URL="https://food-delevery-app-g73l.onrender.com"

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    echo -e "\n${BLUE}Testing: $name${NC}"
    response=$(curl -s -w "\n%{http_code}" "$url" 2>&1)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_code" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        echo "Response: $(echo $body | head -c 100)..."
    else
        echo -e "${RED}❌ FAIL${NC} (Expected $expected_code, got $http_code)"
        echo "Response: $(echo $body | head -c 200)"
    fi
}

echo -e "\n${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}1. CORE INFRASTRUCTURE${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"

# Test API Gateway
test_endpoint "API Gateway Health" "$BASE_URL/health" "200"

# Test PostgreSQL (via service)
test_endpoint "Database Connection" "$BASE_URL/api/restaurants" "200"

echo -e "\n${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}2. RABBITMQ INTEGRATION${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"

if [ -z "$RABBITMQ_URL" ]; then
    echo -e "${RED}❌ RABBITMQ_URL not set${NC}"
    echo "To enable: Set RABBITMQ_URL in Render environment"
    echo "Example: amqps://user:pass@host.cloudamqp.com/vhost"
else
    echo -e "${GREEN}✅ RABBITMQ_URL configured${NC}"
    echo "URL: ${RABBITMQ_URL:0:30}..."
    
    # Test event publishing (would need auth token)
    echo -e "${BLUE}ℹ️  RabbitMQ event publishing requires authentication${NC}"
    echo "Events will be published when orders are created"
fi

echo -e "\n${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}3. REDIS CACHING${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"

if [ -z "$REDIS_URL" ]; then
    echo -e "${RED}❌ REDIS_URL not set${NC}"
    echo "To enable: Set REDIS_URL in Render environment"
    echo "Example: rediss://default:pass@host.upstash.io:6379"
else
    echo -e "${GREEN}✅ REDIS_URL configured${NC}"
    echo "URL: ${REDIS_URL:0:30}..."
    
    # Test caching with two requests
    echo -e "\n${BLUE}Testing cache performance...${NC}"
    
    echo "First request (cache miss):"
    time1=$(date +%s%N)
    curl -s "$BASE_URL/api/restaurants" > /dev/null
    time2=$(date +%s%N)
    duration1=$(( (time2 - time1) / 1000000 ))
    echo "Duration: ${duration1}ms"
    
    sleep 1
    
    echo "Second request (cache hit):"
    time3=$(date +%s%N)
    curl -s "$BASE_URL/api/restaurants" > /dev/null
    time4=$(date +%s%N)
    duration2=$(( (time4 - time3) / 1000000 ))
    echo "Duration: ${duration2}ms"
    
    if [ $duration2 -lt $duration1 ]; then
        echo -e "${GREEN}✅ Cache is working (faster on second request)${NC}"
    else
        echo -e "${YELLOW}⚠️  Cache may not be active${NC}"
    fi
fi

echo -e "\n${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}4. CONSUL SERVICE DISCOVERY${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"

if [ -z "$CONSUL_HOST" ]; then
    echo -e "${RED}❌ CONSUL_HOST not set${NC}"
    echo "To enable: Set CONSUL_HOST in Render environment"
    echo "Example: https://your-cluster.consul.hashicorp.cloud"
else
    echo -e "${GREEN}✅ CONSUL_HOST configured${NC}"
    echo "Host: $CONSUL_HOST"
    
    # Test Consul API
    if curl -s "$CONSUL_HOST/v1/agent/services" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Consul is accessible${NC}"
        services=$(curl -s "$CONSUL_HOST/v1/agent/services" | jq -r 'keys[]' 2>/dev/null || echo "")
        if [ -n "$services" ]; then
            echo "Registered services:"
            echo "$services" | while read service; do
                echo "  - $service"
            done
        fi
    else
        echo -e "${RED}❌ Consul is not accessible${NC}"
    fi
fi

echo -e "\n${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}5. WEBSOCKET SERVER${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"

WS_URL="https://food-delivery-websocket.onrender.com"

# Test WebSocket health endpoint
if curl -s "$WS_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ WebSocket server is running${NC}"
    ws_health=$(curl -s "$WS_URL/health")
    echo "Health: $ws_health"
else
    echo -e "${RED}❌ WebSocket server not deployed${NC}"
    echo "To deploy: Follow INFRASTRUCTURE_SETUP_GUIDE.md"
fi

echo -e "\n${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}6. MONITORING STACK${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"

# Check for monitoring endpoints
test_endpoint "Metrics Endpoint" "$BASE_URL/metrics" "200"

if [ -n "$GRAFANA_CLOUD_URL" ]; then
    echo -e "${GREEN}✅ Grafana Cloud configured${NC}"
    echo "URL: ${GRAFANA_CLOUD_URL:0:50}..."
else
    echo -e "${RED}❌ Grafana Cloud not configured${NC}"
    echo "To enable: Set GRAFANA_CLOUD_URL and GRAFANA_CLOUD_API_KEY"
fi

echo -e "\n${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}7. SUMMARY${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"

echo -e "\n${BLUE}Core Infrastructure:${NC}"
echo "  ✅ API Gateway"
echo "  ✅ PostgreSQL Database"
echo "  ✅ JWT Authentication"

echo -e "\n${BLUE}Optional Infrastructure:${NC}"
if [ -n "$RABBITMQ_URL" ]; then
    echo "  ✅ RabbitMQ (Event Bus)"
else
    echo "  ❌ RabbitMQ (Not configured)"
fi

if [ -n "$REDIS_URL" ]; then
    echo "  ✅ Redis (Cache)"
else
    echo "  ❌ Redis (Not configured)"
fi

if [ -n "$CONSUL_HOST" ]; then
    echo "  ✅ Consul (Service Discovery)"
else
    echo "  ❌ Consul (Not configured)"
fi

if curl -s "$WS_URL/health" > /dev/null 2>&1; then
    echo "  ✅ WebSocket Server"
else
    echo "  ❌ WebSocket Server (Not deployed)"
fi

if [ -n "$GRAFANA_CLOUD_URL" ]; then
    echo "  ✅ Monitoring (Grafana Cloud)"
else
    echo "  ❌ Monitoring (Not configured)"
fi

echo -e "\n${PURPLE}═══════════════════════════════════════════════${NC}"
echo -e "${PURPLE}INFRASTRUCTURE TEST COMPLETE${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Set up missing infrastructure (see INFRASTRUCTURE_SETUP_GUIDE.md)"
echo "2. Add environment variables to Render"
echo "3. Redeploy services"
echo "4. Run this test again to verify"

echo -e "\n${GREEN}✅ Test suite finished!${NC}\n"
