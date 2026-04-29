# 🚀 Deployment Guide

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- npm or yarn
- 8GB RAM minimum
- 20GB disk space

## Quick Start (Development)

### 1. Clone and Setup

```bash
cd food-delivery-platform
```

### 2. Install Dependencies for All Services

```bash
# Install shared dependencies
cd shared
npm install
cd ..

# Install auth service dependencies
cd services/auth-service
npm install
cd ../..

# Repeat for other services or use the helper script
chmod +x scripts/install-all.sh
./scripts/install-all.sh
```

### 3. Start Infrastructure Services

```bash
docker-compose up -d postgres rabbitmq consul redis traefik
```

Wait for all services to be healthy:
```bash
docker-compose ps
```

### 4. Initialize Databases

The databases will be automatically created via the init.sql script. Verify:

```bash
docker exec -it food-delivery-postgres psql -U postgres -c "\l"
```

You should see all 8 databases created.

### 5. Start Microservices

#### Option A: Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

#### Option B: Local Development
```bash
# Terminal 1 - Auth Service
cd services/auth-service
npm run dev

# Terminal 2 - User Service
cd services/user-service
npm run dev

# Terminal 3 - Restaurant Service
cd services/restaurant-service
npm run dev

# ... and so on for other services
```

### 6. Start Frontend

```bash
cd frontend/food-delivery-app
npm install
npm run dev
```

### 7. Verify Deployment

Check all services are running:
```bash
# Check health endpoints
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # User Service
curl http://localhost:3003/health  # Restaurant Service
curl http://localhost:3004/health  # Menu Service
curl http://localhost:3005/health  # Order Service
curl http://localhost:3006/health  # Payment Service
curl http://localhost:3007/health  # Delivery Service
curl http://localhost:3008/health  # Notification Service

# Check Consul
open http://localhost:8500

# Check RabbitMQ
open http://localhost:15672
# Login: admin / admin123

# Check Traefik
open http://localhost:8080

# Check Frontend
open http://localhost:3000
```

## Production Deployment

### 1. Environment Configuration

Create production environment files:

```bash
# services/auth-service/.env.production
PORT=3001
NODE_ENV=production
DATABASE_HOST=your-production-db-host
DATABASE_PORT=5432
DATABASE_NAME=auth_db
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-secure-password
JWT_ACCESS_SECRET=your-very-secure-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CONSUL_HOST=consul
SERVICE_NAME=auth-service
SERVICE_HOST=auth-service
LOG_LEVEL=info
```

Repeat for all services with appropriate values.

### 2. Build Production Images

```bash
docker-compose -f docker-compose.prod.yml build
```

### 3. Deploy to Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Scale Services

```bash
# Scale order service to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale order-service=3

# Scale payment service to 2 instances
docker-compose -f docker-compose.prod.yml up -d --scale payment-service=2
```

### 5. Monitor Services

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f order-service

# Check resource usage
docker stats
```

## Multi-Server Deployment

### Server 1: Load Balancer & Service Discovery
```bash
# Install Docker
# Run Traefik and Consul
docker run -d \
  --name traefik \
  -p 80:80 -p 443:443 -p 8080:8080 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  traefik:2.10 \
  --api.insecure=true \
  --providers.consulcatalog=true \
  --providers.consulcatalog.endpoint.address=consul:8500

docker run -d \
  --name consul \
  -p 8500:8500 \
  consul:1.16 agent -server -ui -bootstrap-expect=1 -client=0.0.0.0
```

### Server 2: Application Services (Auth, User, Restaurant, Menu)
```bash
# Set environment variables
export CONSUL_HOST=<server1-ip>

# Run services
docker-compose -f docker-compose.server2.yml up -d
```

### Server 3: Application Services (Order, Payment, Delivery, Notification)
```bash
# Set environment variables
export CONSUL_HOST=<server1-ip>

# Run services
docker-compose -f docker-compose.server3.yml up -d
```

### Server 4: Data Layer
```bash
# PostgreSQL Primary
docker run -d \
  --name postgres-primary \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secure-password \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# RabbitMQ Cluster
docker run -d \
  --name rabbitmq-node1 \
  -p 5672:5672 -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=secure-password \
  rabbitmq:3.12-management-alpine

# Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

## Database Backup & Restore

### Backup

```bash
# Backup all databases
docker exec food-delivery-postgres pg_dumpall -U postgres > backup_$(date +%Y%m%d).sql

# Backup specific database
docker exec food-delivery-postgres pg_dump -U postgres auth_db > auth_db_backup.sql
```

### Restore

```bash
# Restore all databases
docker exec -i food-delivery-postgres psql -U postgres < backup_20240413.sql

# Restore specific database
docker exec -i food-delivery-postgres psql -U postgres auth_db < auth_db_backup.sql
```

## SSL/TLS Configuration

### Using Let's Encrypt with Traefik

Update Traefik configuration:

```yaml
# traefik.yml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
```

## Monitoring Setup

### Prometheus

```bash
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

### Grafana

```bash
docker run -d \
  --name grafana \
  -p 3001:3000 \
  grafana/grafana
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs service-name

# Check if port is already in use
lsof -i :3001

# Restart service
docker-compose restart service-name
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection
docker exec -it food-delivery-postgres psql -U postgres

# Check database exists
\l

# Check tables
\c auth_db
\dt
```

### RabbitMQ Issues

```bash
# Check RabbitMQ status
docker exec food-delivery-rabbitmq rabbitmq-diagnostics status

# Check queues
docker exec food-delivery-rabbitmq rabbitmqctl list_queues

# Purge queue
docker exec food-delivery-rabbitmq rabbitmqctl purge_queue queue-name
```

### Consul Issues

```bash
# Check Consul members
docker exec food-delivery-consul consul members

# Check services
docker exec food-delivery-consul consul catalog services

# Deregister stuck service
docker exec food-delivery-consul consul services deregister -id=service-id
```

## Performance Tuning

### PostgreSQL

```sql
-- Increase connection pool
ALTER SYSTEM SET max_connections = 200;

-- Increase shared buffers
ALTER SYSTEM SET shared_buffers = '256MB';

-- Reload configuration
SELECT pg_reload_conf();
```

### RabbitMQ

```bash
# Increase file descriptors
docker exec food-delivery-rabbitmq rabbitmqctl eval 'application:set_env(rabbit, file_descriptors_limit, 65536).'
```

### Node.js Services

```bash
# Increase memory limit
NODE_OPTIONS=--max-old-space-size=4096 node dist/index.js
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable SSL/TLS for all external connections
- [ ] Use environment variables for sensitive data
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Enable rate limiting
- [ ] Implement API authentication
- [ ] Use HTTPS only in production
- [ ] Regular database backups
- [ ] Monitor for suspicious activity
- [ ] Use secrets management (e.g., HashiCorp Vault)

## Maintenance

### Update Services

```bash
# Pull latest images
docker-compose pull

# Restart services with zero downtime
docker-compose up -d --no-deps --build service-name
```

### Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Clean up Docker system
docker system prune -a
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose -f docker-compose.prod.yml build
      
      - name: Run tests
        run: docker-compose -f docker-compose.test.yml up --abort-on-container-exit
      
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml push
          ssh user@production-server 'cd /app && docker-compose pull && docker-compose up -d'
```

## Support

For issues and questions:
- Check logs: `docker-compose logs -f`
- Review documentation
- Check GitHub issues
- Contact support team

## Rollback Procedure

```bash
# Stop current deployment
docker-compose down

# Restore database backup
docker exec -i food-delivery-postgres psql -U postgres < backup_before_deployment.sql

# Deploy previous version
git checkout previous-tag
docker-compose up -d
```
