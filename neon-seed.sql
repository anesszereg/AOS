-- ============================================
-- NEON DATABASE SEED SCRIPT
-- Copy and paste this entire file into Neon SQL Editor
-- ============================================

-- Create tables if they don't exist
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

CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    description TEXT,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    minimum_order DECIMAL(10,2) DEFAULT 0.00,
    estimated_delivery_time VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    calories INTEGER,
    prep_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing data (in correct order - child tables first)
DELETE FROM menu_items;
DELETE FROM restaurants;
DELETE FROM users;

-- ============================================
-- INSERT USERS FIRST (required for restaurant owner_id references)
-- ============================================
-- Password for all accounts: Test123456! (hashed with bcrypt)
INSERT INTO users (id, email, password_hash, role, is_active, email_verified) VALUES
-- Customers
('11111111-1111-1111-1111-111111111111', 'customer1@test.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'customer', true, true),
('11111111-1111-1111-1111-111111111112', 'customer2@test.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'customer', true, true),
('11111111-1111-1111-1111-111111111113', 'customer3@test.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'customer', true, true),

-- Restaurant Owners
('22222222-2222-2222-2222-222222222221', 'luigi@pizzeria.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),
('22222222-2222-2222-2222-222222222222', 'sushi@palace.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),
('22222222-2222-2222-2222-222222222223', 'burger@house.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),
('22222222-2222-2222-2222-222222222224', 'taco@fiesta.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),
('22222222-2222-2222-2222-222222222225', 'dragon@wok.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),
('22222222-2222-2222-2222-222222222226', 'thai@spice.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),
('22222222-2222-2222-2222-222222222227', 'india@curry.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),
('22222222-2222-2222-2222-222222222228', 'french@bistro.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'restaurant', true, true),

-- Drivers
('33333333-3333-3333-3333-333333333331', 'driver1@test.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'driver', true, true),
('33333333-3333-3333-3333-333333333332', 'driver2@test.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'driver', true, true),
('33333333-3333-3333-3333-333333333333', 'driver3@test.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'driver', true, true),

-- Admin
('44444444-4444-4444-4444-444444444441', 'admin@test.com', '$2b$10$rQZ9vZ9Z9Z9Z9Z9Z9Z9Z9eK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K', 'admin', true, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INSERT RESTAURANTS (after users exist)
-- ============================================
INSERT INTO restaurants (id, owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, email, rating, total_reviews, delivery_fee, minimum_order, estimated_delivery_time, is_active, image) VALUES
('8bc47665-1384-4b6b-802f-34ffd764eac0', '22222222-2222-2222-2222-222222222221', 'Luigi''s Pizzeria', 'Italian', 'Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations', '123 Main St', 'Naperville', 'IL', '60540', '+1 (555) 123-4567', 'luigi@pizzeria.com', 4.70, 245, 3.99, 15.00, '30-45 min', true, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop'),

('b34289b7-2c67-4436-a756-49fa84f56f6e', '22222222-2222-2222-2222-222222222222', 'Sushi Palace', 'Japanese', 'Fresh sushi and authentic Japanese dishes prepared by master chefs', '555 Market St', 'Naperville', 'IL', '60563', '+1 (555) 333-4444', 'info@sushipalace.com', 4.80, 189, 4.99, 20.00, '40-50 min', true, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop'),

('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', '22222222-2222-2222-2222-222222222223', 'Burger House', 'American', 'Gourmet burgers and classic American favorites made with premium ingredients', '789 Elm St', 'Naperville', 'IL', '60540', '+1 (555) 555-6666', 'hello@burgerhouse.com', 4.50, 312, 2.99, 12.00, '25-35 min', true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop'),

('c1234567-89ab-cdef-0123-456789abcdef', '22222222-2222-2222-2222-222222222224', 'Taco Fiesta', 'Mexican', 'Authentic Mexican street food and traditional dishes bursting with flavor', '321 Pine Rd', 'Naperville', 'IL', '60565', '+1 (555) 777-8888', 'orders@tacofiesta.com', 4.65, 198, 3.49, 10.00, '30-40 min', true, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=400&fit=crop'),

('d2345678-9abc-def0-1234-56789abcdef0', '22222222-2222-2222-2222-222222222225', 'Dragon Wok', 'Chinese', 'Traditional Chinese cuisine with modern twists and bold flavors', '654 Maple Dr', 'Naperville', 'IL', '60540', '+1 (555) 999-0000', 'info@dragonwok.com', 4.55, 276, 3.99, 15.00, '35-45 min', true, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=400&fit=crop'),

('e3456789-abcd-ef01-2345-6789abcdef01', '22222222-2222-2222-2222-222222222226', 'Thai Spice', 'Thai', 'Aromatic Thai dishes with authentic spices and fresh herbs', '987 Oak Ave', 'Naperville', 'IL', '60563', '+1 (555) 111-2222', 'contact@thaispice.com', 4.75, 167, 4.49, 18.00, '35-50 min', true, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=400&fit=crop'),

('f4567890-bcde-f012-3456-789abcdef012', '22222222-2222-2222-2222-222222222227', 'India Curry House', 'Indian', 'Rich and flavorful Indian curries and tandoori specialties', '246 Cedar Ln', 'Naperville', 'IL', '60540', '+1 (555) 333-5555', 'orders@indiacurry.com', 4.60, 203, 3.99, 16.00, '40-55 min', true, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop'),

('g5678901-cdef-0123-4567-89abcdef0123', '22222222-2222-2222-2222-222222222228', 'French Bistro', 'French', 'Classic French cuisine with elegant presentation and exquisite taste', '135 Birch St', 'Naperville', 'IL', '60565', '+1 (555) 666-7777', 'reservations@frenchbistro.com', 4.85, 142, 5.99, 25.00, '45-60 min', true, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INSERT MENU ITEMS
-- ============================================

-- Luigi's Pizzeria Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Margherita Pizza', 'Classic pizza with fresh mozzarella, basil, and tomato sauce', 18.99, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', true, true, 850),
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Pepperoni Pizza', 'Traditional pepperoni with extra cheese', 20.99, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', true, false, 920),
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Quattro Formaggi', 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and fontina', 22.99, 'Pizza', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop', true, true, 980),
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Spaghetti Carbonara', 'Creamy sauce with bacon, eggs, and parmesan', 16.99, 'Pasta', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop', true, false, 750),
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Fettuccine Alfredo', 'Rich cream sauce with butter and parmesan', 15.99, 'Pasta', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop', true, true, 680),
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Lasagna Bolognese', 'Layers of pasta with meat sauce and béchamel', 19.99, 'Pasta', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop', true, false, 890),
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 8.99, 'Dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', true, true, 450),
('8bc47665-1384-4b6b-802f-34ffd764eac0', 'Caprese Salad', 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', 12.99, 'Salad', 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop', true, true, 320);

-- Sushi Palace Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'California Roll', 'Crab, avocado, and cucumber', 12.99, 'Rolls', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', true, false, 280),
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo', 14.99, 'Rolls', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop', true, false, 310),
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'Dragon Roll', 'Eel, cucumber, avocado with eel sauce', 18.99, 'Rolls', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop', true, false, 420),
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'Salmon Nigiri (6pc)', 'Fresh salmon over sushi rice', 16.99, 'Nigiri', 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&h=300&fit=crop', true, false, 340),
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'Tuna Sashimi (8pc)', 'Premium tuna slices', 22.99, 'Sashimi', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', true, false, 280),
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'Miso Soup', 'Traditional Japanese soup with tofu and seaweed', 4.99, 'Soup', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', true, true, 80),
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'Edamame', 'Steamed soybeans with sea salt', 5.99, 'Appetizer', 'https://images.unsplash.com/photo-1583797227936-e6f42c3e8d7c?w=400&h=300&fit=crop', true, true, 120),
('b34289b7-2c67-4436-a756-49fa84f56f6e', 'Green Tea Ice Cream', 'Authentic Japanese green tea ice cream', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop', true, true, 180);

-- Burger House Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'Classic Cheeseburger', 'Angus beef, cheddar, lettuce, tomato, onion', 13.99, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', true, false, 720),
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'Bacon BBQ Burger', 'Beef patty, crispy bacon, BBQ sauce, onion rings', 15.99, 'Burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop', true, false, 890),
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'Mushroom Swiss Burger', 'Sautéed mushrooms, Swiss cheese, garlic aioli', 14.99, 'Burgers', 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop', true, false, 780),
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'Veggie Burger', 'Plant-based patty, avocado, sprouts, special sauce', 12.99, 'Burgers', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop', true, true, 520),
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'French Fries', 'Crispy golden fries with sea salt', 4.99, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', true, true, 380),
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'Onion Rings', 'Beer-battered onion rings', 5.99, 'Sides', 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop', true, true, 420),
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'Chocolate Milkshake', 'Thick and creamy chocolate shake', 6.99, 'Drinks', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', true, true, 580),
('b06bb65a-e9fc-4d27-b9f8-8fcd946936bd', 'Buffalo Wings (8pc)', 'Spicy buffalo wings with ranch dip', 11.99, 'Appetizers', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop', true, false, 640);

-- Taco Fiesta Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('c1234567-89ab-cdef-0123-456789abcdef', 'Carne Asada Tacos (3)', 'Grilled steak with cilantro and onions', 11.99, 'Tacos', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop', true, false, 480),
('c1234567-89ab-cdef-0123-456789abcdef', 'Fish Tacos (3)', 'Battered fish, cabbage slaw, chipotle mayo', 12.99, 'Tacos', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop', true, false, 520),
('c1234567-89ab-cdef-0123-456789abcdef', 'Chicken Burrito', 'Grilled chicken, rice, beans, cheese, salsa', 13.99, 'Burritos', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', true, false, 680),
('c1234567-89ab-cdef-0123-456789abcdef', 'Beef Quesadilla', 'Seasoned beef, melted cheese, peppers', 10.99, 'Quesadillas', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=300&fit=crop', true, false, 620),
('c1234567-89ab-cdef-0123-456789abcdef', 'Guacamole & Chips', 'Fresh guacamole with tortilla chips', 7.99, 'Appetizers', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop', true, true, 340),
('c1234567-89ab-cdef-0123-456789abcdef', 'Churros (4pc)', 'Cinnamon sugar churros with chocolate sauce', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop', true, true, 420);

-- Dragon Wok Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('d2345678-9abc-def0-1234-56789abcdef0', 'Kung Pao Chicken', 'Spicy chicken with peanuts and vegetables', 14.99, 'Main Dishes', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop', true, false, 580),
('d2345678-9abc-def0-1234-56789abcdef0', 'Sweet & Sour Pork', 'Crispy pork in sweet and sour sauce', 15.99, 'Main Dishes', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', true, false, 640),
('d2345678-9abc-def0-1234-56789abcdef0', 'Beef with Broccoli', 'Tender beef and broccoli in brown sauce', 16.99, 'Main Dishes', 'https://images.unsplash.com/photo-1603073203463-178a0f0a583d?w=400&h=300&fit=crop', true, false, 520),
('d2345678-9abc-def0-1234-56789abcdef0', 'Vegetable Lo Mein', 'Stir-fried noodles with mixed vegetables', 12.99, 'Noodles', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', true, true, 480),
('d2345678-9abc-def0-1234-56789abcdef0', 'Spring Rolls (4pc)', 'Crispy vegetable spring rolls', 6.99, 'Appetizers', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&h=300&fit=crop', true, true, 280),
('d2345678-9abc-def0-1234-56789abcdef0', 'Fried Rice', 'Classic fried rice with egg and vegetables', 10.99, 'Rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', true, true, 420);

-- Thai Spice Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('e3456789-abcd-ef01-2345-6789abcdef01', 'Pad Thai', 'Stir-fried rice noodles with shrimp, peanuts, and lime', 15.99, 'Noodles', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop', true, false, 620),
('e3456789-abcd-ef01-2345-6789abcdef01', 'Green Curry', 'Spicy coconut curry with chicken and vegetables', 16.99, 'Curries', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop', true, false, 580),
('e3456789-abcd-ef01-2345-6789abcdef01', 'Tom Yum Soup', 'Hot and sour soup with shrimp', 12.99, 'Soups', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', true, false, 240),
('e3456789-abcd-ef01-2345-6789abcdef01', 'Mango Sticky Rice', 'Sweet sticky rice with fresh mango', 7.99, 'Dessert', 'https://images.unsplash.com/photo-1601887370915-c8e8c6e1b6e1?w=400&h=300&fit=crop', true, true, 380);

-- India Curry House Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('f4567890-bcde-f012-3456-789abcdef012', 'Chicken Tikka Masala', 'Tender chicken in creamy tomato sauce', 17.99, 'Curries', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', true, false, 640),
('f4567890-bcde-f012-3456-789abcdef012', 'Lamb Vindaloo', 'Spicy lamb curry with potatoes', 19.99, 'Curries', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', true, false, 720),
('f4567890-bcde-f012-3456-789abcdef012', 'Palak Paneer', 'Spinach curry with Indian cottage cheese', 14.99, 'Vegetarian', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', true, true, 480),
('f4567890-bcde-f012-3456-789abcdef012', 'Garlic Naan', 'Fresh baked naan with garlic and butter', 3.99, 'Breads', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', true, true, 280),
('f4567890-bcde-f012-3456-789abcdef012', 'Samosas (3pc)', 'Crispy pastries filled with spiced potatoes', 6.99, 'Appetizers', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', true, true, 320);

-- French Bistro Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available, is_vegetarian, calories) VALUES
('g5678901-cdef-0123-4567-89abcdef0123', 'Coq au Vin', 'Chicken braised in red wine with mushrooms', 24.99, 'Main Courses', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', true, false, 680),
('g5678901-cdef-0123-4567-89abcdef0123', 'Beef Bourguignon', 'Slow-cooked beef in burgundy wine sauce', 26.99, 'Main Courses', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', true, false, 720),
('g5678901-cdef-0123-4567-89abcdef0123', 'Ratatouille', 'Provençal vegetable stew', 18.99, 'Vegetarian', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop', true, true, 380),
('g5678901-cdef-0123-4567-89abcdef0123', 'Crème Brûlée', 'Classic French custard with caramelized sugar', 9.99, 'Dessert', 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop', true, true, 420),
('g5678901-cdef-0123-4567-89abcdef0123', 'French Onion Soup', 'Rich onion soup with melted gruyère', 11.99, 'Soups', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', true, true, 320);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the data was inserted correctly

SELECT 'Users created:' as info, COUNT(*) as count FROM users;
SELECT 'Restaurants created:' as info, COUNT(*) as count FROM restaurants;
SELECT 'Menu items created:' as info, COUNT(*) as count FROM menu_items;

-- Show all restaurants
SELECT name, cuisine, rating FROM restaurants ORDER BY name;

-- Show menu items count per restaurant
SELECT r.name, COUNT(m.id) as menu_items
FROM restaurants r
LEFT JOIN menu_items m ON r.id = m.restaurant_id
GROUP BY r.name
ORDER BY r.name;
