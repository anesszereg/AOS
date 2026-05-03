#!/bin/bash

echo "🔄 Monitoring Auth Service Deployment"
echo "======================================"
echo ""

for i in {1..30}; do
  echo "[$i/30] Checking auth service..."
  
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://food-delevery-app-g73l.onrender.com/api/auth/health)
  
  if [ "$STATUS" = "200" ]; then
    echo "✅ Auth service is UP! (HTTP $STATUS)"
    echo ""
    echo "Testing register endpoint..."
    curl -s -X POST https://food-delevery-app-g73l.onrender.com/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"email":"test'$(date +%s)'@test.com","password":"SecurePass123!","role":"customer"}' | jq .
    exit 0
  else
    echo "   Status: HTTP $STATUS (waiting...)"
    sleep 10
  fi
done

echo ""
echo "❌ Deployment taking longer than expected"
echo "Check Render logs for details"
