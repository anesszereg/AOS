const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6neHW1QUjIEs@ep-shiny-dew-amdo8vm1-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

console.log('🌱 Starting COMPLETE database seeding...\n');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedCompleteDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to Neon database\n');

    await client.query('BEGIN');

    // ========================================
    // 1. CREATE ALL TABLES
    // ========================================
    console.log('📋 Creating ALL tables for all services...\n');

    // ===== AUTH SERVICE TABLES =====
    console.log('🔐 Auth Service tables...');
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
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        revoked BOOLEAN DEFAULT false
      );
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
    `);

    // ===== USER SERVICE TABLES =====
    console.log('👤 User Service tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(20),
        avatar VARCHAR(500),
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        label VARCHAR(50),
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) DEFAULT 'USA',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS preferences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL,
        notifications_enabled BOOLEAN DEFAULT true,
        email_notifications BOOLEAN DEFAULT true,
        sms_notifications BOOLEAN DEFAULT true,
        push_notifications BOOLEAN DEFAULT true,
        language VARCHAR(10) DEFAULT 'en',
        currency VARCHAR(10) DEFAULT 'USD',
        dietary_restrictions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ===== RESTAURANT SERVICE TABLES =====
    console.log('🏪 Restaurant Service tables...');
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
        is_approved BOOLEAN DEFAULT false,
        logo_url TEXT,
        banner_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON restaurants(owner_id);
      CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
      CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON restaurants(is_active);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS business_hours (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL,
        day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
        open_time TIME,
        close_time TIME,
        is_closed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_business_hours_restaurant_id ON business_hours(restaurant_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL,
        customer_id UUID NOT NULL,
        order_id UUID,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
    `);

    // ===== MENU SERVICE TABLES =====
    console.log('🍕 Menu Service tables...');
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
        calories INTEGER,
        allergens JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
      CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
    `);

    // ===== ORDER SERVICE TABLES =====
    console.log('📦 Order Service tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL,
        restaurant_id UUID NOT NULL,
        driver_id UUID,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
        total_amount DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        delivery_fee DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        tip DECIMAL(10,2) DEFAULT 0,
        delivery_address_street VARCHAR(255),
        delivery_address_city VARCHAR(100),
        delivery_address_state VARCHAR(50),
        delivery_address_zip VARCHAR(20),
        special_instructions TEXT,
        estimated_delivery_time TIMESTAMP,
        actual_delivery_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_orders_driver_id ON orders(driver_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL,
        menu_item_id UUID NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL,
        status VARCHAR(50) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
    `);

    // ===== PAYMENT SERVICE TABLES =====
    console.log('💳 Payment Service tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID UNIQUE NOT NULL,
        customer_id UUID NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'paypal', 'cash', 'wallet')),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
        transaction_id VARCHAR(255),
        payment_gateway VARCHAR(50),
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
      CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        type VARCHAR(50) NOT NULL,
        card_last_four VARCHAR(4),
        card_brand VARCHAR(50),
        is_default BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
    `);

    // ===== DELIVERY SERVICE TABLES =====
    console.log('🚗 Delivery Service tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID UNIQUE NOT NULL,
        driver_id UUID NOT NULL,
        status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
        pickup_address_street VARCHAR(255),
        pickup_address_city VARCHAR(100),
        pickup_latitude DECIMAL(10, 8),
        pickup_longitude DECIMAL(11, 8),
        delivery_address_street VARCHAR(255),
        delivery_address_city VARCHAR(100),
        delivery_latitude DECIMAL(10, 8),
        delivery_longitude DECIMAL(11, 8),
        distance_km DECIMAL(10,2),
        estimated_time_minutes INTEGER,
        actual_time_minutes INTEGER,
        pickup_time TIMESTAMP,
        delivery_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);
      CREATE INDEX IF NOT EXISTS idx_deliveries_driver_id ON deliveries(driver_id);
      CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS driver_locations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        driver_id UUID NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        is_online BOOLEAN DEFAULT false,
        is_available BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_id ON driver_locations(driver_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS driver_earnings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        driver_id UUID NOT NULL,
        delivery_id UUID NOT NULL,
        base_fare DECIMAL(10,2) NOT NULL,
        distance_fare DECIMAL(10,2) DEFAULT 0,
        time_fare DECIMAL(10,2) DEFAULT 0,
        tip DECIMAL(10,2) DEFAULT 0,
        total_earnings DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_driver_earnings_driver_id ON driver_earnings(driver_id);
    `);

    // ===== NOTIFICATION SERVICE TABLES =====
    console.log('🔔 Notification Service tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('order', 'delivery', 'payment', 'promotion', 'system')),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        data JSONB,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL,
        email_enabled BOOLEAN DEFAULT true,
        sms_enabled BOOLEAN DEFAULT true,
        push_enabled BOOLEAN DEFAULT true,
        order_updates BOOLEAN DEFAULT true,
        promotions BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create triggers
    console.log('⚙️  Creating triggers...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    const tablesWithUpdatedAt = [
      'users', 'profiles', 'addresses', 'preferences', 'restaurants',
      'reviews', 'menu_items', 'orders', 'payments', 'payment_methods', 'deliveries'
    ];

    for (const table of tablesWithUpdatedAt) {
      await client.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at 
        BEFORE UPDATE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    console.log('✅ All tables and triggers created\n');

    // ========================================
    // 2. CLEAR EXISTING DATA
    // ========================================
    console.log('🗑️  Clearing existing data...');
    const tablesToClear = [
      'notifications', 'notification_preferences',
      'driver_earnings', 'driver_locations', 'deliveries',
      'payment_methods', 'payments',
      'order_status_history', 'order_items', 'orders',
      'menu_categories', 'menu_items',
      'business_hours', 'reviews', 'restaurants',
      'preferences', 'addresses', 'profiles',
      'password_resets', 'refresh_tokens', 'users'
    ];
    
    for (const table of tablesToClear) {
      await client.query(`DELETE FROM ${table}`);
    }
    console.log('✅ Existing data cleared\n');

    // ========================================
    // 3. SEED DATA
    // ========================================
    console.log('🌱 Seeding data...\n');

    const passwordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // Seed Users
    console.log('👥 Seeding users...');
    const customer1 = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'customer', true, true) RETURNING id`, ['customer1@example.com', passwordHash]);
    const customer2 = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'customer', true, true) RETURNING id`, ['customer2@example.com', passwordHash]);
    const restaurant1Owner = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'restaurant', true, true) RETURNING id`, ['restaurant1@example.com', passwordHash]);
    const restaurant2Owner = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'restaurant', true, true) RETURNING id`, ['restaurant2@example.com', passwordHash]);
    const restaurant3Owner = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'restaurant', true, true) RETURNING id`, ['restaurant3@example.com', passwordHash]);
    const driver1 = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'driver', true, true) RETURNING id`, ['driver1@example.com', passwordHash]);
    const driver2 = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'driver', true, true) RETURNING id`, ['driver2@example.com', passwordHash]);
    const admin = await client.query(`INSERT INTO users (email, password_hash, role, is_active, email_verified) VALUES ($1, $2, 'admin', true, true) RETURNING id`, ['admin@example.com', adminPasswordHash]);

    // Seed Profiles
    console.log('📝 Seeding profiles...');
    await client.query(`
      INSERT INTO profiles (user_id, name, phone) VALUES 
        ($1, 'John Doe', '+1 (555) 123-4567'),
        ($2, 'Jane Smith', '+1 (555) 987-6543'),
        ($3, 'Luigi Rossi', '+1 (555) 111-2222'),
        ($4, 'Sushi Master', '+1 (555) 333-4444'),
        ($5, 'Burger Boss', '+1 (555) 555-6666'),
        ($6, 'Bob Driver', '+1 (555) 777-8888'),
        ($7, 'Alice Wheeler', '+1 (555) 999-0000'),
        ($8, 'Admin User', '+1 (555) 000-1111')
    `, [customer1.rows[0].id, customer2.rows[0].id, restaurant1Owner.rows[0].id, restaurant2Owner.rows[0].id, restaurant3Owner.rows[0].id, driver1.rows[0].id, driver2.rows[0].id, admin.rows[0].id]);

    // Seed Addresses
    console.log('📍 Seeding addresses...');
    await client.query(`
      INSERT INTO addresses (user_id, label, street, city, state, zip_code, is_default) VALUES 
        ($1, 'Home', '456 Oak Ave', 'Naperville', 'IL', '60563', true),
        ($2, 'Home', '789 Pine Rd', 'Naperville', 'IL', '60540', true)
    `, [customer1.rows[0].id, customer2.rows[0].id]);

    // Seed Restaurants
    console.log('🏪 Seeding restaurants...');
    const luigis = await client.query(`
      INSERT INTO restaurants (owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, email, rating, total_reviews, delivery_fee, minimum_order, estimated_delivery_time, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id
    `, [restaurant1Owner.rows[0].id, "Luigi's Pizzeria", 'Italian', 'Authentic Italian cuisine with fresh ingredients', '123 Main St', 'Naperville', 'IL', '60540', '+1 (555) 123-4567', 'luigi@pizzeria.com', 4.7, 245, 3.99, 15.00, '30-45 min', true]);

    const sushiPalace = await client.query(`
      INSERT INTO restaurants (owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, email, rating, total_reviews, delivery_fee, minimum_order, estimated_delivery_time, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id
    `, [restaurant2Owner.rows[0].id, 'Sushi Palace', 'Japanese', 'Fresh sushi and authentic Japanese dishes', '555 Market St', 'Naperville', 'IL', '60563', '+1 (555) 333-4444', 'info@sushipalace.com', 4.8, 189, 4.99, 20.00, '40-50 min', true]);

    const burgerHouse = await client.query(`
      INSERT INTO restaurants (owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, email, rating, total_reviews, delivery_fee, minimum_order, estimated_delivery_time, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id
    `, [restaurant3Owner.rows[0].id, 'Burger House', 'American', 'Gourmet burgers and classic American favorites', '789 Elm St', 'Naperville', 'IL', '60540', '+1 (555) 555-6666', 'hello@burgerhouse.com', 4.5, 312, 2.99, 12.00, '25-35 min', true]);

    // Seed Menu Items
    console.log('🍕 Seeding menu items...');
    await client.query(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available, preparation_time, is_vegetarian) VALUES 
        ($1, 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 18.99, 'Pizza', true, 20, true),
        ($1, 'Pepperoni Pizza', 'Traditional pepperoni pizza with extra cheese', 20.99, 'Pizza', true, 20, false),
        ($1, 'Spaghetti Carbonara', 'Creamy pasta with bacon, eggs, and parmesan', 16.99, 'Pasta', true, 15, false),
        ($1, 'Fettuccine Alfredo', 'Rich and creamy Alfredo sauce', 15.99, 'Pasta', true, 15, true),
        ($1, 'Caesar Salad', 'Fresh romaine with Caesar dressing', 12.99, 'Salads', true, 10, true),
        ($1, 'Tiramisu', 'Classic Italian dessert', 8.99, 'Desserts', true, 5, true)
    `, [luigis.rows[0].id]);

    await client.query(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available, preparation_time) VALUES 
        ($1, 'California Roll', 'Crab, avocado, and cucumber roll', 12.99, 'Rolls', true, 15),
        ($1, 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo', 14.99, 'Rolls', true, 15),
        ($1, 'Salmon Nigiri', 'Fresh salmon over sushi rice (2 pieces)', 8.99, 'Nigiri', true, 10),
        ($1, 'Tuna Sashimi', 'Fresh sliced tuna (6 pieces)', 16.99, 'Sashimi', true, 10),
        ($1, 'Miso Soup', 'Traditional Japanese soup', 4.99, 'Soups', true, 5)
    `, [sushiPalace.rows[0].id]);

    await client.query(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available, preparation_time, is_vegetarian) VALUES 
        ($1, 'Classic Burger', 'Beef patty with lettuce, tomato, onion', 12.99, 'Burgers', true, 15, false),
        ($1, 'Cheeseburger', 'Classic burger with cheddar cheese', 13.99, 'Burgers', true, 15, false),
        ($1, 'Bacon Burger', 'Burger with crispy bacon and BBQ sauce', 15.99, 'Burgers', true, 18, false),
        ($1, 'French Fries', 'Crispy golden fries', 4.99, 'Sides', true, 10, true),
        ($1, 'Onion Rings', 'Crispy battered onion rings', 5.99, 'Sides', true, 12, true),
        ($1, 'Milkshake', 'Creamy vanilla milkshake', 6.99, 'Drinks', true, 5, true)
    `, [burgerHouse.rows[0].id]);

    // Seed Driver Locations
    console.log('📍 Seeding driver locations...');
    await client.query(`
      INSERT INTO driver_locations (driver_id, latitude, longitude, is_online, is_available) VALUES 
        ($1, 41.7508, -88.1535, true, true),
        ($2, 41.7678, -88.1490, true, true)
    `, [driver1.rows[0].id, driver2.rows[0].id]);

    await client.query('COMMIT');

    console.log('\n✅✅✅ COMPLETE DATABASE SEEDED SUCCESSFULLY! ✅✅✅\n');
    console.log('📊 Summary:');
    console.log('  ✅ 8 Users (2 customers, 3 restaurant owners, 2 drivers, 1 admin)');
    console.log('  ✅ 8 User Profiles');
    console.log('  ✅ 2 Customer Addresses');
    console.log('  ✅ 3 Restaurants (Italian, Japanese, American)');
    console.log('  ✅ 17 Menu Items');
    console.log('  ✅ 2 Driver Locations');
    console.log('  ✅ ALL service tables created (Auth, User, Restaurant, Menu, Order, Payment, Delivery, Notification)\n');
    console.log('🔐 Test Credentials:');
    console.log('  Customer:   customer1@example.com / password123');
    console.log('  Restaurant: restaurant1@example.com / password123');
    console.log('  Driver:     driver1@example.com / password123');
    console.log('  Admin:      admin@example.com / admin123\n');
    console.log('🚀 Your database is fully ready for all microservices!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

seedCompleteDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
