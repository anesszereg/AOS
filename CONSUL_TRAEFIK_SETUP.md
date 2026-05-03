# 🔧 Complete Consul + Traefik Setup Guide

**Goal:** Add service discovery (Consul) and reverse proxy (Traefik) to your food delivery platform  
**Time Required:** 2-3 hours  
**Difficulty:** Intermediate

---

## 📋 **PART 1: CONSUL SETUP**

### **What is Consul?**
- Service discovery: Services find each other automatically
- Health checking: Only healthy services receive traffic
- Key-value store: Centralized configuration
- Service mesh: Advanced networking features

### **Step 1: Choose Deployment Method**

#### **Option A: Consul Cloud (Recommended for Production)**

**Pros:**
- ✅ Fully managed (no maintenance)
- ✅ Free tier available
- ✅ High availability built-in
- ✅ Automatic backups

**Cons:**
- ⚠️ Requires internet connection
- ⚠️ Limited free tier

**Setup Steps:**

1. **Create Account**
   ```
   Go to: https://portal.cloud.hashicorp.com/
   Click: Sign Up
   Verify email
   ```

2. **Create Consul Cluster**
   ```
   1. Click "Create Cluster"
   2. Choose "Development" tier (FREE)
   3. Select region closest to you
   4. Name: "food-delivery-consul"
   5. Click "Create"
   6. Wait 5-10 minutes for provisioning
   ```

3. **Get Connection Details**
   ```
   1. Click on your cluster
   2. Go to "Access" tab
   3. Copy:
      - Cluster URL (e.g., https://food-delivery-consul.consul.hashicorp.cloud)
      - Bootstrap Token
   ```

4. **Add to Render Environment Variables**
   ```
   Go to: https://dashboard.render.com
   Select: food-delivery-backend
   Click: Environment
   Add:
      CONSUL_HOST=your-cluster-url
      CONSUL_TOKEN=your-bootstrap-token
   ```

#### **Option B: Self-Hosted with Docker (For Development)**

**Pros:**
- ✅ Free
- ✅ Full control
- ✅ Works offline

**Cons:**
- ⚠️ You manage it
- ⚠️ No high availability
- ⚠️ Need to secure it

**Setup Steps:**

1. **Create Consul Configuration**
   ```bash
   mkdir -p consul/config consul/data
   ```

2. **Create `consul/config/consul.json`:**
   ```json
   {
     "datacenter": "dc1",
     "data_dir": "/consul/data",
     "log_level": "INFO",
     "server": true,
     "bootstrap_expect": 1,
     "ui": true,
     "client_addr": "0.0.0.0",
     "ports": {
       "http": 8500,
       "dns": 8600
     }
   }
   ```

3. **Add to Docker Compose:**
   ```yaml
   # docker-compose.consul.yml
   version: '3.8'
   
   services:
     consul:
       image: consul:1.17
       container_name: consul
       ports:
         - "8500:8500"  # HTTP API
         - "8600:8600"  # DNS
       volumes:
         - ./consul/config:/consul/config
         - ./consul/data:/consul/data
       command: agent -server -ui -bootstrap-expect=1 -client=0.0.0.0
       networks:
         - food-delivery-network
   
   networks:
     food-delivery-network:
       driver: bridge
   ```

4. **Start Consul:**
   ```bash
   docker-compose -f docker-compose.consul.yml up -d
   ```

5. **Access UI:**
   ```
   Open: http://localhost:8500
   ```

---

### **Step 2: Update Services to Register with Consul**

Your auth service already has Consul registration code! Just need to enable it:

**File: `services/auth-service/src/index.ts`** (Already implemented!)
```typescript
if (process.env.CONSUL_HOST) {
  consul = new Consul({
    host: process.env.CONSUL_HOST,
    port: process.env.CONSUL_PORT || '8500',
  });
  
  await consul.agent.service.register({
    name: SERVICE_NAME,
    id: `${SERVICE_NAME}-${PORT}`,
    address: SERVICE_HOST,
    port: Number(PORT),
    tags: ['auth', 'api'],
    check: {
      http: `http://${SERVICE_HOST}:${PORT}/health`,
      interval: '10s',
    },
  });
}
```

**For other services**, copy this pattern to their `index.ts` files.

---

### **Step 3: Update API Gateway for Service Discovery**

**File: `server.js`** - Add Consul client:

```javascript
const consul = require('consul')();

// Function to get service URL from Consul
async function getServiceUrl(serviceName) {
  try {
    const services = await consul.health.service({
      service: serviceName,
      passing: true  // Only healthy services
    });
    
    if (services.length > 0) {
      const service = services[0].Service;
      return `http://${service.Address}:${service.Port}`;
    }
    
    console.warn(`No healthy instances of ${serviceName} found`);
    return null;
  } catch (error) {
    console.error(`Error discovering ${serviceName}:`, error.message);
    return null;
  }
}

// Dynamic proxy with Consul discovery
app.use('/api/auth', async (req, res, next) => {
  const serviceUrl = await getServiceUrl('auth-service');
  
  if (!serviceUrl) {
    return res.status(503).json({ error: 'Auth service unavailable' });
  }
  
  createProxyMiddleware({
    target: serviceUrl,
    pathRewrite: { '^/api/auth': '/api/v1/auth' },
    changeOrigin: false,
  })(req, res, next);
});
```

---

## 📋 **PART 2: TRAEFIK SETUP**

### **What is Traefik?**
- Modern reverse proxy
- Automatic HTTPS with Let's Encrypt
- Dynamic configuration
- Built-in dashboard
- Perfect for microservices

### **Step 1: Create Traefik Configuration**

**File: `traefik/traefik.yml`**
```yaml
# Traefik Static Configuration
api:
  dashboard: true
  insecure: true  # For development only!

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  # Consul Catalog provider for service discovery
  consulCatalog:
    endpoint:
      address: "consul:8500"
    exposedByDefault: false
    prefix: "traefik"
    
  # File provider for static routes
  file:
    filename: /etc/traefik/dynamic.yml
    watch: true

# HTTPS with Let's Encrypt
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

# Logging
log:
  level: INFO

accessLog:
  filePath: /var/log/traefik/access.log
```

**File: `traefik/dynamic.yml`**
```yaml
# Traefik Dynamic Configuration
http:
  routers:
    # Auth Service Router
    auth-router:
      rule: "PathPrefix(`/api/auth`)"
      service: auth-service
      middlewares:
        - auth-strip-prefix
      entryPoints:
        - web
        
    # User Service Router
    user-router:
      rule: "PathPrefix(`/api/users`)"
      service: user-service
      middlewares:
        - user-strip-prefix
      entryPoints:
        - web
        
    # Restaurant Service Router
    restaurant-router:
      rule: "PathPrefix(`/api/restaurants`)"
      service: restaurant-service
      middlewares:
        - restaurant-strip-prefix
      entryPoints:
        - web
        
    # Dashboard (secure in production!)
    dashboard:
      rule: "Host(`traefik.localhost`)"
      service: api@internal
      entryPoints:
        - web

  middlewares:
    auth-strip-prefix:
      stripPrefix:
        prefixes:
          - "/api/auth"
          
    user-strip-prefix:
      stripPrefix:
        prefixes:
          - "/api/users"
          
    restaurant-strip-prefix:
      stripPrefix:
        prefixes:
          - "/api/restaurants"
          
    # CORS middleware
    cors-headers:
      headers:
        accessControlAllowMethods:
          - GET
          - POST
          - PUT
          - DELETE
          - PATCH
        accessControlAllowOriginList:
          - "*"
        accessControlAllowHeaders:
          - "*"

  services:
    # These will be discovered from Consul
    auth-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3001"
          
    user-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3002"
          
    restaurant-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3003"
```

---

### **Step 2: Create Docker Compose for Traefik**

**File: `docker-compose.traefik.yml`**
```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"      # HTTP
      - "443:443"    # HTTPS
      - "8080:8080"  # Dashboard
    volumes:
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./traefik/dynamic.yml:/etc/traefik/dynamic.yml:ro
      - ./traefik/letsencrypt:/letsencrypt
      - ./traefik/logs:/var/log/traefik
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - food-delivery-network
    labels:
      - "traefik.enable=true"
      
  consul:
    image: consul:1.17
    container_name: consul
    ports:
      - "8500:8500"
      - "8600:8600"
    volumes:
      - ./consul/data:/consul/data
    command: agent -server -ui -bootstrap-expect=1 -client=0.0.0.0
    networks:
      - food-delivery-network

networks:
  food-delivery-network:
    driver: bridge
```

---

### **Step 3: Start Traefik + Consul**

```bash
# Create directories
mkdir -p traefik/letsencrypt traefik/logs consul/data

# Set permissions
chmod 600 traefik/letsencrypt

# Start services
docker-compose -f docker-compose.traefik.yml up -d

# Check logs
docker-compose -f docker-compose.traefik.yml logs -f traefik

# Access dashboards
# Traefik: http://localhost:8080
# Consul:  http://localhost:8500
```

---

### **Step 4: Update Services to Work with Traefik**

**Add labels to your services in Docker Compose:**

```yaml
services:
  auth-service:
    build: ./services/auth-service
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.auth.rule=PathPrefix(`/api/auth`)"
      - "traefik.http.routers.auth.entrypoints=web"
      - "traefik.http.services.auth.loadbalancer.server.port=3001"
      - "traefik.http.middlewares.auth-strip.stripprefix.prefixes=/api/auth"
      - "traefik.http.routers.auth.middlewares=auth-strip"
      # Consul tags
      - "consul.service.name=auth-service"
      - "consul.service.tags=api,auth"
    networks:
      - food-delivery-network
```

---

## 📋 **PART 3: COMPLETE INTEGRATION**

### **Full Docker Compose with Everything**

**File: `docker-compose.full.yml`**
```yaml
version: '3.8'

services:
  # Traefik Reverse Proxy
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./traefik/dynamic.yml:/etc/traefik/dynamic.yml:ro
      - ./traefik/letsencrypt:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - food-delivery-network
      
  # Consul Service Discovery
  consul:
    image: consul:1.17
    container_name: consul
    ports:
      - "8500:8500"
    volumes:
      - ./consul/data:/consul/data
    command: agent -server -ui -bootstrap-expect=1 -client=0.0.0.0
    networks:
      - food-delivery-network
      
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    environment:
      POSTGRES_USER: fooddelivery
      POSTGRES_PASSWORD: your-secure-password
      POSTGRES_DB: fooddelivery
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - food-delivery-network
      
  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - food-delivery-network
      
  # RabbitMQ Message Broker
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: fooddelivery
      RABBITMQ_DEFAULT_PASS: your-secure-password
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    networks:
      - food-delivery-network
      
  # Auth Service
  auth-service:
    build: ./services/auth-service
    container_name: auth-service
    environment:
      PORT: 3001
      DATABASE_URL: postgresql://fooddelivery:your-secure-password@postgres:5432/fooddelivery
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://fooddelivery:your-secure-password@rabbitmq:5672
      CONSUL_HOST: consul
      CONSUL_PORT: 8500
      JWT_SECRET: your-jwt-secret
    depends_on:
      - postgres
      - redis
      - rabbitmq
      - consul
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.auth.rule=PathPrefix(`/api/auth`)"
      - "traefik.http.services.auth.loadbalancer.server.port=3001"
    networks:
      - food-delivery-network
      
  # Add other services similarly...

volumes:
  postgres-data:
  redis-data:
  rabbitmq-data:

networks:
  food-delivery-network:
    driver: bridge
```

---

## 📋 **PART 4: TESTING**

### **Test Consul**

```bash
# Check Consul UI
open http://localhost:8500

# List services via API
curl http://localhost:8500/v1/catalog/services

# Check service health
curl http://localhost:8500/v1/health/service/auth-service
```

### **Test Traefik**

```bash
# Check Traefik dashboard
open http://localhost:8080

# Test routing
curl http://localhost/api/auth/health

# Check HTTPS (if configured)
curl https://your-domain.com/api/auth/health
```

---

## 📋 **PART 5: PRODUCTION DEPLOYMENT**

### **For Render.com:**

Render doesn't support Docker Compose directly, so you have two options:

#### **Option 1: Use Consul Cloud + Keep Current Setup**
```
1. Use Consul Cloud (managed)
2. Keep Render for services
3. Add Consul registration to services
4. Services discover each other via Consul
```

#### **Option 2: Move to Different Platform**
```
Platforms that support Docker Compose:
- DigitalOcean App Platform
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- Railway.app
```

---

## 🎯 **QUICK START (Local Development)**

```bash
# 1. Create configuration files
mkdir -p traefik consul/data

# 2. Copy configurations from above

# 3. Start infrastructure
docker-compose -f docker-compose.full.yml up -d

# 4. Check services
docker-compose ps

# 5. Access dashboards
# Traefik: http://localhost:8080
# Consul:  http://localhost:8500

# 6. Test API
curl http://localhost/api/auth/health
```

---

## ✅ **SUCCESS CRITERIA**

You'll know it's working when:

- [ ] Consul UI shows all services registered
- [ ] Traefik dashboard shows all routers
- [ ] Services can discover each other
- [ ] Health checks are passing
- [ ] API requests route correctly
- [ ] HTTPS works (if configured)

---

## 🆘 **TROUBLESHOOTING**

### **Consul Issues:**
```bash
# Check Consul logs
docker logs consul

# Verify service registration
curl http://localhost:8500/v1/agent/services

# Check health checks
curl http://localhost:8500/v1/health/state/critical
```

### **Traefik Issues:**
```bash
# Check Traefik logs
docker logs traefik

# Verify configuration
docker exec traefik traefik version

# Check routes
curl http://localhost:8080/api/http/routers
```

---

**Ready to start? Let me know which option you want to pursue!**
