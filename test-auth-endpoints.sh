#!/bin/bash

echo "🧪 Testing Auth Service Endpoints"
echo "=================================="
echo ""

BASE_URL="https://food-delevery-app-g73l.onrender.com"

# Test 1: Health Check
echo "1. Testing API Gateway Health..."
curl -s "$BASE_URL/health" | jq .
echo ""

# Test 2: Auth Service Health
echo "2. Testing Auth Service Health..."
curl -s "$BASE_URL/api/auth/health" | jq .
echo ""

# Test 3: Register New User
echo "3. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser'$(date +%s)'@example.com",
    "password": "SecurePass123!",
    "role": "customer",
    "name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | jq .

# Extract user ID and check if registration was successful
if echo "$REGISTER_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo "✅ Registration successful!"
  USER_EMAIL=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.email')
  echo "   Email: $USER_EMAIL"
else
  echo "❌ Registration failed!"
  echo "$REGISTER_RESPONSE" | jq .
  exit 1
fi

echo ""

# Test 4: Login
echo "4. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$USER_EMAIL"'",
    "password": "SecurePass123!"
  }')

echo "$LOGIN_RESPONSE" | jq .

# Extract token
if echo "$LOGIN_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo "✅ Login successful!"
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
  echo "   Token: ${TOKEN:0:50}..."
else
  echo "❌ Login failed!"
  exit 1
fi

echo ""

# Test 5: Verify Token
echo "5. Testing Token Verification..."
VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/verify" \
  -H "Authorization: Bearer $TOKEN")

echo "$VERIFY_RESPONSE" | jq .

if echo "$VERIFY_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo "✅ Token verification successful!"
else
  echo "❌ Token verification failed!"
fi

echo ""
echo "=================================="
echo "✅ All Auth Tests Complete!"
echo "=================================="
