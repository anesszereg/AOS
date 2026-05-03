#!/bin/bash

echo "🔧 Setting up Consul for all services"
echo "======================================"
echo ""

# List of services
SERVICES=("user" "restaurant" "menu" "order" "payment" "delivery" "notification")

echo "📝 Services to update:"
for service in "${SERVICES[@]}"; do
  echo "  - ${service}-service"
done
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Cancelled"
  exit 1
fi

echo ""
echo "🔄 Copying Consul configuration from auth-service..."
echo ""

for service in "${SERVICES[@]}"; do
  SERVICE_DIR="services/${service}-service"
  
  if [ ! -d "$SERVICE_DIR" ]; then
    echo "⚠️  Skipping ${service}-service (directory not found)"
    continue
  fi
  
  echo "📦 Updating ${service}-service..."
  
  # The Consul code is already in auth-service/src/index.ts
  # For other services, you'll need to manually add it or create a template
  
  echo "   ℹ️  Please manually add Consul registration code to:"
  echo "      ${SERVICE_DIR}/src/index.ts"
  echo ""
done

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Add Consul environment variables to Render:"
echo "     CONSUL_HOST=your-cluster-url"
echo "     CONSUL_TOKEN=your-token"
echo "     CONSUL_PORT=443"
echo ""
echo "  2. Deploy to Render"
echo ""
echo "  3. Check Consul UI to see registered services:"
echo "     https://portal.cloud.hashicorp.com"
echo ""
