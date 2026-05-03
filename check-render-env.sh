#!/bin/bash
echo "🔍 Checking Render Deployment Status..."
echo ""

BASE_URL="https://food-delevery-app-g73l.onrender.com"

# Test API Gateway
echo "1. API Gateway Health:"
curl -s "$BASE_URL/health" | jq -r '.status' 2>/dev/null || echo "Failed"

# Test if services are connecting to infrastructure
echo -e "\n2. Testing Restaurant Service (should use Redis cache):"
echo "First request (cache miss):"
time curl -s "$BASE_URL/api/restaurants" > /dev/null 2>&1
echo "Second request (cache hit - should be faster):"
time curl -s "$BASE_URL/api/restaurants" > /dev/null 2>&1

# Check service logs hint
echo -e "\n3. To verify RabbitMQ & Redis are connected:"
echo "   Go to Render Dashboard → Your Service → Logs"
echo "   Look for:"
echo "   ✅ 'Connected to RabbitMQ'"
echo "   ✅ 'Redis connected'"

echo -e "\n4. Create a test order to trigger RabbitMQ event:"
echo "   This will publish an event to RabbitMQ"
echo "   (Requires authentication token)"

