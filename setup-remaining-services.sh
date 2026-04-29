#!/bin/bash

echo "🚀 Setting up all remaining microservices..."

# Array of services to create
services=(
  "restaurant-service:3003:restaurant_db"
  "menu-service:3004:menu_db"
  "order-service:3005:order_db"
  "payment-service:3006:payment_db"
  "delivery-service:3007:delivery_db"
  "notification-service:3008:notification_db"
)

# Base directory
BASE_DIR="services"

for service_config in "${services[@]}"; do
  IFS=':' read -r service_name port db_name <<< "$service_config"
  
  echo "📦 Creating $service_name..."
  
  # Copy user-service as template
  if [ ! -d "$BASE_DIR/$service_name" ]; then
    cp -r "$BASE_DIR/user-service" "$BASE_DIR/$service_name"
    echo "  ✅ Copied template"
  fi
  
  # Update .env file
  cat > "$BASE_DIR/$service_name/.env" << EOF
PORT=$port
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=$db_name
DATABASE_USER=mac
DATABASE_PASSWORD=

JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long

SERVICE_NAME=$service_name
SERVICE_HOST=localhost

LOG_LEVEL=debug
EOF
  echo "  ✅ Created .env with port $port"
  
  # Update package.json
  sed -i '' "s/\"name\": \"user-service\"/\"name\": \"$service_name\"/" "$BASE_DIR/$service_name/package.json"
  echo "  ✅ Updated package.json"
  
done

echo ""
echo "✅ All services created successfully!"
echo ""
echo "Services created:"
for service_config in "${services[@]}"; do
  IFS=':' read -r service_name port db_name <<< "$service_config"
  echo "  - $service_name (Port: $port, DB: $db_name)"
done
