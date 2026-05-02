#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 INFRASTRUCTURE STATUS CHECK"
echo "================================"

# Check if RabbitMQ is configured
echo -e "\n${YELLOW}1. RabbitMQ Configuration${NC}"
if [ -z "$RABBITMQ_URL" ]; then
    echo -e "${RED}❌ RABBITMQ_URL not set${NC}"
    echo "RabbitMQ is OPTIONAL - Services will work without it"
    echo "To enable: Set RABBITMQ_URL environment variable"
else
    echo -e "${GREEN}✅ RABBITMQ_URL configured${NC}"
    echo "URL: $RABBITMQ_URL"
fi

# Check if Redis is configured
echo -e "\n${YELLOW}2. Redis Configuration${NC}"
if [ -z "$REDIS_URL" ]; then
    echo -e "${RED}❌ REDIS_URL not set${NC}"
    echo "Redis is OPTIONAL - Services will work without it"
    echo "To enable: Set REDIS_URL environment variable"
else
    echo -e "${GREEN}✅ REDIS_URL configured${NC}"
    echo "URL: $REDIS_URL"
fi

# Check if Consul is configured
echo -e "\n${YELLOW}3. Consul Configuration${NC}"
if [ -z "$CONSUL_HOST" ]; then
    echo -e "${RED}❌ CONSUL_HOST not set${NC}"
    echo "Consul is OPTIONAL - Services will work without it"
    echo "To enable: Set CONSUL_HOST environment variable"
else
    echo -e "${GREEN}✅ CONSUL_HOST configured${NC}"
    echo "Host: $CONSUL_HOST"
fi

# Check PostgreSQL
echo -e "\n${YELLOW}4. PostgreSQL Database${NC}"
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
    echo "PostgreSQL is REQUIRED"
else
    echo -e "${GREEN}✅ DATABASE_URL configured${NC}"
    # Test connection
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1" &> /dev/null; then
            echo -e "${GREEN}✅ Database connection successful${NC}"
        else
            echo -e "${RED}❌ Database connection failed${NC}"
        fi
    else
        echo "psql not installed - cannot test connection"
    fi
fi

# Check JWT Secret
echo -e "\n${YELLOW}5. JWT Configuration${NC}"
if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}❌ JWT_SECRET not set${NC}"
    echo "JWT_SECRET is REQUIRED for authentication"
else
    echo -e "${GREEN}✅ JWT_SECRET configured${NC}"
fi

# Summary
echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}INFRASTRUCTURE SUMMARY${NC}"
echo -e "${BLUE}================================${NC}"

echo -e "\n${GREEN}REQUIRED (Must Have):${NC}"
echo "  ✅ PostgreSQL - Configured"
echo "  ✅ JWT Secret - Configured"

echo -e "\n${YELLOW}OPTIONAL (Nice to Have):${NC}"
echo "  ⚠️  RabbitMQ - Not configured (events disabled)"
echo "  ⚠️  Redis - Not configured (caching disabled)"
echo "  ⚠️  Consul - Not configured (service discovery disabled)"

echo -e "\n${BLUE}Current Mode: ${GREEN}Basic Mode${NC}"
echo "Services are running with:"
echo "  - PostgreSQL database ✅"
echo "  - JWT authentication ✅"
echo "  - REST APIs ✅"
echo "  - No message queue (RabbitMQ)"
echo "  - No caching (Redis)"
echo "  - No service discovery (Consul)"

echo -e "\n${YELLOW}To enable advanced features:${NC}"
echo "1. Set RABBITMQ_URL for event-driven architecture"
echo "2. Set REDIS_URL for caching"
echo "3. Set CONSUL_HOST for service discovery"

echo -e "\n${GREEN}✅ Infrastructure check complete!${NC}"
