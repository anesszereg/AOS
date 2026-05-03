#!/bin/bash

BASE_URL="https://food-delevery-app-g73l.onrender.com"

echo "🌱 Creating test users..."
echo "=========================="
echo ""

# Customer 1
echo "1️⃣  Creating customer1@test.com..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"Test123456!","role":"customer"}')

if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "   ✅ Customer 1 created"
else
  echo "   ⚠️  $(echo $RESPONSE | jq -r '.error.message // "Already exists or error"')"
fi

# Customer 2
echo "2️⃣  Creating customer2@test.com..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer2@test.com","password":"Test123456!","role":"customer"}')

if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "   ✅ Customer 2 created"
else
  echo "   ⚠️  $(echo $RESPONSE | jq -r '.error.message // "Already exists or error"')"
fi

# Customer 3
echo "3️⃣  Creating customer3@test.com..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer3@test.com","password":"Test123456!","role":"customer"}')

if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "   ✅ Customer 3 created"
else
  echo "   ⚠️  $(echo $RESPONSE | jq -r '.error.message // "Already exists or error"')"
fi

# Driver 1
echo "4️⃣  Creating driver1@test.com..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"driver1@test.com","password":"Test123456!","role":"driver"}')

if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "   ✅ Driver 1 created"
else
  echo "   ⚠️  $(echo $RESPONSE | jq -r '.error.message // "Already exists or error"')"
fi

# Driver 2
echo "5️⃣  Creating driver2@test.com..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"driver2@test.com","password":"Test123456!","role":"driver"}')

if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "   ✅ Driver 2 created"
else
  echo "   ⚠️  $(echo $RESPONSE | jq -r '.error.message // "Already exists or error"')"
fi

# Admin
echo "6️⃣  Creating admin@test.com..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123456!","role":"admin"}')

if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "   ✅ Admin created"
else
  echo "   ⚠️  $(echo $RESPONSE | jq -r '.error.message // "Already exists or error"')"
fi

echo ""
echo "=========================="
echo "🎉 Test users creation complete!"
echo ""
echo "📝 Test Credentials (password: Test123456!):"
echo "   - customer1@test.com (Customer)"
echo "   - customer2@test.com (Customer)"
echo "   - customer3@test.com (Customer)"
echo "   - driver1@test.com (Driver)"
echo "   - driver2@test.com (Driver)"
echo "   - admin@test.com (Admin)"
echo ""
echo "   - owner@restaurant.com (Restaurant Owner - password: SecurePass123!)"
echo ""
