#!/usr/bin/env node
/**
 * Seed script for food_delivery database
 * Creates: users, restaurants, menu items, sample orders
 * 
 * Usage: node scripts/seed-database.js
 *   or:  DATABASE_URL=... node scripts/seed-database.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/food_delivery',
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : undefined,
});

// Sample restaurant data (7 restaurants across cuisines)
const RESTAURANTS = [
  {
    name: 'Bella Italia',
    cuisine: 'Italian',
    description: 'Authentic Italian cuisine with fresh pasta, wood-fired pizza, and classic desserts.',
    address_street: '123 Main St',
    address_city: 'Naperville',
    address_state: 'IL',
    address_zip: '60540',
    phone: '(630) 555-0101',
    email: 'info@bellaitalia.com',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
  },
  {
    name: 'Istanbul Grill',
    cuisine: 'Turkish',
    description: 'Traditional Turkish kebabs, mezze, and baklava made from family recipes.',
    address_street: '456 Oak Ave',
    address_city: 'Naperville',
    address_state: 'IL',
    address_zip: '60540',
    phone: '(630) 555-0102',
    email: 'hello@istanbulgrill.com',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop',
  },
  {
    name: 'Burger Nation',
    cuisine: 'Fast Food',
    description: 'Juicy handcrafted burgers, crispy fries, and thick milkshakes.',
    address_street: '789 Elm St',
    address_city: 'Naperville',
    address_state: 'IL',
    address_zip: '60540',
    phone: '(630) 555-0103',
    email: 'orders@burgernation.com',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
  },
  {
    name: 'Sakura Sushi',
    cuisine: 'Asian',
    description: 'Fresh sushi, ramen, and Japanese favorites in a modern setting.',
    address_street: '321 Pine Rd',
    address_city: 'Naperville',
    address_state: 'IL',
    address_zip: '60540',
    phone: '(630) 555-0104',
    email: 'sushi@sakura.com',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop',
  },
  {
    name: 'Le Petit Bistro',
    cuisine: 'French',
    description: 'Classic French bistro featuring escargot, steak frites, and crème brûlée.',
    address_street: '654 Maple Dr',
    address_city: 'Naperville',
    address_state: 'IL',
    address_zip: '60540',
    phone: '(630) 555-0105',
    email: 'bonjour@lepetitbistro.com',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
  },
  {
    name: 'Casbah Kitchen',
    cuisine: 'Algerian',
    description: 'North African delights including couscous, tagine, and harira soup.',
    address_street: '987 Birch Ln',
    address_city: 'Naperville',
    address_state: 'IL',
    address_zip: '60540',
    phone: '(630) 555-0106',
    email: 'info@casbahkitchen.com',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?w=800&h=600&fit=crop',
  },
  {
    name: 'Green Garden Vegan',
    cuisine: 'Italian',
    description: 'Plant-based Italian classics with fresh, locally-sourced ingredients.',
    address_street: '147 Cedar St',
    address_city: 'Naperville',
    address_state: 'IL',
    address_zip: '60540',
    phone: '(630) 555-0107',
    email: 'hello@greengarden.com',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
  },
];

// Sample menu items per cuisine
const MENU_ITEMS_BY_CUISINE = {
  Italian: [
    { name: 'Margherita Pizza', price: 14.99, category: 'Pizza', description: 'Fresh mozzarella, tomato, basil', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400' },
    { name: 'Spaghetti Carbonara', price: 16.99, category: 'Pasta', description: 'Eggs, pancetta, pecorino, black pepper', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
    { name: 'Lasagna Bolognese', price: 18.99, category: 'Pasta', description: 'Layered with beef ragù and béchamel', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400' },
    { name: 'Tiramisu', price: 8.99, category: 'Dessert', description: 'Mascarpone, espresso, cocoa', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
  ],
  Turkish: [
    { name: 'Chicken Shish Kebab', price: 17.99, category: 'Main', description: 'Grilled chicken skewers with rice', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400' },
    { name: 'Lamb Gyro', price: 14.99, category: 'Main', description: 'Slow-cooked lamb, pita, tzatziki', image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400' },
    { name: 'Hummus Plate', price: 9.99, category: 'Appetizer', description: 'Chickpea dip with warm pita', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400' },
    { name: 'Baklava', price: 6.99, category: 'Dessert', description: 'Honey-soaked pistachio pastry', image: 'https://images.unsplash.com/photo-1625398407937-2b72f15a0b14?w=400' },
  ],
  'Fast Food': [
    { name: 'Classic Cheeseburger', price: 10.99, category: 'Burger', description: 'Beef patty, cheddar, lettuce, tomato', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'Bacon Deluxe Burger', price: 12.99, category: 'Burger', description: 'Bacon, Swiss, caramelized onions', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400' },
    { name: 'Crispy Fries', price: 4.99, category: 'Side', description: 'Golden hand-cut fries', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400' },
    { name: 'Chocolate Milkshake', price: 5.99, category: 'Drink', description: 'Thick, creamy, topped with whipped cream', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
  ],
  Asian: [
    { name: 'California Roll', price: 9.99, category: 'Sushi', description: 'Crab, avocado, cucumber', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
    { name: 'Salmon Nigiri (6pc)', price: 14.99, category: 'Sushi', description: 'Fresh salmon on seasoned rice', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400' },
    { name: 'Tonkotsu Ramen', price: 15.99, category: 'Ramen', description: 'Rich pork broth, chashu, egg', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
    { name: 'Mochi Ice Cream', price: 6.99, category: 'Dessert', description: 'Assorted flavors (3pc)', image: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?w=400' },
  ],
  French: [
    { name: 'Escargot de Bourgogne', price: 13.99, category: 'Appetizer', description: 'Snails in garlic herb butter', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
    { name: 'Steak Frites', price: 26.99, category: 'Main', description: 'Ribeye with hand-cut fries', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400' },
    { name: 'Coq au Vin', price: 23.99, category: 'Main', description: 'Chicken braised in red wine', image: 'https://images.unsplash.com/photo-1560963689-02e82017b3cd?w=400' },
    { name: 'Crème Brûlée', price: 9.99, category: 'Dessert', description: 'Vanilla custard, caramelized sugar', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400' },
  ],
  Algerian: [
    { name: 'Lamb Tagine', price: 19.99, category: 'Main', description: 'Slow-cooked lamb with prunes and almonds', image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?w=400' },
    { name: 'Couscous Royale', price: 21.99, category: 'Main', description: 'Semolina with lamb, chicken, merguez', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
    { name: 'Harira Soup', price: 7.99, category: 'Soup', description: 'Traditional tomato-lentil soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400' },
    { name: 'Makroud', price: 5.99, category: 'Dessert', description: 'Date-filled semolina pastry', image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?w=400' },
  ],
};

// Test users
const USERS = [
  { email: 'customer@test.com', password: 'Password123!', role: 'customer', name: 'John Customer' },
  { email: 'owner@test.com', password: 'Password123!', role: 'restaurant_owner', name: 'Maria Owner' },
  { email: 'driver@test.com', password: 'Password123!', role: 'driver', name: 'Mike Driver' },
  { email: 'admin@test.com', password: 'Password123!', role: 'admin', name: 'Admin User' },
];

async function clearExisting() {
  console.log('🧹 Clearing existing seed data...');
  await pool.query(`DELETE FROM menu_items WHERE restaurant_id IN (SELECT id FROM restaurants WHERE email LIKE '%@%.com')`);
  await pool.query(`DELETE FROM restaurants WHERE email LIKE '%@%.com'`);
  await pool.query(`DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`);
  await pool.query(`DELETE FROM users WHERE email LIKE '%@test.com'`);
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  const userIds = {};
  for (const user of USERS) {
    const hash = await bcrypt.hash(user.password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, role, is_active, email_verified)
       VALUES ($1, $2, $3, true, true)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id`,
      [user.email, hash, user.role]
    );
    userIds[user.role] = rows[0].id;
    
    // Create profile (name is NOT NULL)
    await pool.query(
      `INSERT INTO profiles (user_id, name) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name`,
      [rows[0].id, user.name]
    );
    console.log(`  ✅ ${user.role}: ${user.email} / ${user.password}`);
  }
  return userIds;
}

async function seedRestaurants(ownerId) {
  console.log('🍽️  Seeding restaurants...');
  const restaurantIds = [];
  for (const r of RESTAURANTS) {
    const address = `${r.address_street}, ${r.address_city}, ${r.address_state} ${r.address_zip}`;
    const { rows } = await pool.query(
      `INSERT INTO restaurants (
        owner_id, name, cuisine, description,
        address_street, address_city, address_state, address_zip,
        phone, email, rating, is_active, image, address
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,$12,$13)
      RETURNING id, cuisine`,
      [ownerId, r.name, r.cuisine, r.description, r.address_street, r.address_city, r.address_state, r.address_zip, r.phone, r.email, r.rating, r.image, address]
    );
    restaurantIds.push(rows[0]);
    console.log(`  ✅ ${r.name} (${r.cuisine})`);
  }
  return restaurantIds;
}

async function seedMenuItems(restaurants) {
  console.log('🍴 Seeding menu items...');
  // Check menu_items schema
  const { rows: cols } = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'menu_items'`
  );
  const colNames = cols.map(c => c.column_name);
  const hasAvailable = colNames.includes('is_available') || colNames.includes('available');
  const availableCol = colNames.includes('is_available') ? 'is_available' : 'available';
  const hasImage = colNames.includes('image') || colNames.includes('image_url');
  const imageCol = colNames.includes('image') ? 'image' : 'image_url';

  let count = 0;
  for (const r of restaurants) {
    const items = MENU_ITEMS_BY_CUISINE[r.cuisine] || [];
    for (const item of items) {
      const fields = ['restaurant_id', 'name', 'description', 'price', 'category'];
      const values = [r.id, item.name, item.description, item.price, item.category];
      let placeholders = '$1,$2,$3,$4,$5';
      let idx = 6;
      
      if (hasImage) { fields.push(imageCol); values.push(item.image); placeholders += `,$${idx++}`; }
      if (hasAvailable) { fields.push(availableCol); values.push(true); placeholders += `,$${idx++}`; }
      
      await pool.query(
        `INSERT INTO menu_items (${fields.join(',')}) VALUES (${placeholders})`,
        values
      );
      count++;
    }
  }
  console.log(`  ✅ Seeded ${count} menu items`);
}

async function main() {
  try {
    console.log('🌱 Starting database seed...\n');
    console.log(`📍 Database: ${(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/food_delivery').replace(/:[^:@]+@/, ':***@')}\n`);
    
    await clearExisting();
    const userIds = await seedUsers();
    const restaurants = await seedRestaurants(userIds.restaurant_owner);
    await seedMenuItems(restaurants);
    
    console.log('\n✨ Seed complete!');
    console.log('\n📋 Test Credentials:');
    USERS.forEach(u => console.log(`  ${u.role.padEnd(20)} ${u.email.padEnd(25)} ${u.password}`));
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
