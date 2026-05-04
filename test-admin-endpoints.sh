#!/bin/bash

# Admin Endpoints Testing Script
# This tests all implemented admin endpoints

BASE_URL="https://food-delevery-app-g73l.onrender.com"

echo "🧪 Testing Admin Endpoints"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# First, we need to login as admin to get a token
echo "📝 Step 1: Login as Admin"
echo "-------------------------"

# You need to replace these with actual admin credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

echo "Attempting login with: $ADMIN_EMAIL"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extract token (assuming it's in .data.accessToken or .accessToken)
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // .accessToken // empty' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo -e "${RED}❌ Failed to get admin token. Please create an admin account first.${NC}"
  echo ""
  echo "To create an admin account, register with role 'admin':"
  echo "curl -X POST $BASE_URL/api/auth/register \\"
  echo "  -H 'Content-Type: application/json' \\"
  echo "  -d '{\"email\":\"admin@example.com\",\"password\":\"admin123\",\"role\":\"admin\",\"name\":\"Admin User\"}'"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Login successful! Token obtained.${NC}"
echo "Token: ${TOKEN:0:50}..."
echo ""
echo ""

# Test 1: Get All Users
echo "📋 Test 1: GET /api/admin/users"
echo "-------------------------------"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo -e "${GREEN}✅ Request successful${NC}"
  echo "Response:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}❌ Request failed${NC}"
fi
echo ""
echo ""

# Test 2: Get Users by Role
echo "📋 Test 2: GET /api/admin/users?role=customer"
echo "---------------------------------------------"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/users?role=customer" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo -e "${GREEN}✅ Request successful${NC}"
  echo "Response:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}❌ Request failed${NC}"
fi
echo ""
echo ""

# Test 3: Get Platform Stats
echo "📊 Test 3: GET /api/admin/stats"
echo "-------------------------------"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo -e "${GREEN}✅ Request successful${NC}"
  echo "Response:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}❌ Request failed${NC}"
fi
echo ""
echo ""

# Test 4: Get Pending Restaurants
echo "🍽️  Test 4: GET /api/admin/restaurants/pending"
echo "----------------------------------------------"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/restaurants/pending" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo -e "${GREEN}✅ Request successful${NC}"
  echo "Response:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}❌ Request failed${NC}"
fi
echo ""
echo ""

# Test 5: Update User Status (requires a user ID)
echo "⚠️  Test 5: PATCH /api/admin/users/:id/status"
echo "--------------------------------------------"
echo -e "${YELLOW}Skipping - requires valid user ID${NC}"
echo "Example command:"
echo "curl -X PATCH $BASE_URL/api/admin/users/USER_ID/status \\"
echo "  -H 'Authorization: Bearer TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"status\":\"suspended\"}'"
echo ""
echo ""

# Test 6: Approve Restaurant (requires a restaurant ID)
echo "⚠️  Test 6: PATCH /api/admin/restaurants/:id/approve"
echo "---------------------------------------------------"
echo -e "${YELLOW}Skipping - requires valid restaurant ID${NC}"
echo "Example command:"
echo "curl -X PATCH $BASE_URL/api/admin/restaurants/RESTAURANT_ID/approve \\"
echo "  -H 'Authorization: Bearer TOKEN' \\"
echo "  -H 'Content-Type: application/json'"
echo ""
echo ""

# Test 7: Reject Restaurant (requires a restaurant ID)
echo "⚠️  Test 7: PATCH /api/admin/restaurants/:id/reject"
echo "--------------------------------------------------"
echo -e "${YELLOW}Skipping - requires valid restaurant ID${NC}"
echo "Example command:"
echo "curl -X PATCH $BASE_URL/api/admin/restaurants/RESTAURANT_ID/reject \\"
echo "  -H 'Authorization: Bearer TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"reason\":\"Incomplete information\"}'"
echo ""
echo ""

echo "=========================="
echo "✅ Testing Complete!"
echo "=========================="
echo ""
echo "Summary:"
echo "- Tested 4 GET endpoints"
echo "- Skipped 3 PATCH endpoints (require IDs)"
echo ""
echo "To test PATCH endpoints:"
echo "1. Get a user ID from /api/admin/users"
echo "2. Get a restaurant ID from /api/admin/restaurants/pending"
echo "3. Use the example commands above with real IDs"
