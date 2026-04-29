#!/bin/bash

# 🔐 Create Test Accounts Script
# This script creates test accounts via the auth-service API

set -e

echo "🔐 Creating Test Accounts..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Wait for auth-service to be ready
echo -e "${YELLOW}Waiting for auth-service to be ready...${NC}"
for i in {1..30}; do
  if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth service is ready${NC}"
    break
  fi
  echo -n "."
  sleep 2
done
echo ""

# Function to create account
create_account() {
  local email=$1
  local password=$2
  local role=$3
  local name=$4
  
  echo -n "Creating $role account: $email... "
  
  response=$(curl -s -X POST http://localhost:3001/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$email\",
      \"password\": \"$password\",
      \"role\": \"$role\",
      \"name\": \"$name\"
    }" 2>/dev/null)
  
  if echo "$response" | grep -q "token\|success\|id\|email"; then
    echo -e "${GREEN}✅${NC}"
  else
    echo -e "${YELLOW}⚠️  (may already exist)${NC}"
  fi
}

echo -e "${YELLOW}Creating customer accounts...${NC}"
create_account "customer1@example.com" "password123" "customer" "John Doe"
create_account "customer2@example.com" "password123" "customer" "Jane Smith"
create_account "customer3@example.com" "password123" "customer" "Mike Johnson"

echo ""
echo -e "${YELLOW}Creating restaurant accounts...${NC}"
create_account "restaurant1@example.com" "password123" "restaurant" "Luigi's Pizzeria"
create_account "restaurant2@example.com" "password123" "restaurant" "Sushi Palace"
create_account "restaurant3@example.com" "password123" "restaurant" "Burger House"

echo ""
echo -e "${YELLOW}Creating driver accounts...${NC}"
create_account "driver1@example.com" "password123" "driver" "Bob Driver"
create_account "driver2@example.com" "password123" "driver" "Alice Wheeler"
create_account "driver3@example.com" "password123" "driver" "Tom Rider"

echo ""
echo -e "${YELLOW}Creating admin account...${NC}"
create_account "admin@example.com" "admin123" "admin" "Admin User"

echo ""
echo -e "${GREEN}🎉 Test accounts created successfully!${NC}"
echo ""
echo "📝 Test Credentials:"
echo ""
echo -e "${GREEN}CUSTOMERS:${NC}"
echo "  Email: customer1@example.com | Password: password123"
echo "  Email: customer2@example.com | Password: password123"
echo "  Email: customer3@example.com | Password: password123"
echo ""
echo -e "${GREEN}RESTAURANTS:${NC}"
echo "  Email: restaurant1@example.com | Password: password123"
echo "  Email: restaurant2@example.com | Password: password123"
echo "  Email: restaurant3@example.com | Password: password123"
echo ""
echo -e "${GREEN}DRIVERS:${NC}"
echo "  Email: driver1@example.com | Password: password123"
echo "  Email: driver2@example.com | Password: password123"
echo "  Email: driver3@example.com | Password: password123"
echo ""
echo -e "${GREEN}ADMIN:${NC}"
echo "  Email: admin@example.com | Password: admin123"
echo ""
echo -e "${YELLOW}💡 Tip: You can now login at http://localhost:3000${NC}"
echo ""
