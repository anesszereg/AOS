#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function main() {
  log('\n🛑 Stopping all services...', colors.cyan);
  
  try {
    // Stop Docker containers
    log('   Stopping Docker containers...', colors.yellow);
    await execAsync('docker compose -f docker-compose.yml -f docker-compose.monitoring.yml down 2>/dev/null || docker compose -f docker-compose.yml down');
    log('✅ All containers stopped', colors.green);
    
    // Kill any process on port 3000
    try {
      const { stdout } = await execAsync('lsof -ti:3000');
      if (stdout.trim()) {
        await execAsync(`kill -9 ${stdout.trim()}`);
        log('✅ API server stopped', colors.green);
      }
    } catch (error) {
      // No process on port 3000
    }
    
    log('\n✅ All services stopped successfully!', colors.green);
    log('   Run "npm start" to start again\n', colors.cyan);
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.yellow);
  }
}

main();
