const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6neHW1QUjIEs@ep-shiny-dew-amdo8vm1-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

console.log('🌱 Starting database seeding...\n');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to Neon database\n');

    // Start transaction
    await client.query('BEGIN');

    // ========================================
    // 1. CREATE TABLES
    // ========================================
    console.log('📋 Creating tables...');

    // Users table (for auth service)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'restaurant', 'driver', 'admin')),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    // User profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(50),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Restaurants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        cuisine VARCHAR(100),
        description TEXT,
        address_street VARCHAR(255),
        address_city VARCHAR(100),
        address_state VARCHAR(50),
        address_zip VARCHAR(20),
        phone VARCHAR(50),
        email VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        delivery_fee DECIMAL(10,2) DEFAULT 0,
        minimum_order DECIMAL(10,2) DEFAULT 0,
        estimated_delivery_time VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Menu items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        preparation_time INTEGER DEFAULT 15,
        is_vegetarian BOOLEAN DEFAULT false,
        is_vegan BOOLEAN DEFAULT false,
        is_gluten_free BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL,
        restaurant_id UUID NOT NULL,
        driver_id UUID,
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        delivery_fee DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        delivery_address_street VARCHAR(255),
        delivery_address_city VARCHAR(100),
        delivery_address_state VARCHAR(50),
        delivery_address_zip VARCHAR(20),
        special_instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created\n');

    // ========================================
    // 2. SEED USERS
    // ========================================
    console.log('👥 Seeding users...');

    const passwordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // Customers
    const customer1 = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'customer', true, true)
      RETURNING id
    `, ['customer1@example.com', passwordHash]);

    const customer2 = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'customer', true, true)
      RETURNING id
    `, ['customer2@example.com', passwordHash]);

    // Restaurant owners
    const restaurant1Owner = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'restaurant', true, true)
      RETURNING id
    `, ['restaurant1@example.com', passwordHash]);

    const restaurant2Owner = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'restaurant', true, true)
      RETURNING id
    `, ['restaurant2@example.com', passwordHash]);

    const restaurant3Owner = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'restaurant', true, true)
      RETURNING id
    `, ['restaurant3@example.com', passwordHash]);

    // Drivers
    const driver1 = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'driver', true, true)
      RETURNING id
    `, ['driver1@example.com', passwordHash]);

    const driver2 = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'driver', true, true)
      RETURNING id
    `, ['driver2@example.com', passwordHash]);

    // Admin
    const admin = await client.query(`
      INSERT INTO users (email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, 'admin', true, true)
      RETURNING id
    `, ['admin@example.com', adminPasswordHash]);

    console.log('✅ Users seeded (8 users)');

    // ========================================
    // 3. SEED USER PROFILES
    // ========================================
    console.log('📝 Seeding user profiles...');

    await client.query(`
      INSERT INTO user_profiles (user_id, name, phone)
      VALUES 
        ($1, 'John Doe', '+1 (555) 123-4567'),
        ($2, 'Jane Smith', '+1 (555) 987-6543'),
        ($3, 'Luigi Rossi', '+1 (555) 111-2222'),
        ($4, 'Sushi Master', '+1 (555) 333-4444'),
        ($5, 'Burger Boss', '+1 (555) 555-6666'),
        ($6, 'Bob Driver', '+1 (555) 777-8888'),
        ($7, 'Alice Wheeler', '+1 (555) 999-0000'),
        ($8, 'Admin User', '+1 (555) 000-1111')
    `, [
      customer1.rows[0].id,
      customer2.rows[0].id,
      restaurant1Owner.rows[0].id,
      restaurant2Owner.rows[0].id,
      restaurant3Owner.rows[0].id,
      driver1.rows[0].id,
      driver2.rows[0].id,
      admin.rows[0].id
    ]);

    console.log('✅ User profiles seeded\n');

    // ========================================
    // 4. SEED RESTAURANTS
    // ========================================
    console.log('🏪 Seeding restaurants...');

    const luigis = await client.query(`
      INSERT INTO restaurants (
        owner_id, name, cuisine, description,
        address_street, address_city, address_state, address_zip,
        phone, email, rating, total_reviews,
        delivery_fee, minimum_order, estimated_delivery_time, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id
    `, [
      restaurant1Owner.rows[0].id,
      "Luigi's Pizzeria",
      'Italian',
      'Authentic Italian cuisine with fresh ingredients and traditional recipes',
      '123 Main St',
      'Naperville',
      'IL',
      '60540',
      '+1 (555) 123-4567',
      'luigi@pizzeria.com',
      4.7,
      245,
      3.99,
      15.00,
      '30-45 min',
      true
    ]);

    const sushiPalace = await client.query(`
      INSERT INTO restaurants (
        owner_id, name, cuisine, description,
        address_street, address_city, address_state, address_zip,
        phone, email, rating, total_reviews,
        delivery_fee, minimum_order, estimated_delivery_time, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id
    `, [
      restaurant2Owner.rows[0].id,
      'Sushi Palace',
      'Japanese',
      'Fresh sushi and authentic Japanese dishes',
      '555 Market St',
      'Naperville',
      'IL',
      '60563',
      '+1 (555) 333-4444',
      'info@sushipalace.com',
      4.8,
      189,
      4.99,
      20.00,
      '40-50 min',
      true
    ]);

    const burgerHouse = await client.query(`
      INSERT INTO restaurants (
        owner_id, name, cuisine, description,
        address_street, address_city, address_state, address_zip,
        phone, email, rating, total_reviews,
        delivery_fee, minimum_order, estimated_delivery_time, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id
    `, [
      restaurant3Owner.rows[0].id,
      'Burger House',
      'American',
      'Gourmet burgers and classic American favorites',
      '789 Elm St',
      'Naperville',
      'IL',
      '60540',
      '+1 (555) 555-6666',
      'hello@burgerhouse.com',
      4.5,
      312,
      2.99,
      12.00,
      '25-35 min',
      true
    ]);

    console.log('✅ Restaurants seeded (3 restaurants)\n');

    // ========================================
    // 5. SEED MENU ITEMS
    // ========================================
    console.log('🍕 Seeding menu items...');

    // Luigi's Pizzeria Menu
    await client.query(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available, preparation_time, is_vegetarian)
      VALUES 
        ($1, 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 18.99, 'Pizza', true, 20, true),
        ($1, 'Pepperoni Pizza', 'Traditional pepperoni pizza with extra cheese', 20.99, 'Pizza', true, 20, false),
        ($1, 'Spaghetti Carbonara', 'Creamy pasta with bacon, eggs, and parmesan', 16.99, 'Pasta', true, 15, false),
        ($1, 'Fettuccine Alfredo', 'Rich and creamy Alfredo sauce with fettuccine pasta', 15.99, 'Pasta', true, 15, true),
        ($1, 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 12.99, 'Salads', true, 10, true),
        ($1, 'Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers', 8.99, 'Desserts', true, 5, true)
    `, [luigis.rows[0].id]);

    // Sushi Palace Menu
    await client.query(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available, preparation_time)
      VALUES 
        ($1, 'California Roll', 'Crab, avocado, and cucumber roll', 12.99, 'Rolls', true, 15),
        ($1, 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo', 14.99, 'Rolls', true, 15),
        ($1, 'Salmon Nigiri', 'Fresh salmon over sushi rice (2 pieces)', 8.99, 'Nigiri', true, 10),
        ($1, 'Tuna Sashimi', 'Fresh sliced tuna (6 pieces)', 16.99, 'Sashimi', true, 10),
        ($1, 'Miso Soup', 'Traditional Japanese soup with tofu and seaweed', 4.99, 'Soups', true, 5)
    `, [sushiPalace.rows[0].id]);

    // Burger House Menu
    await client.query(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available, preparation_time, is_vegetarian)
      VALUES 
        ($1, 'Classic Burger', 'Beef patty with lettuce, tomato, onion, and special sauce', 12.99, 'Burgers', true, 15, false),
        ($1, 'Cheeseburger', 'Classic burger with melted cheddar cheese', 13.99, 'Burgers', true, 15, false),
        ($1, 'Bacon Burger', 'Burger topped with crispy bacon and BBQ sauce', 15.99, 'Burgers', true, 18, false),
        ($1, 'French Fries', 'Crispy golden fries', 4.99, 'Sides', true, 10, true),
        ($1, 'Onion Rings', 'Crispy battered onion rings', 5.99, 'Sides', true, 12, true),
        ($1, 'Milkshake', 'Creamy vanilla milkshake', 6.99, 'Drinks', true, 5, true)
    `, [burgerHouse.rows[0].id]);

    console.log('✅ Menu items seeded (17 items)\n');

    // Commit transaction
    await client.query('COMMIT');

    console.log('✅✅✅ DATABASE SEEDED SUCCESSFULLY! ✅✅✅\n');
    console.log('📊 Summary:');
    console.log('  - 8 Users (2 customers, 3 restaurant owners, 2 drivers, 1 admin)');
    console.log('  - 3 Restaurants (Italian, Japanese, American)');
    console.log('  - 17 Menu Items\n');
    console.log('🔐 Test Credentials:');
    console.log('  Customer:   customer1@example.com / password123');
    console.log('  Restaurant: restaurant1@example.com / password123');
    console.log('  Driver:     driver1@example.com / password123');
    console.log('  Admin:      admin@example.com / admin123\n');
    console.log('🚀 Your database is ready to use!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run seeder
seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
