# Video Presentation Guide - Food Delivery Platform

## 📹 Video Structure (15-20 minutes recommended)

---

## **Part 1: Introduction (2 minutes)**

### **Slide 1: Title**
- Project Name: **Food Delivery Platform - Microservices Architecture**
- Team Members
- Date
- Course Name

### **Slide 2: Project Overview**
- **What**: Food delivery platform with microservices architecture
- **Technologies**: Node.js, Express, PostgreSQL, React, Docker
- **Services**: 8 independent microservices
- **Frontend**: React deployed on Vercel
- **Database**: PostgreSQL

---

## **Part 2: Global Architecture (3 minutes)**

### **Slide 3: Architecture Globale**

**What to show:**
```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                    │
│              React.js - Port 443 (HTTPS)                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY / Load Balancer           │
│                    (Port 3000 - HTTP)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │ Restaurant   │ │ Order Service│
│   Port 3001  │ │   Service    │ │   Port 3005  │
│              │ │   Port 3003  │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
              ┌──────────────────┐
              │   PostgreSQL DB  │
              │    Port 5432     │
              └──────────────────┘
```

**Key Points to Explain:**
1. **Client Layer**: React frontend (Vercel)
2. **API Gateway**: Central entry point (local-server.js)
3. **Service Layer**: 8 microservices
4. **Data Layer**: PostgreSQL database
5. **Communication**: REST API (HTTP/JSON)

**Script:**
> "Our architecture follows a microservices pattern with 8 independent services. 
> The frontend communicates with the backend through a central API gateway on port 3000.
> Each service has its own responsibility and can be deployed independently."

---

## **Part 3: Service Layer (Couche Service) (4 minutes)**

### **Slide 4: Microservices Overview**

**List all 8 services:**

| Service | Port | Responsibility |
|---------|------|----------------|
| **Auth Service** | 3001 | Authentication, JWT tokens, user login/register |
| **User Service** | 3002 | User profiles, preferences, account management |
| **Restaurant Service** | 3003 | Restaurant CRUD, search, ratings |
| **Menu Service** | 3004 | Menu items, categories, pricing |
| **Order Service** | 3005 | Order creation, tracking, status updates |
| **Payment Service** | 3006 | Payment processing, transaction history |
| **Delivery Service** | 3007 | Driver management, delivery tracking |
| **Notification Service** | 3008 | Email/SMS notifications, alerts |

### **Slide 5: Service Architecture Pattern**

**Show code structure:**
```
auth-service/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── config/          # Database, environment
│   └── app.ts           # Express application
├── dist/                # Compiled JavaScript
├── package.json
└── tsconfig.json
```

**Key Principles:**
- ✅ **Single Responsibility**: Each service has one job
- ✅ **Independent Deployment**: Can deploy without affecting others
- ✅ **Database per Service**: Each service manages its own data
- ✅ **API-based Communication**: REST APIs for inter-service communication

**Demo:**
- Show `services/` folder structure
- Open one service (e.g., auth-service)
- Show routes, controllers, database config
- Explain how it works independently

---

## **Part 4: Registry Layer (Couche Registry) (2 minutes)**

### **Slide 6: Service Discovery**

**Current Implementation:**
- **Static Configuration**: Services registered in `local-server.js`
- **Manual Registration**: Each service mounted at specific path

**Code Example:**
```javascript
// local-server.js
app.use('/api/auth', authService);
app.use('/api/restaurants', restaurantService);
app.use('/api/menu', menuService);
// ... etc
```

**Production Alternative (Explain but not implemented):**
- **Consul**: Service registry and discovery
- **Eureka**: Netflix service registry
- **etcd**: Distributed key-value store

**Script:**
> "In our current setup, services are statically registered in the API gateway.
> In production, we would use Consul or Eureka for dynamic service discovery,
> allowing services to register/deregister automatically."

### **Slide 7: Service Registry Diagram**

```
┌─────────────────────────────────────┐
│      Service Registry (Consul)      │
│  - Service Health Checks            │
│  - Service Locations                │
│  - Dynamic Discovery                │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
[Service A] [Service B] [Service C]
  Register    Register    Register
  Health      Health      Health
```

---

## **Part 5: Reverse Proxy (3 minutes)**

### **Slide 8: Reverse Proxy Architecture**

**What is a Reverse Proxy?**
- Acts as intermediary between clients and backend services
- Single entry point for all requests
- Routes requests to appropriate services

**Our Implementation:**
```javascript
// local-server.js acts as reverse proxy
const express = require('express');
const app = express();

// Route /api/auth/* to auth service
app.use('/api/auth', authService);

// Route /api/restaurants/* to restaurant service
app.use('/api/restaurants', restaurantService);
```

**Benefits:**
1. ✅ **Single Entry Point**: Clients only know one URL
2. ✅ **Security**: Hide internal service structure
3. ✅ **SSL Termination**: Handle HTTPS at proxy level
4. ✅ **Request Routing**: Direct traffic to correct service
5. ✅ **CORS Handling**: Centralized CORS configuration

**Production Tools:**
- **Nginx**: High-performance reverse proxy
- **Traefik**: Modern reverse proxy with auto-discovery
- **HAProxy**: Load balancer and reverse proxy

### **Slide 9: Reverse Proxy Flow**

```
Client Request: GET /api/restaurants
         ↓
┌────────────────────────┐
│   Reverse Proxy        │
│   (local-server.js)    │
│   - Parse URL          │
│   - Route to service   │
│   - Return response    │
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│  Restaurant Service    │
│  Handle GET request    │
│  Query database        │
│  Return JSON           │
└────────────────────────┘
```

**Demo:**
- Show `local-server.js` code
- Demonstrate request routing
- Show CORS configuration
- Test API call through proxy

---

## **Part 6: Load Balancing (3 minutes)**

### **Slide 10: Load Balancing Concept**

**What is Load Balancing?**
- Distribute incoming requests across multiple service instances
- Improve performance and availability
- Prevent single point of failure

**Load Balancing Strategies:**

1. **Round Robin**: Distribute requests equally
```
Request 1 → Instance A
Request 2 → Instance B
Request 3 → Instance C
Request 4 → Instance A (repeat)
```

2. **Least Connections**: Send to instance with fewest active connections

3. **IP Hash**: Same client always goes to same instance

### **Slide 11: Load Balancing Architecture**

```
                    Client Requests
                          ↓
              ┌───────────────────────┐
              │   Load Balancer       │
              │   (Nginx/HAProxy)     │
              └───────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Auth Service │  │ Auth Service │  │ Auth Service │
│  Instance 1  │  │  Instance 2  │  │  Instance 3  │
│  Port 3001   │  │  Port 3011   │  │  Port 3021   │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Implementation Example (Nginx):**
```nginx
upstream auth_service {
    server localhost:3001;
    server localhost:3011;
    server localhost:3021;
}

server {
    location /api/auth {
        proxy_pass http://auth_service;
    }
}
```

**Benefits:**
- ✅ High Availability
- ✅ Scalability
- ✅ Performance
- ✅ Fault Tolerance

---

## **Part 7: Multi-Machine Deployment (3 minutes)**

### **Slide 12: Deployment Architecture**

**Current Setup:**
- **Frontend**: Vercel (Cloud - Multiple regions)
- **Backend**: Local development (localhost:3000)
- **Database**: Local PostgreSQL

**Production Multi-Machine Setup:**

```
┌─────────────────────────────────────────────────────┐
│              Cloud Provider (AWS/Azure)             │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Machine 1  │  │   Machine 2  │  │ Machine 3│ │
│  │              │  │              │  │          │ │
│  │ Auth Service │  │ Restaurant   │  │ Order    │ │
│  │ User Service │  │ Menu Service │  │ Payment  │ │
│  │              │  │              │  │ Delivery │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │        Database Cluster (PostgreSQL)         │  │
│  │  Primary + Replicas across machines          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### **Slide 13: Deployment Options**

**1. Container-based (Docker + Kubernetes)**
```yaml
# docker-compose.yml
services:
  auth-service:
    image: food-delivery/auth:latest
    deploy:
      replicas: 3
      
  restaurant-service:
    image: food-delivery/restaurant:latest
    deploy:
      replicas: 2
```

**2. Cloud Platforms**
- **Vercel**: Frontend (Already deployed ✅)
- **Render**: Backend services
- **AWS ECS**: Container orchestration
- **Google Cloud Run**: Serverless containers

**3. Our Deployment**
- Frontend: Vercel (https://fooddelevryapp.vercel.app)
- Backend: Can deploy to Render, AWS, or Azure
- Database: Neon PostgreSQL (Cloud)

**Demo:**
- Show Vercel deployment
- Show environment variables
- Explain how to deploy backend to cloud

---

## **Part 8: Fault Tolerance (Tolérance aux pannes) (3 minutes)**

### **Slide 14: Fault Tolerance Strategies**

**1. Health Checks**
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});
```

**2. Circuit Breaker Pattern**
```
Normal State → Failure Detected → Circuit Open
                                      ↓
                              (Reject requests)
                                      ↓
                              After timeout
                                      ↓
                              Half-Open (Test)
                                      ↓
                              Success → Close
```

**3. Retry Logic**
```javascript
async function callServiceWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
}
```

**4. Database Replication**
```
Primary DB (Write) → Replica 1 (Read)
                  → Replica 2 (Read)
                  → Replica 3 (Read)
```

### **Slide 15: Fault Tolerance Implementation**

**Our Implementation:**

1. ✅ **Try-Catch Blocks**: Error handling in all services
2. ✅ **Database Connection Pooling**: Automatic reconnection
3. ✅ **Health Endpoints**: Monitor service status
4. ✅ **Graceful Degradation**: Service continues if one fails

**Example:**
```javascript
try {
  const restaurants = await db.query('SELECT * FROM restaurants');
  res.json({ success: true, data: restaurants });
} catch (error) {
  console.error('Database error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Service temporarily unavailable' 
  });
}
```

**Production Enhancements:**
- **Service Mesh** (Istio): Automatic retry, timeout, circuit breaker
- **Monitoring** (Prometheus + Grafana): Real-time metrics
- **Alerting** (PagerDuty): Notify team of failures
- **Backup Services**: Standby instances ready to take over

---

## **Part 9: Live Demonstration (5 minutes)**

### **Demo Script:**

**1. Show Running Services (1 min)**
```bash
# Terminal 1: Start server
npm start

# Show all 8 services loading
# Show health check
curl http://localhost:3000/health
```

**2. Test Authentication (1 min)**
```bash
# Login as customer
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@example.com","password":"password123"}'

# Show JWT token returned
```

**3. Browse Restaurants (1 min)**
```bash
# Get all restaurants
curl http://localhost:3000/api/restaurants

# Show 5 restaurants with data
```

**4. Postman Collection (2 min)**
- Open Postman
- Import collection
- Show organized endpoints
- Test 2-3 endpoints live
- Show automatic token management

---

## **Part 10: Conclusion (2 minutes)**

### **Slide 16: Project Summary**

**Achievements:**
- ✅ 8 Microservices implemented
- ✅ 47 API endpoints
- ✅ PostgreSQL database with seed data
- ✅ Frontend deployed on Vercel
- ✅ Complete API documentation
- ✅ Postman collection for testing

**Technologies Used:**
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Vite, TailwindCSS
- **Database**: PostgreSQL
- **Deployment**: Vercel (Frontend), Local (Backend)
- **Testing**: Postman, cURL

### **Slide 17: Future Improvements**

1. **Service Registry**: Implement Consul for dynamic discovery
2. **Load Balancer**: Add Nginx for multiple instances
3. **Containerization**: Docker + Kubernetes
4. **Monitoring**: Prometheus + Grafana
5. **CI/CD**: GitHub Actions for automated deployment
6. **Message Queue**: RabbitMQ for async communication
7. **Caching**: Redis for performance
8. **API Gateway**: Kong or AWS API Gateway

### **Slide 18: Q&A**
- Thank you
- Questions?

---

## **📹 Recording Tips**

### **Software Recommendations:**
1. **Screen Recording**: OBS Studio (Free), Camtasia, or Zoom
2. **PowerPoint**: Microsoft PowerPoint or Google Slides
3. **Video Editing**: DaVinci Resolve (Free), iMovie, or Shotcut

### **Recording Setup:**
1. **Record in segments**: Record each part separately, then combine
2. **Show your face**: Picture-in-picture for introduction and conclusion
3. **Clear audio**: Use good microphone, quiet environment
4. **Screen resolution**: 1920x1080 (Full HD)
5. **Frame rate**: 30 FPS minimum

### **Video Structure:**
```
00:00 - 02:00  Introduction + Team
02:00 - 05:00  Global Architecture
05:00 - 09:00  Service Layer
09:00 - 11:00  Registry Layer
11:00 - 14:00  Reverse Proxy
14:00 - 17:00  Load Balancing
17:00 - 20:00  Multi-Machine Deployment
20:00 - 23:00  Fault Tolerance
23:00 - 28:00  Live Demo
28:00 - 30:00  Conclusion + Q&A
```

### **What to Record:**
1. ✅ PowerPoint slides with voiceover
2. ✅ Screen recording of code
3. ✅ Terminal showing commands
4. ✅ Postman testing
5. ✅ Browser showing frontend
6. ✅ Architecture diagrams

---

## **📄 PDF Report Structure**

### **Report Sections:**

1. **Cover Page**
   - Project title
   - Team members
   - Date
   - University/Course

2. **Table of Contents**

3. **Introduction**
   - Project overview
   - Objectives
   - Technologies

4. **Architecture Globale**
   - System architecture diagram
   - Component description
   - Communication flow

5. **Couche Service**
   - Each microservice description
   - API endpoints
   - Database schema

6. **Couche Registry**
   - Service discovery approach
   - Registration mechanism

7. **Reverse Proxy**
   - Implementation details
   - Configuration
   - Benefits

8. **Load Balancing**
   - Strategy used
   - Configuration
   - Performance benefits

9. **Déploiement Multi-machines**
   - Deployment architecture
   - Cloud platforms used
   - Scalability approach

10. **Tolérance aux Pannes**
    - Fault tolerance mechanisms
    - Error handling
    - Recovery strategies

11. **Implementation Details**
    - Code snippets
    - Database schema
    - API documentation

12. **Testing**
    - Test scenarios
    - Postman collection
    - Results

13. **Conclusion**
    - Summary
    - Challenges faced
    - Future improvements

14. **Appendices**
    - Full API documentation
    - Code samples
    - Screenshots

---

## **✅ Checklist Before Submission**

### **Video:**
- [ ] All 7 topics covered
- [ ] Clear audio (no background noise)
- [ ] Good video quality (1080p)
- [ ] Live demonstration included
- [ ] PowerPoint slides visible
- [ ] Code demonstrations clear
- [ ] 15-30 minutes duration
- [ ] Exported in MP4 format

### **PowerPoint:**
- [ ] Professional design
- [ ] Clear diagrams
- [ ] Code examples
- [ ] Architecture diagrams
- [ ] Consistent formatting
- [ ] No spelling errors

### **PDF Report:**
- [ ] All sections complete
- [ ] Proper formatting
- [ ] Diagrams included
- [ ] Code snippets
- [ ] Table of contents
- [ ] Page numbers
- [ ] References

### **Demonstration:**
- [ ] Server running
- [ ] Database seeded
- [ ] Postman collection ready
- [ ] All endpoints tested
- [ ] Frontend accessible

---

## **🎬 Final Tips**

1. **Practice**: Rehearse your presentation 2-3 times
2. **Time Management**: Keep each section within time limit
3. **Clarity**: Speak clearly and at moderate pace
4. **Enthusiasm**: Show passion for your project
5. **Backup**: Have backup recordings in case of issues
6. **Professional**: Dress professionally if showing face
7. **Lighting**: Good lighting if showing face
8. **Transitions**: Smooth transitions between topics

**Good luck with your presentation! 🚀**
