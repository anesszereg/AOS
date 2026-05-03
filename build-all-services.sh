#!/bin/bash

echo "🔨 Building all services..."

SERVICES=("auth" "user" "restaurant" "menu" "order" "payment" "delivery" "notification")

for service in "${SERVICES[@]}"; do
  echo ""
  echo "Building ${service}-service..."
  cd services/${service}-service
  
  # Build TypeScript
  npm run build
  
  # Copy infrastructure-init.js to dist
  if [ -f "src/utils/infrastructure-init.js" ]; then
    mkdir -p dist/utils
    cp src/utils/infrastructure-init.js dist/utils/
    echo "✅ Copied infrastructure-init.js to dist/utils/"
  fi
  
  cd ../..
done

echo ""
echo "✅ All services built successfully!"
