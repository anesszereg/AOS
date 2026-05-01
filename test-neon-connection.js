const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_6neHW1QUjIEs@ep-shiny-dew-amdo8vm1-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

console.log('🔍 Testing Neon database connection...');
console.log('📍 Host: ep-shiny-dew-amdo8vm1-pooler.c-5.us-east-1.aws.neon.tech');
console.log('📦 Database: neondb');
console.log('');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    console.log('');
    
    console.log('📊 Running test query...');
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('✅ Query successful!');
    console.log('');
    
    console.log('📦 Database:', result.rows[0].current_database);
    console.log('👤 User:', result.rows[0].current_user);
    console.log('🐘 PostgreSQL Version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    console.log('');
    
    // Test creating a table
    console.log('🧪 Testing table creation...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table creation successful!');
    
    // Insert test data
    await client.query(`INSERT INTO connection_test (test_message) VALUES ('Connection test successful')`);
    console.log('✅ Data insertion successful!');
    
    // Query test data
    const testResult = await client.query('SELECT * FROM connection_test ORDER BY created_at DESC LIMIT 1');
    console.log('✅ Data query successful!');
    console.log('📝 Test message:', testResult.rows[0].test_message);
    console.log('');
    
    await client.end();
    console.log('✅✅✅ CONNECTION TEST PASSED! ✅✅✅');
    console.log('');
    console.log('🚀 Your Neon database is ready to use!');
    console.log('📋 Next step: Add this DATABASE_URL to Render environment variables');
    
  } catch (error) {
    console.error('');
    console.error('❌❌❌ CONNECTION FAILED! ❌❌❌');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    console.error('Details:', error);
    process.exit(1);
  }
}

testConnection();
