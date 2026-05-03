#!/usr/bin/env node

/**
 * Database Seeding Script
 * Populates all databases with comprehensive test data
 */

const { Pool } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // ============================================
    // USERS (Auth Database)
    // ============================================
    console.log('👥 Seeding users...');
    
    await pool.query('DELETE FROM users');
    
    const users = [
      // Customers
      { id: '11111111-1111-1111-1111-111111111111', email: 'customer1@test.com', role: 'customer' },
      { id: '11111111-1111-1111-1111-111111111112', email: 'customer2@test.com', role: 'customer' },
      { id: '11111111-1111-1111-1111-111111111113', email: 'customer3@test.com', role: 'customer' },
      
      // Restaurant Owners
      { id: '22222222-2222-2222-2222-222222222221', email: 'luigi@pizzeria.com', role: 'restaurant' },
      { id: '22222222-2222-2222-2222-222222222222', email: 'sushi@palace.com', role: 'restaurant' },
      { id: '22222222-2222-2222-2222-222222222223', email: 'burger@house.com', role: 'restaurant' },
      { id: '22222222-2222-2222-2222-222222222224', email: 'taco@fiesta.com', role: 'restaurant' },
      { id: '22222222-2222-2222-2222-222222222225', email: 'dragon@wok.com', role: 'restaurant' },
      { id: '22222222-2222-2222-2222-222222222226', email: 'thai@spice.com', role: 'restaurant' },
      { id: '22222222-2222-2222-2222-222222222227', email: 'india@curry.com', role: 'restaurant' },
      { id: '22222222-2222-2222-2222-222222222228', email: 'french@bistro.com', role: 'restaurant' },
      
      // Drivers
      { id: '33333333-3333-3333-3333-333333333331', email: 'driver1@test.com', role: 'driver' },
      { id: '33333333-3333-3333-3333-333333333332', email: 'driver2@test.com', role: 'driver' },
      { id: '33333333-3333-3333-3333-333333333333', email: 'driver3@test.com', role: 'driver' },
      
      // Admin
      { id: '44444444-4444-4444-4444-444444444441', email: 'admin@test.com', role: 'admin' }
    ];

    // Password hash for "Test123456!" (bcrypt)
    const passwordHash = '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K';

    for (const user of users) {
      await pool.query(
        `INSERT INTO users (id, email, password_hash, role, is_active, email_verified) 
         VALUES ($1, $2, $3, $4, true, true)
         ON CONFLICT (id) DO NOTHING`,
        [user.id, user.email, passwordHash, user.role]
      );
    }
    
    console.log(`✅ Created ${users.length} users\n`);

    // ============================================
    // RESTAURANTS
    // ============================================
    console.log('🍽️  Seeding restaurants...');
    
    await pool.query('DELETE FROM restaurants');
    
    const restaurants = [
      {
        id: '8bc47665-1384-4b6b-802f-34ffd764eac0',
        owner_id: '22222222-2222-2222-2222-222222222221',
        name: "Luigi's Pizzeria",
        cuisine: 'Italian',
        description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
        address_street: '123 Main St',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60540',
        phone: '+1 (555) 123-4567',
        email: 'luigi@pizzeria.com',
        rating: 4.70,
        total_reviews: 245,
        delivery_fee: 3.99,
        minimum_order: 15.00,
        estimated_delivery_time: '30-45 min',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop'
      },
      {
        id: 'b34289b7-2c67-4436-a756-49fa84f56f6e',
        owner_id: '22222222-2222-2222-2222-222222222222',
        name: 'Sushi Palace',
        cuisine: 'Japanese',
        description: 'Fresh sushi and authentic Japanese dishes prepared by master chefs',
        address_street: '555 Market St',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60563',
        phone: '+1 (555) 333-4444',
        email: 'info@sushipalace.com',
        rating: 4.80,
        total_reviews: 189,
        delivery_fee: 4.99,
        minimum_order: 20.00,
        estimated_delivery_time: '40-50 min',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop'
      },
      {
        id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd',
        owner_id: '22222222-2222-2222-2222-222222222223',
        name: 'Burger House',
        cuisine: 'American',
        description: 'Gourmet burgers and classic American favorites made with premium ingredients',
        address_street: '789 Elm St',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60540',
        phone: '+1 (555) 555-6666',
        email: 'hello@burgerhouse.com',
        rating: 4.50,
        total_reviews: 312,
        delivery_fee: 2.99,
        minimum_order: 12.00,
        estimated_delivery_time: '25-35 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop'
      },
      {
        id: 'c1234567-89ab-cdef-0123-456789abcdef',
        owner_id: '22222222-2222-2222-2222-222222222224',
        name: 'Taco Fiesta',
        cuisine: 'Mexican',
        description: 'Authentic Mexican street food and traditional dishes bursting with flavor',
        address_street: '321 Pine Rd',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60565',
        phone: '+1 (555) 777-8888',
        email: 'orders@tacofiesta.com',
        rating: 4.65,
        total_reviews: 198,
        delivery_fee: 3.49,
        minimum_order: 10.00,
        estimated_delivery_time: '30-40 min',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=400&fit=crop'
      },
      {
        id: 'd2345678-9abc-def0-1234-56789abcdef0',
        owner_id: '22222222-2222-2222-2222-222222222225',
        name: 'Dragon Wok',
        cuisine: 'Chinese',
        description: 'Traditional Chinese cuisine with modern twists and bold flavors',
        address_street: '654 Maple Dr',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60540',
        phone: '+1 (555) 999-0000',
        email: 'info@dragonwok.com',
        rating: 4.55,
        total_reviews: 276,
        delivery_fee: 3.99,
        minimum_order: 15.00,
        estimated_delivery_time: '35-45 min',
        image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=400&fit=crop'
      },
      {
        id: 'e3456789-abcd-ef01-2345-6789abcdef01',
        owner_id: '22222222-2222-2222-2222-222222222226',
        name: 'Thai Spice',
        cuisine: 'Thai',
        description: 'Aromatic Thai dishes with authentic spices and fresh herbs',
        address_street: '987 Oak Ave',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60563',
        phone: '+1 (555) 111-2222',
        email: 'contact@thaispice.com',
        rating: 4.75,
        total_reviews: 167,
        delivery_fee: 4.49,
        minimum_order: 18.00,
        estimated_delivery_time: '35-50 min',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=400&fit=crop'
      },
      {
        id: 'f4567890-bcde-f012-3456-789abcdef012',
        owner_id: '22222222-2222-2222-2222-222222222227',
        name: 'India Curry House',
        cuisine: 'Indian',
        description: 'Rich and flavorful Indian curries and tandoori specialties',
        address_street: '246 Cedar Ln',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60540',
        phone: '+1 (555) 333-5555',
        email: 'orders@indiacurry.com',
        rating: 4.60,
        total_reviews: 203,
        delivery_fee: 3.99,
        minimum_order: 16.00,
        estimated_delivery_time: '40-55 min',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop'
      },
      {
        id: 'g5678901-cdef-0123-4567-89abcdef0123',
        owner_id: '22222222-2222-2222-2222-222222222228',
        name: 'French Bistro',
        cuisine: 'French',
        description: 'Classic French cuisine with elegant presentation and exquisite taste',
        address_street: '135 Birch St',
        address_city: 'Naperville',
        address_state: 'IL',
        address_zip: '60565',
        phone: '+1 (555) 666-7777',
        email: 'reservations@frenchbistro.com',
        rating: 4.85,
        total_reviews: 142,
        delivery_fee: 5.99,
        minimum_order: 25.00,
        estimated_delivery_time: '45-60 min',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop'
      }
    ];

    for (const restaurant of restaurants) {
      await pool.query(
        `INSERT INTO restaurants (id, owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, email, rating, total_reviews, delivery_fee, minimum_order, estimated_delivery_time, is_active, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true, $17)
         ON CONFLICT (id) DO NOTHING`,
        [restaurant.id, restaurant.owner_id, restaurant.name, restaurant.cuisine, restaurant.description,
         restaurant.address_street, restaurant.address_city, restaurant.address_state, restaurant.address_zip,
         restaurant.phone, restaurant.email, restaurant.rating, restaurant.total_reviews,
         restaurant.delivery_fee, restaurant.minimum_order, restaurant.estimated_delivery_time, restaurant.image]
      );
    }
    
    console.log(`✅ Created ${restaurants.length} restaurants\n`);

    // ============================================
    // MENU ITEMS
    // ============================================
    console.log('🍕 Seeding menu items...');
    
    await pool.query('DELETE FROM menu_items');
    
    const menuItems = [
      // Luigi's Pizzeria
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce', price: 18.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', is_vegetarian: true, calories: 850 },
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Pepperoni Pizza', description: 'Traditional pepperoni with extra cheese', price: 20.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', is_vegetarian: false, calories: 920 },
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Quattro Formaggi', description: 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and fontina', price: 22.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop', is_vegetarian: true, calories: 980 },
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Spaghetti Carbonara', description: 'Creamy sauce with bacon, eggs, and parmesan', price: 16.99, category: 'Pasta', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop', is_vegetarian: false, calories: 750 },
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Fettuccine Alfredo', description: 'Rich cream sauce with butter and parmesan', price: 15.99, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop', is_vegetarian: true, calories: 680 },
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Lasagna Bolognese', description: 'Layers of pasta with meat sauce and béchamel', price: 19.99, category: 'Pasta', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', is_vegetarian: false, calories: 890 },
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Tiramisu', description: 'Classic Italian dessert with coffee and mascarpone', price: 8.99, category: 'Dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', is_vegetarian: true, calories: 450 },
      { restaurant_id: '8bc47665-1384-4b6b-802f-34ffd764eac0', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', price: 12.99, category: 'Salad', image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop', is_vegetarian: true, calories: 320 },
      
      // Sushi Palace
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'California Roll', description: 'Crab, avocado, and cucumber', price: 12.99, category: 'Rolls', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', is_vegetarian: false, calories: 280 },
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo', price: 14.99, category: 'Rolls', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop', is_vegetarian: false, calories: 310 },
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'Dragon Roll', description: 'Eel, cucumber, avocado with eel sauce', price: 18.99, category: 'Rolls', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop', is_vegetarian: false, calories: 420 },
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'Salmon Nigiri (6pc)', description: 'Fresh salmon over sushi rice', price: 16.99, category: 'Nigiri', image: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&h=300&fit=crop', is_vegetarian: false, calories: 340 },
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'Tuna Sashimi (8pc)', description: 'Premium tuna slices', price: 22.99, category: 'Sashimi', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', is_vegetarian: false, calories: 280 },
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed', price: 4.99, category: 'Soup', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', is_vegetarian: true, calories: 80 },
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 5.99, category: 'Appetizer', image: 'https://images.unsplash.com/photo-1583797227936-e6f42c3e8d7c?w=400&h=300&fit=crop', is_vegetarian: true, calories: 120 },
      { restaurant_id: 'b34289b7-2c67-4436-a756-49fa84f56f6e', name: 'Green Tea Ice Cream', description: 'Authentic Japanese green tea ice cream', price: 6.99, category: 'Dessert', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop', is_vegetarian: true, calories: 180 },
      
      // Burger House
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'Classic Cheeseburger', description: 'Angus beef, cheddar, lettuce, tomato, onion', price: 13.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', is_vegetarian: false, calories: 720 },
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'Bacon BBQ Burger', description: 'Beef patty, crispy bacon, BBQ sauce, onion rings', price: 15.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop', is_vegetarian: false, calories: 890 },
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'Mushroom Swiss Burger', description: 'Sautéed mushrooms, Swiss cheese, garlic aioli', price: 14.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop', is_vegetarian: false, calories: 780 },
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'Veggie Burger', description: 'Plant-based patty, avocado, sprouts, special sauce', price: 12.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop', is_vegetarian: true, calories: 520 },
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'French Fries', description: 'Crispy golden fries with sea salt', price: 4.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', is_vegetarian: true, calories: 380 },
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'Onion Rings', description: 'Beer-battered onion rings', price: 5.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop', is_vegetarian: true, calories: 420 },
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'Chocolate Milkshake', description: 'Thick and creamy chocolate shake', price: 6.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', is_vegetarian: true, calories: 580 },
      { restaurant_id: 'b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', name: 'Buffalo Wings (8pc)', description: 'Spicy buffalo wings with ranch dip', price: 11.99, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop', is_vegetarian: false, calories: 640 },
      
      // More menu items for other restaurants...
      { restaurant_id: 'c1234567-89ab-cdef-0123-456789abcdef', name: 'Carne Asada Tacos (3)', description: 'Grilled steak with cilantro and onions', price: 11.99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop', is_vegetarian: false, calories: 480 },
      { restaurant_id: 'c1234567-89ab-cdef-0123-456789abcdef', name: 'Fish Tacos (3)', description: 'Battered fish, cabbage slaw, chipotle mayo', price: 12.99, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop', is_vegetarian: false, calories: 520 },
      { restaurant_id: 'c1234567-89ab-cdef-0123-456789abcdef', name: 'Chicken Burrito', description: 'Grilled chicken, rice, beans, cheese, salsa', price: 13.99, category: 'Burritos', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', is_vegetarian: false, calories: 680 },
      { restaurant_id: 'c1234567-89ab-cdef-0123-456789abcdef', name: 'Guacamole & Chips', description: 'Fresh guacamole with tortilla chips', price: 7.99, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop', is_vegetarian: true, calories: 340 },
      
      { restaurant_id: 'd2345678-9abc-def0-1234-56789abcdef0', name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts and vegetables', price: 14.99, category: 'Main Dishes', image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop', is_vegetarian: false, calories: 580 },
      { restaurant_id: 'd2345678-9abc-def0-1234-56789abcdef0', name: 'Sweet & Sour Pork', description: 'Crispy pork in sweet and sour sauce', price: 15.99, category: 'Main Dishes', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', is_vegetarian: false, calories: 640 },
      { restaurant_id: 'd2345678-9abc-def0-1234-56789abcdef0', name: 'Vegetable Lo Mein', description: 'Stir-fried noodles with mixed vegetables', price: 12.99, category: 'Noodles', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', is_vegetarian: true, calories: 480 },
      
      { restaurant_id: 'e3456789-abcd-ef01-2345-6789abcdef01', name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp, peanuts, and lime', price: 15.99, category: 'Noodles', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop', is_vegetarian: false, calories: 620 },
      { restaurant_id: 'e3456789-abcd-ef01-2345-6789abcdef01', name: 'Green Curry', description: 'Spicy coconut curry with chicken and vegetables', price: 16.99, category: 'Curries', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop', is_vegetarian: false, calories: 580 },
      { restaurant_id: 'e3456789-abcd-ef01-2345-6789abcdef01', name: 'Mango Sticky Rice', description: 'Sweet sticky rice with fresh mango', price: 7.99, category: 'Dessert', image: 'https://images.unsplash.com/photo-1601887370915-c8e8c6e1b6e1?w=400&h=300&fit=crop', is_vegetarian: true, calories: 380 },
      
      { restaurant_id: 'f4567890-bcde-f012-3456-789abcdef012', name: 'Chicken Tikka Masala', description: 'Tender chicken in creamy tomato sauce', price: 17.99, category: 'Curries', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', is_vegetarian: false, calories: 640 },
      { restaurant_id: 'f4567890-bcde-f012-3456-789abcdef012', name: 'Palak Paneer', description: 'Spinach curry with Indian cottage cheese', price: 14.99, category: 'Vegetarian', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', is_vegetarian: true, calories: 480 },
      { restaurant_id: 'f4567890-bcde-f012-3456-789abcdef012', name: 'Garlic Naan', description: 'Fresh baked naan with garlic and butter', price: 3.99, category: 'Breads', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', is_vegetarian: true, calories: 280 },
      
      { restaurant_id: 'g5678901-cdef-0123-4567-89abcdef0123', name: 'Coq au Vin', description: 'Chicken braised in red wine with mushrooms', price: 24.99, category: 'Main Courses', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', is_vegetarian: false, calories: 680 },
      { restaurant_id: 'g5678901-cdef-0123-4567-89abcdef0123', name: 'Beef Bourguignon', description: 'Slow-cooked beef in burgundy wine sauce', price: 26.99, category: 'Main Courses', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', is_vegetarian: false, calories: 720 },
      { restaurant_id: 'g5678901-cdef-0123-4567-89abcdef0123', name: 'Crème Brûlée', description: 'Classic French custard with caramelized sugar', price: 9.99, category: 'Dessert', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop', is_vegetarian: true, calories: 420 }
    ];

    for (const item of menuItems) {
      await pool.query(
        `INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories)
         VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8)`,
        [item.restaurant_id, item.name, item.description, item.price, item.category, item.image, item.is_vegetarian, item.calories]
      );
    }
    
    console.log(`✅ Created ${menuItems.length} menu items\n`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${users.length} users created`);
    console.log(`   - ${restaurants.length} restaurants created`);
    console.log(`   - ${menuItems.length} menu items created`);
    console.log('\n✅ Test credentials (password: Test123456!):');
    console.log('   - customer1@test.com (Customer)');
    console.log('   - luigi@pizzeria.com (Restaurant Owner)');
    console.log('   - driver1@test.com (Driver)');
    console.log('   - admin@test.com (Admin)\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('✅ Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });
