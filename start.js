#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Food Delivery Platform...\n');

// Check if node_modules exists
const fs = require('fs');
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

// Build services
console.log('\n🔨 Building services...');
const services = ['auth', 'user', 'restaurant', 'menu', 'order', 'payment', 'delivery', 'notification'];

for (const service of services) {
  const servicePath = path.join('services', `${service}-service`);
  if (fs.existsSync(servicePath)) {
    console.log(`Building ${service}-service...`);
    try {
      execSync(`cd ${servicePath} && npm run build`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`⚠️  ${service}-service build had issues, continuing...`);
    }
  }
}

console.log('\n✅ Build complete!\n');
console.log('Starting server...\n');

// Start the server
require('./local-server.js');
