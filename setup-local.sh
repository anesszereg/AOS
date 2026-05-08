#!/bin/bash

echo "🚀 Setting up Food Delivery Platform locally..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Start Docker services
echo -e "${YELLOW}📦 Starting Docker services (PostgreSQL, RabbitMQ, Redis)...${NC}"
docker-compose -f docker-compose.local.yml up -d

# 2. Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start (15 seconds)...${NC}"
sleep 15

# 3. Check if services are healthy
echo -e "${YELLOW}🔍 Checking service health...${NC}"
docker-compose -f docker-compose.local.yml ps

# 4. Initialize database
echo ""
echo -e "${YELLOW}🗄️  Initializing database schema...${NC}"
if docker exec -i food-delivery-postgres psql -U postgres -d food_delivery < init-database.sql 2>/dev/null; then
    echo -e "${GREEN}✅ Database schema created${NC}"
else
    echo -e "${YELLOW}⚠️  Database schema might already exist${NC}"
fi

# 5. Seed database
echo -e "${YELLOW}🌱 Seeding database with test data...${NC}"
if docker exec -i food-delivery-postgres psql -U postgres -d food_delivery < seed-data.sql 2>/dev/null; then
    echo -e "${GREEN}✅ Database seeded${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already be seeded${NC}"
fi

# 6. Update .env for local services
echo ""
echo -e "${YELLOW}⚙️  Updating .env for local services...${NC}"
if [ -f .env ]; then
    cp .env .env.backup
    echo -e "${GREEN}✅ Backed up .env to .env.backup${NC}"
fi

cat > .env.local << 'EOF'
# Local Development Environment
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
REDIS_URL=redis://:redis123@localhost:6379

# JWT Secrets
JWT_SECRET=osdmovnaonvonfwpefeopewmofmwfpeofwepfemewmfpmpomfw
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# API
VITE_API_URL=http://localhost:3000/api
PORT=3000

# Environment
NODE_ENV=development
EOF

cp .env.local .env
echo -e "${GREEN}✅ Created .env.local and updated .env${NC}"

# 7. Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}📚 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# 8. Display access information
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📊 Access Points:"
echo "  • API:              http://localhost:3000"
echo "  • Health Check:     http://localhost:3000/health"
echo "  • PostgreSQL:       localhost:5432 (postgres/postgres)"
echo "  • RabbitMQ UI:      http://localhost:15672 (admin/admin123)"
echo "  • Redis:            localhost:6379 (password: redis123)"
echo ""
echo "🚀 To start the application:"
echo "  npm start"
echo ""
echo "📝 Test Accounts (password: password123):"
echo "  • Admin:     admin@fooddelivery.com"
echo "  • Owner:     owner1@restaurant.com"
echo "  • Customer:  customer1@example.com"
echo "  • Driver:    driver1@delivery.com"
echo ""
echo "🛑 To stop services:"
echo "  docker-compose -f docker-compose.local.yml down"
echo ""
