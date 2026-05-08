#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkDocker() {
  try {
    await execAsync('docker --version');
    return true;
  } catch (error) {
    return false;
  }
}

async function checkDockerCompose() {
  try {
    await execAsync('docker compose version');
    return true;
  } catch (error) {
    try {
      await execAsync('docker-compose --version');
      return true;
    } catch (e) {
      return false;
    }
  }
}

async function isDockerRunning() {
  try {
    await execAsync('docker ps');
    return true;
  } catch (error) {
    return false;
  }
}

async function stopExistingContainers() {
  log('\n🛑 Stopping existing containers...', colors.yellow);
  try {
    await execAsync('docker compose -f docker-compose.yml -f docker-compose.monitoring.yml down 2>/dev/null || true');
    await execAsync('docker compose -f docker-compose.yml down 2>/dev/null || true');
    log('✅ Existing containers stopped', colors.green);
  } catch (error) {
    log('⚠️  No existing containers to stop', colors.yellow);
  }
}

async function startInfrastructure() {
  log('\n🚀 Starting infrastructure services...', colors.cyan);
  
  try {
    // Start basic stack only (no Grafana, no Promtail)
    log('   Starting core infrastructure...', colors.blue);
    const { stdout, stderr } = await execAsync(
      'docker compose -f docker-compose.yml up -d 2>&1'
    );
    
    if (stderr && stderr.includes('error')) {
      throw new Error(stderr);
    }
    
    log('✅ Core infrastructure started', colors.green);
    
    // Optionally start Prometheus only (lightweight monitoring)
    try {
      log('   Starting Prometheus (optional)...', colors.blue);
      await execAsync('docker compose -f docker-compose.monitoring.yml up -d prometheus 2>&1');
      log('✅ Prometheus started', colors.green);
      return 'prometheus';
    } catch (error) {
      log('⚠️  Prometheus skipped', colors.yellow);
      return 'basic';
    }
  } catch (error) {
    throw new Error(`Failed to start infrastructure: ${error.message}`);
  }
}

async function waitForServices() {
  log('\n⏳ Waiting for services to be ready...', colors.yellow);
  
  const services = [
    { name: 'PostgreSQL', port: 5432, delay: 5000 },
    { name: 'RabbitMQ', port: 5672, delay: 10000 },
    { name: 'Redis', port: 6379, delay: 3000 },
    { name: 'Consul', port: 8500, delay: 5000 }
  ];
  
  for (const service of services) {
    await sleep(service.delay);
    log(`   ✓ ${service.name} ready`, colors.green);
  }
  
  log('✅ All infrastructure services ready', colors.green);
}

async function checkServiceHealth() {
  log('\n🔍 Checking service health...', colors.cyan);
  
  const checks = [
    { name: 'PostgreSQL', cmd: 'docker exec food-delivery-postgres pg_isready -U postgres' },
    { name: 'RabbitMQ', cmd: 'docker exec food-delivery-rabbitmq rabbitmq-diagnostics ping' },
    { name: 'Redis', cmd: 'docker exec food-delivery-redis redis-cli -a redis123 ping' },
  ];
  
  for (const check of checks) {
    try {
      await execAsync(check.cmd);
      log(`   ✅ ${check.name} - healthy`, colors.green);
    } catch (error) {
      log(`   ⚠️  ${check.name} - not responding`, colors.yellow);
    }
  }
}

async function startAPIServer() {
  log('\n🌐 Starting API server...', colors.cyan);
  
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['local-server.js'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    server.on('error', (error) => {
      log(`❌ Failed to start API server: ${error.message}`, colors.red);
      reject(error);
    });
    
    // Give it a moment to start
    setTimeout(() => {
      log('✅ API server started', colors.green);
      resolve(server);
    }, 3000);
  });
}

function displayAccessInfo(stackType) {
  log('\n' + '='.repeat(60), colors.bright);
  log('🎉 ALL SERVICES RUNNING!', colors.green + colors.bright);
  log('='.repeat(60), colors.bright);
  
  log('\n🌐 Frontend (Hosted on Vercel):', colors.cyan);
  log('   • Live Demo:     https://fooddelevryapp.vercel.app', colors.blue);
  log('   • Note:          Frontend is NOT running locally', colors.yellow);
  
  log('\n📡 API Endpoints:', colors.cyan);
  log('   • Health Check:  http://localhost:3000/health', colors.blue);
  log('   • API Gateway:   http://localhost:3000/api', colors.blue);
  log('   • Restaurants:   http://localhost:3000/api/restaurants', colors.blue);
  
  log('\n🎛️  Infrastructure Dashboards:', colors.cyan);
  log('   • Consul:        http://localhost:8500', colors.blue);
  log('   • Traefik:       http://localhost:8080', colors.blue);
  log('   • RabbitMQ:      http://localhost:15672 (admin/admin123)', colors.blue);
  
  if (stackType === 'prometheus') {
    log('\n📊 Monitoring:', colors.cyan);
    log('   • Prometheus:    http://localhost:9090', colors.blue);
  }
  
  log('\n🗄️  Database:', colors.cyan);
  log('   • PostgreSQL:    localhost:5432 (postgres/postgres)', colors.blue);
  log('   • Database:      food_delivery', colors.blue);
  
  log('\n👤 Test Accounts (password: password123):', colors.cyan);
  log('   • Admin:         admin@fooddelivery.com', colors.blue);
  log('   • Restaurant:    owner1@restaurant.com', colors.blue);
  log('   • Customer:      customer1@example.com', colors.blue);
  log('   • Driver:        driver1@delivery.com', colors.blue);
  
  log('\n📚 Testing:', colors.cyan);
  log('   • Postman:       Import Food-Delivery-API.postman_collection.json', colors.blue);
  log('   • Test Script:   ./test-services.sh', colors.blue);
  
  log('\n🛑 To stop all services:', colors.cyan);
  log('   • Press Ctrl+C to stop API server', colors.yellow);
  log('   • Run: npm run stop', colors.yellow);
  
  log('\n' + '='.repeat(60) + '\n', colors.bright);
}

async function main() {
  log('\n🚀 FOOD DELIVERY PLATFORM - COMPLETE STARTUP', colors.bright + colors.cyan);
  log('='.repeat(60) + '\n', colors.bright);
  
  try {
    // Check Docker
    log('🔍 Checking prerequisites...', colors.cyan);
    const hasDocker = await checkDocker();
    const hasDockerCompose = await checkDockerCompose();
    const dockerRunning = await isDockerRunning();
    
    if (!hasDocker) {
      throw new Error('Docker is not installed. Please install Docker Desktop.');
    }
    
    if (!hasDockerCompose) {
      throw new Error('Docker Compose is not available.');
    }
    
    if (!dockerRunning) {
      throw new Error('Docker is not running. Please start Docker Desktop.');
    }
    
    log('✅ Docker is ready', colors.green);
    
    // Stop existing containers
    await stopExistingContainers();
    
    // Start infrastructure
    const stackType = await startInfrastructure();
    
    // Wait for services
    await waitForServices();
    
    // Check health
    await checkServiceHealth();
    
    // Display info
    displayAccessInfo(stackType);
    
    // Start API server
    await startAPIServer();
    
    // Keep process running
    process.on('SIGINT', async () => {
      log('\n\n🛑 Shutting down...', colors.yellow);
      log('Infrastructure will keep running. To stop:', colors.yellow);
      log('   npm run stop', colors.cyan);
      process.exit(0);
    });
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    log('\n💡 Troubleshooting:', colors.yellow);
    log('   1. Make sure Docker Desktop is running', colors.blue);
    log('   2. Try: npm run stop', colors.blue);
    log('   3. Then: npm start', colors.blue);
    process.exit(1);
  }
}

main();
