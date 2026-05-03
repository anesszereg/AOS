#!/bin/bash
for service in user restaurant menu order payment delivery notification; do
  echo "Updating $service-service..."
  
  # Update package.json build script
  cd services/$service-service
  
  # Add build script to copy infrastructure file
  if grep -q '"build":' package.json; then
    sed -i.bak 's/"build": "tsc || true"/"build": "(tsc || true) \&\& cp src\/utils\/infrastructure-init.js dist\/utils\/ 2>\/dev\/null || true"/' package.json
    rm package.json.bak
  fi
  
  # Build the service
  npm run build > /dev/null 2>&1
  
  # Copy infrastructure file
  cp src/utils/infrastructure-init.js dist/utils/ 2>/dev/null || true
  
  cd ../..
  echo "  ✅ $service-service updated"
done
echo "✅ All services updated!"
