# 🚀 Consul Cloud Quick Start Guide

**You're here:** Just created a Consul Cloud project  
**Next:** Get your services registered and discoverable

---

## ✅ **STEP 1: CREATE CONSUL CLUSTER**

### **In Consul Cloud Dashboard:**

1. **Click "Services" → "Consul"** in left sidebar
2. **Click "Create cluster"**
3. **Configure:**
   ```
   Cluster name: food-delivery-consul
   Tier: Development (FREE)
   Region: us-east-1 (or closest to you)
   Version: Latest
   ```
4. **Click "Create cluster"**
5. **⏳ Wait 5-10 minutes** for provisioning

---

## ✅ **STEP 2: GET CONNECTION DETAILS**

### **Once cluster is "Active":**

1. **Click on your cluster name**
2. **Go to "Overview" tab**
3. **Find and copy:**

```
Public Endpoint: 
  https://food-delivery-consul-public-consul-abc123.consul.hashicorp.cloud

Bootstrap Token:
  Click "Generate token" or copy existing token
  Format: e1a2b3c4-5678-90ab-cdef-1234567890ab
```

**Save these values!** You'll need them next.

---

## ✅ **STEP 3: ADD TO RENDER**

### **Go to Render Dashboard:**

1. **Navigate to:** https://dashboard.render.com
2. **Select:** food-delivery-backend
3. **Click:** Environment tab
4. **Add these variables:**

```env
CONSUL_HOST=food-delivery-consul-public-consul-abc123.consul.hashicorp.cloud
CONSUL_TOKEN=e1a2b3c4-5678-90ab-cdef-1234567890ab
CONSUL_PORT=443
```

**Important:** 
- Use the full URL (with `https://`) for CONSUL_HOST
- Or remove `https://` - the code handles both
- Port should be `443` for Consul Cloud

5. **Click "Save Changes"**
6. **Render will automatically redeploy** (takes ~5 minutes)

---

## ✅ **STEP 4: VERIFY REGISTRATION**

### **After Render Deployment Completes:**

1. **Check Render Logs:**
   ```
   Look for:
   [auth-service] Service registered with Consul
   [auth-service] consulHost: food-delivery-consul-public...
   ```

2. **Check Consul UI:**
   ```
   Go to: https://portal.cloud.hashicorp.com
   Click: Your cluster
   Go to: Services tab
   
   You should see:
   ✅ auth-service (1 instance)
   ```

3. **Check Service Health:**
   ```
   In Consul UI:
   Click: auth-service
   Status should be: ✅ Passing
   ```

---

## ✅ **STEP 5: TEST SERVICE DISCOVERY**

### **Using Consul API:**

```bash
# Get your token and endpoint
CONSUL_TOKEN="your-token"
CONSUL_URL="https://your-cluster.consul.hashicorp.cloud"

# List all services
curl -H "X-Consul-Token: $CONSUL_TOKEN" \
  "$CONSUL_URL/v1/catalog/services"

# Get auth-service details
curl -H "X-Consul-Token: $CONSUL_TOKEN" \
  "$CONSUL_URL/v1/health/service/auth-service?passing=true"
```

### **Expected Response:**

```json
[
  {
    "Node": {
      "Node": "auth-service-3001",
      "Address": "localhost"
    },
    "Service": {
      "ID": "auth-service-3001",
      "Service": "auth-service",
      "Tags": ["auth", "api", "microservice"],
      "Port": 3001
    },
    "Checks": [
      {
        "Status": "passing",
        "Output": "HTTP GET http://localhost:3001/health: 200 OK"
      }
    ]
  }
]
```

---

## 🎯 **WHAT HAPPENS NOW?**

### **Automatic Service Registration:**

```
1. Service starts on Render
2. Reads CONSUL_HOST, CONSUL_TOKEN from env
3. Connects to Consul Cloud
4. Registers itself with:
   - Service name
   - IP address
   - Port
   - Health check endpoint
5. Consul checks /health every 10 seconds
6. If healthy: Service is "available"
7. If unhealthy: Service is "unavailable"
```

### **Service Discovery:**

```
1. API Gateway queries Consul
2. "Give me all healthy auth-service instances"
3. Consul returns list of available instances
4. API Gateway picks one (load balancing)
5. Routes request to that instance
```

---

## 📊 **MONITORING IN CONSUL UI**

### **What You Can See:**

1. **Services Tab:**
   - All registered services
   - Number of instances
   - Health status

2. **Nodes Tab:**
   - All service instances
   - Their addresses and ports

3. **Health Checks:**
   - Which checks are passing/failing
   - Check output and timing

4. **Intentions (Advanced):**
   - Service-to-service communication rules
   - Security policies

---

## 🔧 **TROUBLESHOOTING**

### **Service Not Appearing in Consul:**

**Check Render Logs:**
```
Look for:
❌ "Failed to register with Consul"
✅ "Service registered with Consul"
```

**Common Issues:**

1. **Wrong CONSUL_HOST:**
   ```
   ❌ Missing https://
   ❌ Wrong cluster name
   ✅ Full URL from Consul dashboard
   ```

2. **Wrong CONSUL_TOKEN:**
   ```
   ❌ Expired token
   ❌ Wrong permissions
   ✅ Bootstrap token from Consul
   ```

3. **Network Issues:**
   ```
   ❌ Firewall blocking port 443
   ❌ Consul cluster not active
   ✅ Check cluster status in dashboard
   ```

### **Service Shows as "Unhealthy":**

**Check:**
```
1. Is /health endpoint working?
   curl https://your-app.onrender.com/api/auth/health

2. Is service actually running?
   Check Render logs for "listening on port 3001"

3. Is health check URL correct?
   Should be: http://localhost:3001/health
```

---

## 🚀 **NEXT STEPS**

### **Option A: Add More Services**

Copy the Consul registration code from `auth-service` to other services:

```bash
# Services to update:
- user-service
- restaurant-service
- menu-service
- order-service
- payment-service
- delivery-service
- notification-service
```

### **Option B: Update API Gateway**

Make the API Gateway use Consul for service discovery:

```javascript
// server.js
const consul = require('consul')({
  host: process.env.CONSUL_HOST.replace('https://', ''),
  port: '443',
  secure: true,
  defaults: {
    token: process.env.CONSUL_TOKEN
  }
});

async function getServiceUrl(serviceName) {
  const services = await consul.health.service({
    service: serviceName,
    passing: true
  });
  
  if (services.length > 0) {
    const service = services[0].Service;
    return `http://${service.Address}:${service.Port}`;
  }
  
  return null;
}
```

### **Option C: Add Traefik**

Use Traefik with Consul for automatic routing:
- See `CONSUL_TRAEFIK_SETUP.md`
- Traefik discovers services from Consul
- Automatic routing without manual configuration

---

## 📋 **CHECKLIST**

- [ ] Consul cluster created and active
- [ ] Connection details copied
- [ ] Environment variables added to Render
- [ ] Render redeployed successfully
- [ ] Service appears in Consul UI
- [ ] Health check is passing
- [ ] Can query service via Consul API

---

## 🎉 **SUCCESS!**

When you see this in Consul UI:

```
Services
├─ auth-service (1) ✅ Passing
└─ Health Checks: 1/1 passing
```

**You're done!** Your service is now:
- ✅ Registered with Consul
- ✅ Health checked automatically
- ✅ Discoverable by other services
- ✅ Ready for production

---

## 📞 **NEED HELP?**

**Consul Cloud Docs:**
https://developer.hashicorp.com/consul/docs

**Consul API Reference:**
https://developer.hashicorp.com/consul/api-docs

**Support:**
https://support.hashicorp.com

---

**Last Updated:** May 3, 2026  
**Status:** Ready to use!
