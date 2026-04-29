#!/bin/bash

# 🔍 Integration Verification Script
# This script verifies all components are working correctly

set -e

echo "🔍 Verifying Food Delivery Platform Integration..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
  local name=$1
  local url=$2
  local expected_code=${3:-200}
  
  echo -n "Testing $name... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" $url 2>/dev/null || echo "000")
  
  if [ "$response" = "$expected_code" ] || [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAIL (HTTP $response)${NC}"
    ((FAILED++))
  fi
}

echo "=== Infrastructure Tests ==="
echo ""

# PostgreSQL
echo -n "PostgreSQL... "
if docker exec food-delivery-postgres psql -U postgres -c "SELECT 1" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL${NC}"
  ((FAILED++))
fi

# RabbitMQ
test_endpoint "RabbitMQ Management" "http://localhost:15672"

# Consul
test_endpoint "Consul UI" "http://localhost:8500"

# Redis
echo -n "Redis... "
if docker exec food-delivery-redis redis-cli ping | grep -q "PONG"; then
  echo -e "${GREEN}✅ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL${NC}"
  ((FAILED++))
fi

# Traefik
test_endpoint "Traefik Dashboard" "http://localhost:8080"

echo ""
echo "=== Microservice Health Tests ==="
echo ""

test_endpoint "Auth Service" "http://localhost:3001/health"
test_endpoint "User Service" "http://localhost:3002/health"
test_endpoint "Restaurant Service" "http://localhost:3003/health"
test_endpoint "Menu Service" "http://localhost:3004/health"
test_endpoint "Order Service" "http://localhost:3005/health"
test_endpoint "Payment Service" "http://localhost:3006/health"
test_endpoint "Delivery Service" "http://localhost:3007/health"
test_endpoint "Notification Service" "http://localhost:3008/health"

echo ""
echo "=== API Endpoint Tests ==="
echo ""

# Test Auth Registration
echo -n "Auth Registration... "
response=$(curl -s -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-'$(date +%s)'@example.com",
    "password": "password123",
    "role": "customer"
  }' 2>/dev/null)

if echo "$response" | grep -q "token\|success\|id"; then
  echo -e "${GREEN}✅ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL${NC}"
  ((FAILED++))
fi

# Test Login
echo -n "Auth Login... "
response=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@example.com",
    "password": "password123"
  }' 2>/dev/null)

if echo "$response" | grep -q "token\|access"; then
  echo -e "${GREEN}✅ PASS${NC}"
  ((PASSED++))
  # Extract token for further tests
  TOKEN=$(echo "$response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4 || echo "")
else
  echo -e "${RED}❌ FAIL${NC}"
  ((FAILED++))
  TOKEN=""
fi

# Test Restaurants Endpoint
if [ -n "$TOKEN" ]; then
  test_endpoint "Get Restaurants" "http://localhost:3003/api/v1/restaurants" "200"
else
  echo -e "${YELLOW}⚠️  Skipping authenticated tests (no token)${NC}"
fi

echo ""
echo "=== Consul Service Discovery Tests ==="
echo ""

# Check services registered in Consul
echo -n "Checking Consul service catalog... "
services=$(curl -s http://localhost:8500/v1/catalog/services 2>/dev/null || echo "{}")

if echo "$services" | grep -q "auth-service\|user-service\|order-service"; then
  echo -e "${GREEN}✅ PASS (Services registered)${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING (Services may not be registered)${NC}"
  ((FAILED++))
fi

echo ""
echo "=== RabbitMQ Tests ==="
echo ""

# Check RabbitMQ queues
echo -n "Checking RabbitMQ queues... "
queues=$(curl -s -u admin:admin123 http://localhost:15672/api/queues 2>/dev/null || echo "[]")

if echo "$queues" | grep -q "order\|payment\|delivery"; then
  echo -e "${GREEN}✅ PASS (Queues exist)${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING (Queues may not be created yet)${NC}"
fi

echo ""
echo "=== Frontend Tests ==="
echo ""

test_endpoint "Frontend" "http://localhost:3000"

echo ""
echo "=== Summary ==="
echo ""
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed! Integration is successful!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some tests failed. Check the logs for details.${NC}"
  echo ""
  echo "Troubleshooting:"
  echo "  - Check service logs: docker compose logs SERVICE_NAME"
  echo "  - Verify all containers are running: docker compose ps"
  echo "  - Check health: docker compose ps | grep healthy"
  exit 1
fi
