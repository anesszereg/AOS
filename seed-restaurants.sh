#!/bin/bash

echo "🌱 Seeding Restaurant Data"
echo "=========================="
echo ""

BASE_URL="https://food-delevery-app-g73l.onrender.com"

# First, register a restaurant owner
echo "1️⃣  Creating restaurant owner account..."
OWNER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@restaurant.com",
    "password": "SecurePass123!",
    "role": "restaurant"
  }')

TOKEN=$(echo "$OWNER_RESPONSE" | jq -r '.data.tokens.accessToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to create owner account"
  echo "$OWNER_RESPONSE" | jq .
  exit 1
fi

echo "✅ Owner account created"
echo ""

# Create restaurants
echo "2️⃣  Creating restaurants..."

RESTAURANTS=(
  '{"name":"Luigis Pizzeria","cuisine":"Italian","address":"123 Main St","phone":"555-0101","description":"Authentic Italian pizza and pasta","deliveryFee":3.99,"estimatedDeliveryTime":"30-45 min"}'
  '{"name":"Sushi Palace","cuisine":"Japanese","address":"456 Oak Ave","phone":"555-0102","description":"Fresh sushi and Japanese cuisine","deliveryFee":4.99,"estimatedDeliveryTime":"40-50 min"}'
  '{"name":"Burger House","cuisine":"American","address":"789 Elm St","phone":"555-0103","description":"Gourmet burgers and fries","deliveryFee":2.99,"estimatedDeliveryTime":"25-35 min"}'
  '{"name":"Taco Fiesta","cuisine":"Mexican","address":"321 Pine Rd","phone":"555-0104","description":"Authentic Mexican tacos and burritos","deliveryFee":3.49,"estimatedDeliveryTime":"30-40 min"}'
  '{"name":"Dragon Wok","cuisine":"Chinese","address":"654 Maple Dr","phone":"555-0105","description":"Traditional Chinese dishes","deliveryFee":3.99,"estimatedDeliveryTime":"35-45 min"}'
)

for restaurant in "${RESTAURANTS[@]}"; do
  NAME=$(echo "$restaurant" | jq -r '.name')
  echo "   Creating: $NAME..."
  
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/restaurants" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$restaurant")
  
  if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo "   ✅ $NAME created"
  else
    echo "   ⚠️  $NAME: $(echo $RESPONSE | jq -r '.error.message // "Unknown error"')"
  fi
done

echo ""
echo "3️⃣  Verifying restaurants..."
RESTAURANTS_LIST=$(curl -s "$BASE_URL/api/restaurants")
COUNT=$(echo "$RESTAURANTS_LIST" | jq '. | length' 2>/dev/null || echo "0")

echo "✅ Total restaurants: $COUNT"
echo ""
echo "=========================="
echo "🎉 Seeding complete!"
