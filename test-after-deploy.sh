#!/bin/bash


# Test 1: Register
echo "1️⃣  Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST https://food-delevery-app-g73l.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser'$(date +%s)'@example.com",
    "password": "SecurePass123!",
    "role": "customer"
  }')

echo "$REGISTER_RESPONSE" | jq .

if echo "$REGISTER_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "✅ Registration SUCCESSFUL!"
  USER_EMAIL=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.email')
  echo ""
  
  # Test 2: Login
  echo "2️⃣  Testing Login with registered user..."
  LOGIN_RESPONSE=$(curl -s -X POST https://food-delevery-app-g73l.onrender.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "'"$USER_EMAIL"'",
      "password": "SecurePass123!"
    }')
  
  echo "$LOGIN_RESPONSE" | jq .
  
  if echo "$LOGIN_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo "✅ Login SUCCESSFUL!"
    echo ""
    echo "🎉 ALL TESTS PASSED!"
  else
    echo "❌ Login failed"
  fi
else
  echo "❌ Registration failed"
  echo ""
  echo "Error details:"
  echo "$REGISTER_RESPONSE" | jq -r '.error.message // "Unknown error"'
fi

echo ""
echo "========================="
