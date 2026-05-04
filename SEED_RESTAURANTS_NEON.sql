-- ============================================
-- SEED RESTAURANTS FOR NEON DATABASE
-- Copy and paste this into your Neon SQL Editor
-- ============================================

-- First, ensure you have a user to own these restaurants
-- Replace 'YOUR_USER_ID_HERE' with an actual user ID from your users table
-- You can get a user ID by running: SELECT id FROM users WHERE role = 'restaurant' LIMIT 1;

-- Italian Restaurants
INSERT INTO restaurants (id, user_id, name, cuisine, address, phone, description, image, rating, status, estimated_delivery_time, delivery_fee, is_active, created_at, updated_at)
VALUES 
(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 
 'Luigi''s Pizzeria', 
 'Italian', 
 '123 Main Street, Naperville, IL 60540', 
 '+1-630-555-0101', 
 'Authentic Italian pizza and pasta made with love. Family recipes passed down for generations.',
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
 4.7,
 'active',
 '30-45 min',
 3.99,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Bella Italia',
 'Italian',
 '456 Oak Avenue, Naperville, IL 60540',
 '+1-630-555-0102',
 'Fine Italian dining with fresh ingredients and homemade pasta.',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
 4.8,
 'active',
 '35-50 min',
 4.99,
 true,
 NOW(),
 NOW()),

-- Japanese Restaurants
(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Sushi Palace',
 'Japanese',
 '789 Cherry Lane, Naperville, IL 60540',
 '+1-630-555-0103',
 'Premium sushi and Japanese cuisine. Fresh fish delivered daily.',
 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
 4.9,
 'active',
 '40-55 min',
 5.99,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Tokyo Express',
 'Japanese',
 '321 Bamboo Street, Naperville, IL 60540',
 '+1-630-555-0104',
 'Quick and delicious Japanese food. Ramen, sushi, and bento boxes.',
 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop',
 4.6,
 'active',
 '25-35 min',
 3.49,
 true,
 NOW(),
 NOW()),

-- American Restaurants
(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Burger House',
 'American',
 '555 Grill Road, Naperville, IL 60540',
 '+1-630-555-0105',
 'Juicy burgers, crispy fries, and classic American comfort food.',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
 4.5,
 'active',
 '20-30 min',
 2.99,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'The Steakhouse',
 'American',
 '777 Beef Boulevard, Naperville, IL 60540',
 '+1-630-555-0106',
 'Premium steaks and BBQ. Slow-cooked perfection.',
 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
 4.8,
 'active',
 '45-60 min',
 6.99,
 true,
 NOW(),
 NOW()),

-- Mexican Restaurants
(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Taco Fiesta',
 'Mexican',
 '888 Salsa Street, Naperville, IL 60540',
 '+1-630-555-0107',
 'Authentic Mexican tacos, burritos, and quesadillas. Spicy and delicious!',
 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
 4.7,
 'active',
 '25-35 min',
 3.49,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'El Mariachi',
 'Mexican',
 '999 Guacamole Lane, Naperville, IL 60540',
 '+1-630-555-0108',
 'Traditional Mexican cuisine with a modern twist. Fresh ingredients daily.',
 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400&h=300&fit=crop',
 4.6,
 'active',
 '30-40 min',
 4.49,
 true,
 NOW(),
 NOW()),

-- Chinese Restaurants
(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Golden Dragon',
 'Chinese',
 '111 Wok Way, Naperville, IL 60540',
 '+1-630-555-0109',
 'Authentic Chinese cuisine. Dim sum, noodles, and stir-fry specialties.',
 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop',
 4.5,
 'active',
 '30-45 min',
 3.99,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Panda Garden',
 'Chinese',
 '222 Rice Road, Naperville, IL 60540',
 '+1-630-555-0110',
 'Family-style Chinese restaurant. Generous portions and great prices.',
 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
 4.4,
 'active',
 '25-35 min',
 2.99,
 true,
 NOW(),
 NOW()),

-- More Variety
(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Thai Orchid',
 'Thai',
 '333 Spice Street, Naperville, IL 60540',
 '+1-630-555-0111',
 'Authentic Thai food with bold flavors. Pad Thai, curries, and more.',
 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
 4.7,
 'active',
 '35-45 min',
 4.49,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Mediterranean Delight',
 'Mediterranean',
 '444 Olive Avenue, Naperville, IL 60540',
 '+1-630-555-0112',
 'Fresh Mediterranean cuisine. Hummus, falafel, and kebabs.',
 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=300&fit=crop',
 4.6,
 'active',
 '30-40 min',
 3.99,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Indian Spice',
 'Indian',
 '555 Curry Court, Naperville, IL 60540',
 '+1-630-555-0113',
 'Authentic Indian cuisine. Tandoori, biryani, and flavorful curries.',
 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
 4.8,
 'active',
 '40-50 min',
 4.99,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Healthy Bowls',
 'Healthy',
 '666 Wellness Way, Naperville, IL 60540',
 '+1-630-555-0114',
 'Fresh, healthy bowls and salads. Organic ingredients and superfoods.',
 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
 4.9,
 'active',
 '20-30 min',
 3.49,
 true,
 NOW(),
 NOW()),

(gen_random_uuid(), (SELECT id FROM users WHERE role = 'restaurant' LIMIT 1),
 'Pizza Paradise',
 'Italian',
 '777 Cheese Lane, Naperville, IL 60540',
 '+1-630-555-0115',
 'New York style pizza. Thin crust, fresh toppings, amazing taste.',
 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
 4.7,
 'active',
 '25-35 min',
 2.99,
 true,
 NOW(),
 NOW());

-- ============================================
-- VERIFY THE DATA
-- ============================================
-- Run this to check if restaurants were created:
-- SELECT id, name, cuisine, rating, status FROM restaurants ORDER BY created_at DESC LIMIT 15;

-- ============================================
-- NOTES:
-- ============================================
-- 1. This creates 15 restaurants across different cuisines
-- 2. All restaurants are set to 'active' status
-- 3. Images use Unsplash URLs (free stock photos)
-- 4. All restaurants are in Naperville, Illinois
-- 5. Ratings range from 4.4 to 4.9
-- 6. Delivery fees range from $2.99 to $6.99
-- 7. Delivery times range from 20-60 minutes
--
-- TO CUSTOMIZE:
-- - Replace user_id with your actual restaurant owner user IDs
-- - Change addresses to your preferred locations
-- - Modify ratings, delivery times, and fees as needed
-- - Add more restaurants by copying the INSERT pattern
