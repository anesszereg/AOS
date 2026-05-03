#!/bin/bash

BASE_URL="https://food-delevery-app-g73l.onrender.com"

echo "🔍 Checking All Services Status"
echo "================================"
echo ""

# API Gateway
echo "1️⃣  API Gateway:"
GATEWAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$GATEWAY_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $GATEWAY_STATUS)"
else
  echo "   ❌ Down (HTTP $GATEWAY_STATUS)"
fi

# Auth Service
echo "2️⃣  Auth Service:"
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/auth/health")
if [ "$AUTH_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $AUTH_STATUS)"
  # Test register endpoint
  REGISTER_TEST=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"Test123456!","role":"customer"}')
  
  if echo "$REGISTER_TEST" | grep -q "success.*true\|REGISTRATION_ERROR\|VALIDATION_ERROR"; then
    echo "   ✅ Register endpoint working"
  else
    echo "   ❌ Register endpoint: $(echo $REGISTER_TEST | jq -r '.error.message // "Unknown error"')"
  fi
else
  echo "   ❌ Down (HTTP $AUTH_STATUS)"
fi

# User Service
echo "3️⃣  User Service:"
USER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/users/health")
if [ "$USER_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $USER_STATUS)"
else
  echo "   ⚠️  Status: HTTP $USER_STATUS"
fi

# Restaurant Service
echo "4️⃣  Restaurant Service:"
REST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/restaurants/health")
if [ "$REST_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $REST_STATUS)"
else
  echo "   ⚠️  Status: HTTP $REST_STATUS"
fi

# Menu Service
echo "5️⃣  Menu Service:"
MENU_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/menu/health")
if [ "$MENU_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $MENU_STATUS)"
else
  echo "   ⚠️  Status: HTTP $MENU_STATUS"
fi

# Order Service
echo "6️⃣  Order Service:"
ORDER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/orders/health")
if [ "$ORDER_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $ORDER_STATUS)"
else
  echo "   ⚠️  Status: HTTP $ORDER_STATUS"
fi

# Payment Service
echo "7️⃣  Payment Service:"
PAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/payments/health")
if [ "$PAY_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $PAY_STATUS)"
else
  echo "   ⚠️  Status: HTTP $PAY_STATUS"
fi

# Delivery Service
echo "8️⃣  Delivery Service:"
DEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/deliveries/health")
if [ "$DEL_STATUS" = "200" ]; then
  echo "   ✅ Running (HTTP $DEL_STATUS)"
else
  echo "   ⚠️  Status: HTTP $DEL_STATUS"
fi

echo ""
echo "================================"
echo "Summary:"
TOTAL=8
RUNNING=0
[ "$GATEWAY_STATUS" = "200" ] && ((RUNNING++))
[ "$AUTH_STATUS" = "200" ] && ((RUNNING++))
[ "$USER_STATUS" = "200" ] && ((RUNNING++))
[ "$REST_STATUS" = "200" ] && ((RUNNING++))
[ "$MENU_STATUS" = "200" ] && ((RUNNING++))
[ "$ORDER_STATUS" = "200" ] && ((RUNNING++))
[ "$PAY_STATUS" = "200" ] && ((RUNNING++))
[ "$DEL_STATUS" = "200" ] && ((RUNNING++))

echo "✅ $RUNNING/$TOTAL services running"
echo ""
