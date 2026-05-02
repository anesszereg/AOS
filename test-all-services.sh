#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="https://food-delevery-app-g73l.onrender.com"

echo "🧪 Testing All Services..."
echo "================================"

# Test API Gateway
echo -e "\n${YELLOW}1. API Gateway${NC}"
response=$(curl -s "$BASE_URL/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test Auth Service
echo -e "\n${YELLOW}2. Auth Service${NC}"
response=$(curl -s "$BASE_URL/api/auth/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test User Service
echo -e "\n${YELLOW}3. User Service${NC}"
response=$(curl -s "$BASE_URL/api/users/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test Restaurant Service
echo -e "\n${YELLOW}4. Restaurant Service${NC}"
response=$(curl -s "$BASE_URL/api/restaurants/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test Menu Service
echo -e "\n${YELLOW}5. Menu Service${NC}"
response=$(curl -s "$BASE_URL/api/menu/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test Order Service
echo -e "\n${YELLOW}6. Order Service${NC}"
response=$(curl -s "$BASE_URL/api/orders/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test Payment Service
echo -e "\n${YELLOW}7. Payment Service${NC}"
response=$(curl -s "$BASE_URL/api/payments/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test Delivery Service
echo -e "\n${YELLOW}8. Delivery Service${NC}"
response=$(curl -s "$BASE_URL/api/delivery/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test Notification Service
echo -e "\n${YELLOW}9. Notification Service${NC}"
response=$(curl -s "$BASE_URL/api/notifications/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $response"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

echo -e "\n================================"
echo "✅ Testing Complete!"
