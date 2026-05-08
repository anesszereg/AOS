# Figma AI Design Prompt - Food Delivery Platform Presentation

## 🎨 Complete Design Prompt for AI Design Tools

---

## **MAIN PROMPT:**

```
Create a professional PowerPoint/Figma presentation for a university project about a Food Delivery Platform using Microservices Architecture. The presentation should be modern, technical, and visually appealing for a computer science/distributed systems course.

PROJECT DETAILS:
- Title: Food Delivery Platform - Microservices Architecture
- Team: ANESS ZEREG, NASSIM ZOUAOUI, RAYAN ZEROUKI, BENZAOUI MOHAMMED
- Course: AOS (Advanced Operating Systems)
- Date: May 2026
- Total Slides: 32
- Theme: Technical, Modern, Professional

DESIGN REQUIREMENTS:
- Style: Modern, clean, technical
- Color Scheme: Blue (#2563EB) primary, Green (#10B981) secondary, Orange (#F59E0B) accent
- Fonts: Montserrat Bold for headings, Open Sans for body, Fira Code for code
- Layout: Consistent, professional, easy to read
- Visual Elements: Architecture diagrams, flowcharts, code snippets, icons
- Aspect Ratio: 16:9 (1920x1080)

SLIDE BREAKDOWN:
32 slides covering: Introduction, Global Architecture, Service Layer, Registry Layer, Reverse Proxy, Load Balancing, Multi-Machine Deployment, Fault Tolerance, Demo, and Conclusion.
```

---

## **DETAILED SLIDE-BY-SLIDE PROMPTS:**

### **Slide 1: Title Slide**
```
Create a professional title slide with:
- Large bold title: "Food Delivery Platform - Microservices Architecture"
- Subtitle: "Distributed Systems Project"
- Team members: ANESS ZEREG, NASSIM ZOUAOUI, RAYAN ZEROUKI, BENZAOUI MOHAMMED
- Course: AOS
- Date: May 2026
- Background: Modern gradient (blue to dark blue)
- Include: Microservices icon, cloud icon, or abstract tech pattern
- Style: Professional, clean, modern
- Font: Montserrat Bold for title, Open Sans for details
```

### **Slide 2: Agenda**
```
Create an agenda slide with:
- Title: "Agenda" or "Table of Contents"
- 8 numbered items with icons:
  1. 🏗️ Global Architecture
  2. ⚙️ Service Layer
  3. 📋 Registry Layer
  4. 🔄 Reverse Proxy
  5. ⚖️ Load Balancing
  6. 🌐 Multi-Machine Deployment
  7. 🛡️ Fault Tolerance
  8. 💻 Live Demonstration
- Layout: Two columns, clean icons
- Background: Light with subtle pattern
- Style: Minimalist, organized
```

### **Slide 3: Project Overview**
```
Create a project overview slide with:
- Title: "What is Our Project?"
- Content in cards/boxes:
  * Platform: Food delivery application
  * Architecture: Microservices-based
  * Services: 8 independent microservices
  * Frontend: React.js (Vercel)
  * Backend: Node.js + Express
  * Database: PostgreSQL
  * API Endpoints: 47 total
- Include: App mockup or smartphone illustration
- Icons: For each technology (React, Node.js, PostgreSQL)
- Layout: Grid or card-based
- Colors: Use brand colors for highlights
```

### **Slide 4: Global Architecture Diagram**
```
Create an architecture diagram slide with:
- Title: "Architecture Globale - System Overview"
- Main diagram showing 4 layers:
  1. Frontend Layer (React - Vercel) at top
  2. API Gateway Layer (Port 3000) below
  3. Service Layer (8 microservices) in middle
  4. Database Layer (PostgreSQL) at bottom
- Visual style: Modern flowchart with arrows
- Colors: Different color for each layer
- Icons: Cloud for frontend, gateway icon, service boxes, database cylinder
- Arrows: Show data flow between layers
- Labels: Clear, readable text
- Background: White or light gray
```

### **Slide 5: Architecture Layers**
```
Create a layered architecture slide with:
- Title: "System Layers"
- 4 horizontal layers stacked:
  1. Presentation Layer (React, Responsive UI, Vercel)
  2. API Gateway Layer (Entry point, Routing, CORS)
  3. Service Layer (8 microservices, Business logic)
  4. Data Layer (PostgreSQL, Persistence, Transactions)
- Each layer: Different color, icon, 3 bullet points
- Style: Stacked boxes with shadows
- Layout: Full width, equal height
- Visual: Modern, clean separation
```

### **Slide 6: Microservices Table**
```
Create a services overview slide with:
- Title: "Service Layer - 8 Microservices"
- Professional table with 3 columns:
  * Service Name (with icon)
  * Port Number
  * Responsibility
- 8 rows:
  1. Auth (3001) - Authentication & Authorization
  2. User (3002) - User Management
  3. Restaurant (3003) - Restaurant CRUD
  4. Menu (3004) - Menu Management
  5. Order (3005) - Order Processing
  6. Payment (3006) - Payment Handling
  7. Delivery (3007) - Delivery Tracking
  8. Notification (3008) - Notifications
- Style: Modern table with alternating row colors
- Icons: Unique icon for each service
- Colors: Brand colors for headers
```

### **Slide 7: Service Architecture Pattern**
```
Create a service structure diagram with:
- Title: "Microservice Architecture Pattern"
- Vertical flow diagram showing:
  1. API Routes (Express Endpoints) - top
  2. Controllers (Request Handling)
  3. Business Logic (Service Layer)
  4. Database Access (PostgreSQL Pool) - bottom
- Include code snippet on right side:
  // routes/auth.routes.ts
  router.post('/login', authController.login);
  
  // controllers/auth.controller.ts
  async login(req, res) {
    const result = await authService.authenticate(req.body);
    res.json(result);
  }
- Layout: Diagram on left (40%), code on right (60%)
- Style: Modern flowchart with code syntax highlighting
- Colors: Blue for diagram, dark theme for code
```

### **Slide 8: Service Independence**
```
Create a principles slide with:
- Title: "Microservices Principles"
- 5 cards/boxes with icons and text:
  ✅ Single Responsibility - Each service has one clear purpose
  ✅ Independent Deployment - Deploy without affecting others
  ✅ Technology Agnostic - Can use different tech stacks
  ✅ Database per Service - Own data management
  ✅ API Communication - REST APIs for interaction
- Layout: Grid (2x3) or circular arrangement
- Style: Cards with icons, shadows, hover effect
- Colors: Green checkmarks, blue backgrounds
- Icons: Unique icon for each principle
```

### **Slide 9: Service Communication**
```
Create a communication flow diagram with:
- Title: "Inter-Service Communication"
- Diagram showing:
  * Client at top
  * API Gateway in middle
  * 3 services below (Auth, Restaurant, Order)
  * Arrows showing request flow
  * Side panel showing:
    - Synchronous: REST API calls
    - Asynchronous: Message queues (future)
    - Protocol: HTTP/JSON
- Style: Modern flowchart with clear arrows
- Colors: Different color for each service
- Icons: API icons, HTTP icons
- Layout: Centered diagram with legend
```

### **Slide 10: Service Registry Concept**
```
Create a registry concept slide with:
- Title: "Couche Registry - Service Discovery"
- Left side: "What is Service Registry?"
  * Central directory of all services
  * Dynamic service registration
  * Health monitoring
  * Load balancing support
- Right side: Benefits list with icons
  ✓ Automatic service discovery
  ✓ Dynamic scaling
  ✓ Fault tolerance
  ✓ No hardcoded URLs
- Center: Simple registry diagram
- Style: Split layout, modern icons
- Colors: Blue for registry, green for benefits
```

### **Slide 11: Registry Implementation**
```
Create a code comparison slide with:
- Title: "Service Registration"
- Two columns:
  LEFT: "Current Approach (Static)"
  Code snippet:
  // local-server.js
  app.use('/api/auth', authService);
  app.use('/api/restaurants', restaurantService);
  
  RIGHT: "Production Approach (Dynamic - Consul)"
  Code snippet:
  consul.agent.service.register({
    name: 'auth-service',
    address: 'localhost',
    port: 3001,
    check: {
      http: 'http://localhost:3001/health',
      interval: '10s'
    }
  });
- Style: Side-by-side code blocks
- Syntax highlighting: JavaScript
- Background: Dark theme for code
- Labels: Clear headers for each approach
```

### **Slide 12: Service Discovery Flow**
```
Create a process flow diagram with:
- Title: "How Service Discovery Works"
- 6-step vertical flow:
  1. Service Startup (icon: rocket)
  2. Register with Consul (icon: registry)
  3. Health Checks (icon: heartbeat)
  4. Client Queries Registry (icon: search)
  5. Registry Returns Service Location (icon: map)
  6. Client Calls Service (icon: connection)
- Bottom: Tools logos (Consul, Eureka, etcd)
- Style: Vertical timeline with icons
- Colors: Progressive blue gradient
- Arrows: Clear downward flow
```

### **Slide 13: Reverse Proxy Concept**
```
Create a reverse proxy diagram with:
- Title: "Reverse Proxy Architecture"
- Left side: "What is Reverse Proxy?"
  * Intermediary server
  * Single entry point
  * Routes requests to backend
- Right side: Simple diagram
  Internet → [Reverse Proxy] → Service A
                              → Service B
                              → Service C
- Style: Clean diagram with clear flow
- Icons: Cloud for internet, proxy box, service boxes
- Colors: Orange for proxy, blue for services
- Layout: 50/50 split
```

### **Slide 14: Reverse Proxy Implementation**
```
Create an implementation slide with:
- Title: "Implementation - local-server.js"
- 3 feature boxes:
  1. Request Routing (with code)
  2. CORS Handling (with code)
  3. SSL Termination (text)
- Code snippets with syntax highlighting
- Icons for each feature
- Style: Card-based layout
- Colors: Different color per feature
- Background: Light with code blocks in dark theme
```

### **Slide 15: Reverse Proxy Benefits**
```
Create a benefits grid with:
- Title: "Why Use Reverse Proxy?"
- 4 quadrants:
  1. 🔒 Security (Hide structure, Centralized auth)
  2. ⚡ Performance (Caching, Compression, Load balancing)
  3. 🔄 Flexibility (Easy updates, A/B testing, Canary)
  4. 📊 Monitoring (Centralized logging, Request tracking)
- Style: 2x2 grid with icons
- Colors: Different color per quadrant
- Icons: Large, modern icons
- Layout: Equal quadrants with shadows
```

### **Slide 16: Load Balancing Concept**
```
Create a load balancing diagram with:
- Title: "Load Balancing"
- Top: "What is Load Balancing?"
  * Distribute traffic across servers
  * Improve performance
  * Increase availability
  * Prevent overload
- Center: Diagram showing:
  Load Balancer at top
  3 servers below with equal distribution
- Style: Modern flowchart
- Colors: Green for load balancer, blue for servers
- Arrows: Show traffic distribution
- Icons: Balance scale, servers
```

### **Slide 17: Load Balancing Algorithms**
```
Create an algorithms comparison slide with:
- Title: "Distribution Strategies"
- 4 algorithm boxes:
  1. Round Robin (circular diagram)
  2. Least Connections (bar chart)
  3. IP Hash (hash icon)
  4. Weighted Round Robin (weighted diagram)
- Each box: Icon, name, brief description, visual
- Style: Grid layout (2x2)
- Colors: Different color per algorithm
- Visuals: Simple diagrams showing how each works
```

### **Slide 18: Load Balancing Configuration**
```
Create a configuration slide with:
- Title: "Nginx Configuration Example"
- Large code block:
  upstream backend {
      least_conn;
      server localhost:3001 weight=3;
      server localhost:3011 weight=2;
      server localhost:3021 weight=1;
  }
  server {
      listen 80;
      location /api/ {
          proxy_pass http://backend;
      }
  }
- Right side: Benefits list
  ✓ High availability
  ✓ Scalability
  ✓ Performance
- Style: Code block with syntax highlighting
- Layout: 70% code, 30% benefits
- Background: Dark for code, light for benefits
```

### **Slide 19: Deployment Overview**
```
Create a deployment comparison slide with:
- Title: "Déploiement Multi-machines"
- Two columns:
  LEFT: "Current Deployment"
  * Frontend: Vercel (Global CDN)
  * Backend: Local development
  * Database: Local PostgreSQL
  
  RIGHT: "Production Deployment"
  * Frontend: Vercel (Multiple regions)
  * Backend: AWS/Azure (Multiple machines)
  * Database: Managed PostgreSQL cluster
- Icons for each platform
- Style: Side-by-side comparison
- Colors: Gray for current, green for production
```

### **Slide 20: Multi-Machine Architecture**
```
Create a production architecture diagram with:
- Title: "Production Architecture"
- Diagram showing:
  * Load Balancer (Nginx) at top
  * 3 machines below:
    - Machine 1: Auth, User
    - Machine 2: Restaurant, Menu
    - Machine 3: Order, Payment
  * Database Cluster at bottom (Primary + Replica)
- Style: Modern cloud architecture diagram
- Colors: Different color per machine
- Icons: Server icons, database icons
- Arrows: Show connections
- Background: Cloud pattern
```

### **Slide 21: Containerization**
```
Create a Docker/Kubernetes slide with:
- Title: "Docker & Kubernetes"
- Left: Docker Compose code snippet
- Right: Benefits list
  * Consistent environments
  * Easy scaling
  * Portability
- Bottom: Docker and Kubernetes logos
- Style: Code + benefits layout
- Colors: Docker blue, Kubernetes blue
- Icons: Container icons
- Background: Tech pattern
```

### **Slide 22: Cloud Platforms**
```
Create a cloud platforms slide with:
- Title: "Cloud Deployment"
- Current deployment box (green checkmark):
  ✅ Vercel - Frontend
  * Global CDN
  * Automatic HTTPS
  * Zero configuration
- Future options (4 boxes):
  * AWS ECS
  * Google Cloud Run
  * Azure Container Instances
  * Render
- Platform logos
- Style: Card-based layout
- Colors: Platform brand colors
```

### **Slide 23: Fault Tolerance Concept**
```
Create a fault tolerance intro slide with:
- Title: "Tolérance aux Pannes"
- Left: "What is Fault Tolerance?"
  * System continues despite failures
  * Graceful degradation
  * Automatic recovery
  * No data loss
- Right: "Types of Failures"
  * Service crashes
  * Network issues
  * Database failures
  * Hardware problems
- Center: Shield icon or protection visual
- Style: Split layout with icon
- Colors: Red for failures, green for tolerance
```

### **Slide 24: Fault Tolerance Strategies**
```
Create a strategies slide with:
- Title: "Implementation Strategies"
- 5 strategy cards:
  1. Health Checks (with code)
  2. Retry Logic (with code)
  3. Circuit Breaker (diagram)
  4. Timeouts (icon)
  5. Fallback Responses (icon)
- Each card: Icon, name, code/diagram
- Style: Grid layout with cards
- Colors: Different color per strategy
- Code: Syntax highlighted
```

### **Slide 25: Error Handling**
```
Create an error handling slide with:
- Title: "Graceful Error Handling"
- Large code example (try-catch block)
- Right side: Benefits
  ✓ Better user experience
  ✓ System stability
  ✓ Easy debugging
- Style: Code block + benefits
- Layout: 70% code, 30% benefits
- Syntax highlighting: JavaScript
- Colors: Red for errors, green for benefits
```

### **Slide 26: Database Fault Tolerance**
```
Create a database resilience slide with:
- Title: "Database Resilience"
- 4 strategy boxes:
  1. Connection Pooling (diagram)
  2. Replication (Primary → Replicas diagram)
  3. Backup & Recovery (icon)
  4. Monitoring (dashboard icon)
- Each box: Icon, title, description
- Style: 2x2 grid
- Colors: Blue for database theme
- Diagrams: Simple, clear visuals
```

### **Slide 27: Live Demo**
```
Create a demo slide with:
- Title: "Application Demonstration"
- Left: Demo plan checklist
  ✅ Start all services
  ✅ Health check
  ✅ User authentication
  ✅ Browse restaurants
  ✅ Create order
  ✅ Postman collection
- Right: Endpoints to show
  * POST /api/auth/login
  * GET /api/restaurants
  * GET /api/menu/restaurant/:id
  * POST /api/orders
- Style: Checklist + endpoint list
- Icons: Play button, API icons
- Colors: Green for demo theme
```

### **Slide 28: Technologies Used**
```
Create a tech stack slide with:
- Title: "Tech Stack"
- 4 columns:
  1. Backend (Node.js, Express, TypeScript, PostgreSQL, JWT)
  2. Frontend (React, Vite, TailwindCSS, Axios)
  3. Infrastructure (RabbitMQ/CloudAMQP, Redis/Upstash, Vercel, Neon)
  4. DevOps (Git, GitHub, Postman, Docker)
- Each technology: Logo + name
- Highlight implemented infrastructure with green badges
- Style: Grid of technology logos
- Layout: Equal columns
- Colors: Technology brand colors
- Background: Light with subtle pattern
- Special: Green checkmarks for RabbitMQ and Redis
```

### **Slide 29: Project Statistics**
```
Create a statistics slide with:
- Title: "By the Numbers"
- 7 large stat boxes:
  * 8 Microservices
  * 47 API Endpoints
  * 10 Test Users
  * 5 Restaurants
  * 25 Menu Items
  * 3 Sample Orders
  * 100% Test Coverage
- Style: Big numbers with icons
- Layout: Grid or circular
- Colors: Gradient backgrounds
- Animation: Count-up effect (if possible)
```

### **Slide 30: Infrastructure Components**
```
Create an infrastructure slide with:
- Title: "Infrastructure & Tools Implemented"
- Two sections:

IMPLEMENTED ✅ (Green theme):
  1. Message Queue - RabbitMQ (CloudAMQP)
     * Event-driven architecture
     * Async notifications
  2. Caching - Redis (Upstash)
     * Response caching
     * Performance optimization
  3. API Gateway - local-server.js
     * Request routing
     * CORS handling
  4. Service Registry - Static configuration
     * Service discovery
  5. Load Balancer - Ready for Nginx
     * Traffic distribution

FUTURE ENHANCEMENTS 🚀 (Blue theme):
  1. Service Mesh (Istio)
  2. Monitoring (Prometheus + Grafana)
  3. CI/CD (GitHub Actions)
  4. Kubernetes Orchestration
  5. Dynamic Service Discovery (Consul)

- Style: Two-column layout with checkmarks
- Icons: Technology logos
- Colors: Green for implemented, blue for future
```

### **Slide 31: Challenges & Solutions**
```
Create a lessons learned slide with:
- Title: "Lessons Learned"
- Two columns:
  LEFT: "Challenges" (red theme)
  * Service communication
  * Database schema design
  * Error handling
  * Deployment complexity
  
  RIGHT: "Solutions" (green theme)
  * Clear API contracts
  * Proper planning
  * Comprehensive testing
  * Documentation
- Style: Side-by-side comparison
- Icons: Problem icon, solution icon
- Colors: Red for challenges, green for solutions
```

### **Slide 32: Thank You**
```
Create a closing slide with:
- Large text: "Thank You!"
- Subtitle: "Questions?"
- Contact information:
  * GitHub: [Repository link]
  * Email: [Team email]
  * Documentation: See PDF Report
- Team members listed
- Style: Clean, professional
- Background: Gradient matching title slide
- Icons: GitHub, email, document icons
- Layout: Centered, minimal
```

---

## **DESIGN SPECIFICATIONS:**

### **Color Palette:**
```
Primary Blue: #2563EB
Secondary Green: #10B981
Accent Orange: #F59E0B
Background: #FFFFFF
Text Dark: #1F2937
Text Light: #6B7280
Code Background: #1E293B
Success: #22C55E
Error: #EF4444
Warning: #F59E0B
```

### **Typography:**
```
Headings: Montserrat Bold, 32-48px
Subheadings: Montserrat SemiBold, 24-28px
Body Text: Open Sans Regular, 16-18px
Code: Fira Code, 14-16px
Small Text: Open Sans Regular, 12-14px
```

### **Layout Guidelines:**
```
Slide Size: 1920x1080 (16:9)
Margins: 80px all sides
Title Area: Top 200px
Content Area: Remaining space
Footer: Bottom 60px (slide number, logo)
Grid: 12 columns
Spacing: 24px between elements
```

### **Visual Elements:**
```
Icons: Line style, 48-64px
Diagrams: Modern, flat design
Code Blocks: Dark theme, syntax highlighted
Tables: Alternating row colors, rounded corners
Cards: Subtle shadows, rounded corners (8px)
Arrows: Smooth, curved when appropriate
Buttons: Rounded (4px), subtle shadows
```

### **Animation Suggestions (if supported):**
```
Slide Transitions: Fade or slide (0.3s)
Element Entrance: Fade in from bottom
Diagrams: Build step-by-step
Code: Highlight line-by-line
Statistics: Count-up animation
```

---

## **EXPORT SETTINGS:**

```
Format: PowerPoint (.pptx) or PDF
Resolution: 1920x1080 (Full HD)
Quality: High
Fonts: Embedded
Images: High resolution (300 DPI)
File Size: Optimized (<50MB)
```

---

## **ADDITIONAL NOTES:**

- Keep text concise and readable
- Use consistent spacing throughout
- Ensure high contrast for readability
- Include slide numbers
- Add subtle footer with team name
- Use professional stock images where needed
- Maintain brand consistency
- Test readability on projector
- Export both editable and PDF versions

---

## **QUICK PROMPT FOR AI TOOLS:**

```
Create a 32-slide professional presentation for a Food Delivery Platform using Microservices Architecture. 

Style: Modern, technical, clean
Colors: Blue (#2563EB), Green (#10B981), Orange (#F59E0B)
Fonts: Montserrat Bold (headings), Open Sans (body), Fira Code (code)
Size: 1920x1080 (16:9)

Include: Architecture diagrams, code snippets, flowcharts, statistics, and professional layouts. 

Topics: Global Architecture, Service Layer, Registry, Reverse Proxy, Load Balancing, Multi-Machine Deployment, Fault Tolerance.

Team: ANESS ZEREG, NASSIM ZOUAOUI, RAYAN ZEROUKI, BENZAOUI MOHAMMED
Course: AOS, May 2026
```
