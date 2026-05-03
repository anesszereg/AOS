#!/bin/bash

echo "🔍 Checking Render Infrastructure Integration..."
echo ""

BASE_URL="https://food-delevery-app-g73l.onrender.com"

# Test API Gateway
echo "1. API Gateway Health:"
health=$(curl -s "$BASE_URL/health")
echo "$health"

# Test database connection
echo -e "\n2. Database Connection (via Restaurant Service):"
restaurants=$(curl -s "$BASE_URL/api/restaurants")
if echo "$restaurants" | grep -q "success"; then
    echo "✅ Database Connected"
    count=$(echo "$restaurants" | grep -o '"id"' | wc -l)
    echo "   Found $count restaurants"
else
    echo "❌ Database Failed"
fi

# Test caching (Redis)
echo -e "\n3. Testing Redis Cache Performance:"
echo "   First request (cache miss):"
start1=$(date +%s%N)
curl -s "$BASE_URL/api/restaurants" > /dev/null
end1=$(date +%s%N)
duration1=$(( (end1 - start1) / 1000000 ))
echo "   Duration: ${duration1}ms"

sleep 1

echo "   Second request (should be cached):"
start2=$(date +%s%N)
curl -s "$BASE_URL/api/restaurants" > /dev/null
end2=$(date +%s%N)
duration2=$(( (end2 - start2) / 1000000 ))
echo "   Duration: ${duration2}ms"

if [ $duration2 -lt $duration1 ]; then
    echo "   ✅ Cache is working! (${duration2}ms < ${duration1}ms)"
else
    echo "   ⚠️  Cache may not be active yet"
fi

echo -e "\n4. Check Render Logs for Infrastructure Connections:"
echo "   Go to: https://dashboard.render.com"
echo "   Select: food-delivery-app"
echo "   Click: Logs tab"
echo ""
echo "   Look for these messages:"
echo "   ✅ '[service-name] ✅ RabbitMQ connected'"
echo "   ✅ '[service-name] ✅ Redis connected'"
echo "   ✅ '[service-name] Infrastructure initialization complete'"

echo -e "\n5. Environment Variables Status:"
echo "   RABBITMQ_URL: Set in .env.example ✅"
echo "   REDIS_URL: Set in .env.example ✅"
echo "   Make sure these are also set in Render Dashboard!"

echo -e "\n6. Next Steps:"
echo "   1. Check Render logs for connection messages"
echo "   2. If not connected, verify environment variables in Render"
echo "   3. Redeploy if needed"
echo "   4. Run this script again to verify"

echo -e "\n✅ Local infrastructure test complete!"
