#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="https://food-delevery-app-g73l.onrender.com"
FRONTEND_URL="https://fooddelevryapp.vercel.app"

echo "🧪 COMPLETE API TESTING - ALL ENDPOINTS"
echo "========================================"

# Test credentials
TEST_EMAIL="testuser$(date +%s)@example.com"
TEST_PASSWORD="password123"
ACCESS_TOKEN=""
USER_ID=""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local auth=$5
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "Endpoint: $method $endpoint"
    
    if [ "$auth" = "true" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        echo "Response: $(echo $body | jq -c '.' 2>/dev/null || echo $body | head -c 100)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
        echo "Response: $(echo $body | head -c 200)"
        return 1
    fi
}

echo -e "\n${YELLOW}=== 1. AUTHENTICATION TESTS ===${NC}"

# Register
echo -e "\n${BLUE}1.1 User Registration${NC}"
register_response=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"role\":\"customer\"}")

if echo "$register_response" | grep -q "success"; then
    echo -e "${GREEN}✅ Registration successful${NC}"
    ACCESS_TOKEN=$(echo "$register_response" | jq -r '.data.tokens.accessToken')
    USER_ID=$(echo "$register_response" | jq -r '.data.user.id')
    echo "User ID: $USER_ID"
    echo "Token: ${ACCESS_TOKEN:0:50}..."
else
    echo -e "${RED}❌ Registration failed${NC}"
    echo "$register_response"
fi

# Login
test_endpoint "POST" "/api/auth/login" \
    "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
    "User Login" "false"

# Verify token
test_endpoint "GET" "/api/auth/verify" "" "Token Verification" "true"

echo -e "\n${YELLOW}=== 2. USER PROFILE TESTS ===${NC}"

# Create profile
test_endpoint "POST" "/api/users/profile" \
    "{\"name\":\"Test User\",\"phone\":\"+1234567890\",\"address\":\"123 Test St\"}" \
    "Create User Profile" "true"

# Get profile
test_endpoint "GET" "/api/users/profile" "" "Get User Profile" "true"

# Update profile
test_endpoint "PUT" "/api/users/profile" \
    "{\"name\":\"Updated User\",\"phone\":\"+9876543210\"}" \
    "Update User Profile" "true"

echo -e "\n${YELLOW}=== 3. RESTAURANT TESTS ===${NC}"

# Get all restaurants
test_endpoint "GET" "/api/restaurants" "" "Get All Restaurants" "false"

# Get restaurants by cuisine
test_endpoint "GET" "/api/restaurants?cuisine=Italian" "" "Get Italian Restaurants" "false"

# Search restaurants
test_endpoint "GET" "/api/restaurants?search=pizza" "" "Search Restaurants" "false"

# Create restaurant (as restaurant owner)
RESTAURANT_EMAIL="restaurant$(date +%s)@example.com"
restaurant_register=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$RESTAURANT_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"role\":\"restaurant\"}")

RESTAURANT_TOKEN=$(echo "$restaurant_register" | jq -r '.data.tokens.accessToken')

echo -e "\n${BLUE}3.4 Create Restaurant${NC}"
create_restaurant=$(curl -s -X POST "$BASE_URL/api/restaurants" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $RESTAURANT_TOKEN" \
    -d '{
        "name":"Test Restaurant",
        "cuisine":"Italian",
        "address":"456 Restaurant Ave",
        "phone":"+1234567890",
        "description":"A test restaurant"
    }')

if echo "$create_restaurant" | grep -q "success"; then
    echo -e "${GREEN}✅ Restaurant created${NC}"
    RESTAURANT_ID=$(echo "$create_restaurant" | jq -r '.data.id')
    echo "Restaurant ID: $RESTAURANT_ID"
else
    echo -e "${RED}❌ Restaurant creation failed${NC}"
    # Use a default ID for testing
    RESTAURANT_ID="test-restaurant-id"
fi

# Get restaurant by ID
test_endpoint "GET" "/api/restaurants/$RESTAURANT_ID" "" "Get Restaurant by ID" "false"

echo -e "\n${YELLOW}=== 4. MENU TESTS ===${NC}"

# Create menu item
echo -e "\n${BLUE}4.1 Create Menu Item${NC}"
create_menu=$(curl -s -X POST "$BASE_URL/api/menu" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $RESTAURANT_TOKEN" \
    -d "{
        \"restaurantId\":\"$RESTAURANT_ID\",
        \"name\":\"Margherita Pizza\",
        \"description\":\"Classic pizza\",
        \"price\":12.99,
        \"category\":\"Pizza\",
        \"available\":true
    }")

if echo "$create_menu" | grep -q "success"; then
    echo -e "${GREEN}✅ Menu item created${NC}"
    MENU_ITEM_ID=$(echo "$create_menu" | jq -r '.data.id')
else
    echo -e "${RED}❌ Menu item creation failed${NC}"
    MENU_ITEM_ID="test-menu-id"
fi

# Get menu by restaurant
test_endpoint "GET" "/api/menu/restaurant/$RESTAURANT_ID" "" "Get Restaurant Menu" "false"

# Get menu item by ID
test_endpoint "GET" "/api/menu/$MENU_ITEM_ID" "" "Get Menu Item" "false"

# Update menu item
test_endpoint "PUT" "/api/menu/$MENU_ITEM_ID" \
    "{\"price\":14.99,\"available\":true}" \
    "Update Menu Item" "true"

echo -e "\n${YELLOW}=== 5. ORDER TESTS ===${NC}"

# Create order
echo -e "\n${BLUE}5.1 Create Order${NC}"
create_order=$(curl -s -X POST "$BASE_URL/api/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "{
        \"restaurantId\":\"$RESTAURANT_ID\",
        \"items\":[{
            \"menuItemId\":\"$MENU_ITEM_ID\",
            \"quantity\":2,
            \"price\":12.99
        }],
        \"deliveryAddress\":\"123 Test St\",
        \"totalAmount\":25.98
    }")

if echo "$create_order" | grep -q "success"; then
    echo -e "${GREEN}✅ Order created${NC}"
    ORDER_ID=$(echo "$create_order" | jq -r '.data.id')
    echo "Order ID: $ORDER_ID"
else
    echo -e "${RED}❌ Order creation failed${NC}"
    ORDER_ID="test-order-id"
fi

# Get user orders
test_endpoint "GET" "/api/orders/user" "" "Get User Orders" "true"

# Get order by ID
test_endpoint "GET" "/api/orders/$ORDER_ID" "" "Get Order by ID" "true"

# Update order status
test_endpoint "PATCH" "/api/orders/$ORDER_ID/status" \
    "{\"status\":\"preparing\"}" \
    "Update Order Status" "true"

echo -e "\n${YELLOW}=== 6. PAYMENT TESTS ===${NC}"

# Create payment
echo -e "\n${BLUE}6.1 Create Payment${NC}"
create_payment=$(curl -s -X POST "$BASE_URL/api/payments" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "{
        \"orderId\":\"$ORDER_ID\",
        \"amount\":25.98,
        \"method\":\"card\"
    }")

if echo "$create_payment" | grep -q "success"; then
    echo -e "${GREEN}✅ Payment created${NC}"
    PAYMENT_ID=$(echo "$create_payment" | jq -r '.data.id')
else
    echo -e "${RED}❌ Payment creation failed${NC}"
    PAYMENT_ID="test-payment-id"
fi

# Get payment by ID
test_endpoint "GET" "/api/payments/$PAYMENT_ID" "" "Get Payment" "true"

# Get payments by order
test_endpoint "GET" "/api/payments/order/$ORDER_ID" "" "Get Order Payments" "true"

echo -e "\n${YELLOW}=== 7. DELIVERY TESTS ===${NC}"

# Register driver
DRIVER_EMAIL="driver$(date +%s)@example.com"
driver_register=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$DRIVER_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"role\":\"driver\"}")

DRIVER_TOKEN=$(echo "$driver_register" | jq -r '.data.tokens.accessToken')
DRIVER_ID=$(echo "$driver_register" | jq -r '.data.user.id')

# Create delivery
echo -e "\n${BLUE}7.1 Create Delivery${NC}"
create_delivery=$(curl -s -X POST "$BASE_URL/api/delivery" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DRIVER_TOKEN" \
    -d "{
        \"orderId\":\"$ORDER_ID\",
        \"driverId\":\"$DRIVER_ID\",
        \"pickupAddress\":\"456 Restaurant Ave\",
        \"deliveryAddress\":\"123 Test St\"
    }")

if echo "$create_delivery" | grep -q "success"; then
    echo -e "${GREEN}✅ Delivery created${NC}"
    DELIVERY_ID=$(echo "$create_delivery" | jq -r '.data.id')
else
    echo -e "${RED}❌ Delivery creation failed${NC}"
    DELIVERY_ID="test-delivery-id"
fi

# Get delivery by ID
test_endpoint "GET" "/api/delivery/$DELIVERY_ID" "" "Get Delivery" "true"

# Update delivery status
test_endpoint "PATCH" "/api/delivery/$DELIVERY_ID/status" \
    "{\"status\":\"picked_up\"}" \
    "Update Delivery Status" "true"

echo -e "\n${YELLOW}=== 8. NOTIFICATION TESTS ===${NC}"

# Send notification
test_endpoint "POST" "/api/notifications" \
    "{\"userId\":\"$USER_ID\",\"type\":\"email\",\"message\":\"Test notification\"}" \
    "Send Notification" "true"

# Get user notifications
test_endpoint "GET" "/api/notifications/user" "" "Get User Notifications" "true"

echo -e "\n${YELLOW}=== 9. HEALTH CHECKS ===${NC}"

test_endpoint "GET" "/health" "" "API Gateway Health" "false"
test_endpoint "GET" "/api/auth/health" "" "Auth Service Health" "false"
test_endpoint "GET" "/api/users/health" "" "User Service Health" "false"
test_endpoint "GET" "/api/restaurants/health" "" "Restaurant Service Health" "false"
test_endpoint "GET" "/api/menu/health" "" "Menu Service Health" "false"
test_endpoint "GET" "/api/orders/health" "" "Order Service Health" "false"
test_endpoint "GET" "/api/payments/health" "" "Payment Service Health" "false"
test_endpoint "GET" "/api/delivery/health" "" "Delivery Service Health" "false"
test_endpoint "GET" "/api/notifications/health" "" "Notification Service Health" "false"

echo -e "\n${YELLOW}======================================${NC}"
echo -e "${GREEN}✅ API TESTING COMPLETE!${NC}"
echo -e "${YELLOW}======================================${NC}"

echo -e "\n${BLUE}Test Credentials:${NC}"
echo "Customer Email: $TEST_EMAIL"
echo "Restaurant Email: $RESTAURANT_EMAIL"
echo "Driver Email: $DRIVER_EMAIL"
echo "Password: $TEST_PASSWORD"

echo -e "\n${BLUE}Frontend URLs to test:${NC}"
echo "Landing: $FRONTEND_URL/landing"
echo "Login: $FRONTEND_URL/login"
echo "Register: $FRONTEND_URL/register"
echo "Dashboard: $FRONTEND_URL/dashboard"
echo "Restaurant Details: $FRONTEND_URL/restaurant/$RESTAURANT_ID"
