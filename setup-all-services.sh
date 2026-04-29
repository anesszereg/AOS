#!/bin/bash

echo "🚀 Setting up Food Delivery Platform - All Services"
echo "=================================================="

# Create all databases
echo "📊 Creating databases..."
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS user_db;" 2>/dev/null || echo "user_db may already exist"
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS restaurant_db;" 2>/dev/null || echo "restaurant_db may already exist"
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS menu_db;" 2>/dev/null || echo "menu_db may already exist"
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS order_db;" 2>/dev/null || echo "order_db may already exist"
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS payment_db;" 2>/dev/null || echo "payment_db may already exist"
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS delivery_db;" 2>/dev/null || echo "delivery_db may already exist"
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS notification_db;" 2>/dev/null || echo "notification_db may already exist"

# Create .env files for all services
echo "⚙️  Creating environment files..."

# User Service
cat > services/user-service/.env << EOF
PORT=3002
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=user_db
DATABASE_USER=postgres
DATABASE_PASSWORD=
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long
SERVICE_NAME=user-service
SERVICE_HOST=localhost
LOG_LEVEL=debug
EOF

# Restaurant Service
cat > services/restaurant-service/.env << EOF
PORT=3003
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=restaurant_db
DATABASE_USER=postgres
DATABASE_PASSWORD=
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long
SERVICE_NAME=restaurant-service
SERVICE_HOST=localhost
LOG_LEVEL=debug
EOF

# Menu Service
cat > services/menu-service/.env << EOF
PORT=3004
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=menu_db
DATABASE_USER=postgres
DATABASE_PASSWORD=
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long
SERVICE_NAME=menu-service
SERVICE_HOST=localhost
LOG_LEVEL=debug
EOF

# Order Service
cat > services/order-service/.env << EOF
PORT=3005
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=order_db
DATABASE_USER=postgres
DATABASE_PASSWORD=
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long
RABBITMQ_URL=amqp://localhost:5672
SERVICE_NAME=order-service
SERVICE_HOST=localhost
LOG_LEVEL=debug
EOF

# Payment Service
cat > services/payment-service/.env << EOF
PORT=3006
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=payment_db
DATABASE_USER=postgres
DATABASE_PASSWORD=
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long
RABBITMQ_URL=amqp://localhost:5672
SERVICE_NAME=payment-service
SERVICE_HOST=localhost
LOG_LEVEL=debug
EOF

# Delivery Service
cat > services/delivery-service/.env << EOF
PORT=3007
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=delivery_db
DATABASE_USER=postgres
DATABASE_PASSWORD=
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long
RABBITMQ_URL=amqp://localhost:5672
SERVICE_NAME=delivery-service
SERVICE_HOST=localhost
LOG_LEVEL=debug
EOF

# Notification Service
cat > services/notification-service/.env << EOF
PORT=3008
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=notification_db
DATABASE_USER=postgres
DATABASE_PASSWORD=
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production-min-32-characters-long
RABBITMQ_URL=amqp://localhost:5672
SERVICE_NAME=notification-service
SERVICE_HOST=localhost
LOG_LEVEL=debug
EOF

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Install dependencies for each service: cd services/SERVICE_NAME && npm install"
echo "2. Start each service: npm run dev"
echo ""
echo "Or use the start-all.sh script to start all services at once"
