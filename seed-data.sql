-- Seed Data for Food Delivery Platform
-- Run with: psql -d food_delivery -f seed-data.sql

-- Clear existing data (in correct order due to foreign keys)
TRUNCATE TABLE order_items, orders, menu_items, restaurants, profiles, users CASCADE;

-- ============================================
-- USERS
-- ============================================
-- Password for all users: "password123" (hashed with bcrypt)
-- Hash: $2a$10$YourHashHere (you'll need to generate this)

-- Admin User
INSERT INTO users (id, email, password, role, name, phone, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@fooddelivery.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'admin', 'Admin User', '+1234567890', true);

-- Restaurant Owners
INSERT INTO users (id, email, password, role, name, phone, is_active) VALUES
('00000000-0000-0000-0000-000000000002', 'owner1@restaurant.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'restaurant', 'John Smith', '+1234567891', true),
('00000000-0000-0000-0000-000000000003', 'owner2@restaurant.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'restaurant', 'Maria Garcia', '+1234567892', true),
('00000000-0000-0000-0000-000000000004', 'owner3@restaurant.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'restaurant', 'David Chen', '+1234567893', true),
('00000000-0000-0000-0000-000000000005', 'owner4@restaurant.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'restaurant', 'Sarah Johnson', '+1234567894', true);

-- Customers
INSERT INTO users (id, email, password, role, name, phone, is_active) VALUES
('00000000-0000-0000-0000-000000000010', 'customer1@example.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'customer', 'Alice Brown', '+1234567900', true),
('00000000-0000-0000-0000-000000000011', 'customer2@example.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'customer', 'Bob Wilson', '+1234567901', true),
('00000000-0000-0000-0000-000000000012', 'customer3@example.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'customer', 'Carol Davis', '+1234567902', true);

-- Drivers
INSERT INTO users (id, email, password, role, name, phone, is_active) VALUES
('00000000-0000-0000-0000-000000000020', 'driver1@delivery.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'driver', 'Mike Thompson', '+1234567910', true),
('00000000-0000-0000-0000-000000000021', 'driver2@delivery.com', '$2b$10$.pjyY12ySXFfDNTozKYapegpGATHDy6RbZfUI.zRZiSzxnl0eOBiy', 'driver', 'Lisa Anderson', '+1234567911', true);

-- ============================================
-- PROFILES
-- ============================================
INSERT INTO profiles (user_id, address_street, address_city, address_state, address_zip, preferences) VALUES
('00000000-0000-0000-0000-000000000010', '123 Main St', 'New York', 'NY', '10001', '{"dietary": ["vegetarian"], "notifications": true}'),
('00000000-0000-0000-0000-000000000011', '456 Oak Ave', 'Los Angeles', 'CA', '90001', '{"dietary": [], "notifications": true}'),
('00000000-0000-0000-0000-000000000012', '789 Pine Rd', 'Chicago', 'IL', '60601', '{"dietary": ["gluten-free"], "notifications": false}');

-- ============================================
-- RESTAURANTS
-- ============================================
INSERT INTO restaurants (id, owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, email, rating, is_active, image) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'The Italian Corner', 'Italian', 'Authentic Italian cuisine with fresh pasta and wood-fired pizzas', '100 Broadway', 'New York', 'NY', '10001', '+1234567891', 'contact@italiancorner.com', 4.5, true, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Taco Fiesta', 'Mexican', 'Fresh Mexican food with homemade tortillas and salsas', '200 Sunset Blvd', 'Los Angeles', 'CA', '90001', '+1234567892', 'info@tacofiesta.com', 4.7, true, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Dragon Wok', 'Chinese', 'Traditional Chinese dishes with modern presentation', '300 Michigan Ave', 'Chicago', 'IL', '60601', '+1234567893', 'hello@dragonwok.com', 4.3, true, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'Burger Palace', 'American', 'Gourmet burgers made with premium ingredients', '400 Market St', 'San Francisco', 'CA', '94102', '+1234567894', 'orders@burgerpalace.com', 4.6, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Sushi Master', 'Japanese', 'Fresh sushi and sashimi prepared by expert chefs', '500 5th Ave', 'New York', 'NY', '10002', '+1234567895', 'info@sushimaster.com', 4.8, true, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351');

-- ============================================
-- MENU ITEMS
-- ============================================

-- The Italian Corner Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available) VALUES
('10000000-0000-0000-0000-000000000001', 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 12.99, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', true),
('10000000-0000-0000-0000-000000000001', 'Pepperoni Pizza', 'Loaded with pepperoni and extra cheese', 14.99, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e', true),
('10000000-0000-0000-0000-000000000001', 'Spaghetti Carbonara', 'Creamy pasta with pancetta and parmesan', 15.99, 'Pasta', 'https://images.unsplash.com/photo-1612874742237-6526221588e3', true),
('10000000-0000-0000-0000-000000000001', 'Fettuccine Alfredo', 'Rich and creamy alfredo sauce with fettuccine', 14.99, 'Pasta', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a', true),
('10000000-0000-0000-0000-000000000001', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 7.99, 'Dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', true);

-- Taco Fiesta Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available) VALUES
('10000000-0000-0000-0000-000000000002', 'Beef Tacos', 'Three soft tacos with seasoned beef, lettuce, and cheese', 9.99, 'Tacos', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', true),
('10000000-0000-0000-0000-000000000002', 'Chicken Burrito', 'Large burrito with grilled chicken, rice, beans, and salsa', 11.99, 'Burritos', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f', true),
('10000000-0000-0000-0000-000000000002', 'Veggie Quesadilla', 'Grilled vegetables with melted cheese in a crispy tortilla', 8.99, 'Quesadillas', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9', true),
('10000000-0000-0000-0000-000000000002', 'Nachos Supreme', 'Loaded nachos with cheese, jalapeños, sour cream, and guacamole', 10.99, 'Appetizers', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063', true),
('10000000-0000-0000-0000-000000000002', 'Churros', 'Crispy fried dough with cinnamon sugar and chocolate sauce', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32', true);

-- Dragon Wok Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available) VALUES
('10000000-0000-0000-0000-000000000003', 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts and vegetables', 13.99, 'Main Course', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', true),
('10000000-0000-0000-0000-000000000003', 'Sweet and Sour Pork', 'Crispy pork in sweet and sour sauce with pineapple', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1585032226651-759b368d7246', true),
('10000000-0000-0000-0000-000000000003', 'Vegetable Fried Rice', 'Wok-fried rice with mixed vegetables and egg', 9.99, 'Rice & Noodles', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', true),
('10000000-0000-0000-0000-000000000003', 'Spring Rolls', 'Crispy vegetable spring rolls with sweet chili sauce', 6.99, 'Appetizers', 'https://images.unsplash.com/photo-1541529086526-db283c563270', true),
('10000000-0000-0000-0000-000000000003', 'Mango Pudding', 'Creamy mango pudding with fresh fruit', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', true);

-- Burger Palace Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available) VALUES
('10000000-0000-0000-0000-000000000004', 'Classic Cheeseburger', 'Angus beef patty with cheddar, lettuce, tomato, and special sauce', 11.99, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', true),
('10000000-0000-0000-0000-000000000004', 'Bacon BBQ Burger', 'Double patty with bacon, BBQ sauce, and onion rings', 14.99, 'Burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b', true),
('10000000-0000-0000-0000-000000000004', 'Veggie Burger', 'Plant-based patty with avocado and chipotle mayo', 10.99, 'Burgers', 'https://images.unsplash.com/photo-1520072959219-c595dc870360', true),
('10000000-0000-0000-0000-000000000004', 'Loaded Fries', 'Crispy fries topped with cheese, bacon, and ranch', 7.99, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877', true),
('10000000-0000-0000-0000-000000000004', 'Chocolate Milkshake', 'Thick and creamy chocolate milkshake', 5.99, 'Drinks', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', true);

-- Sushi Master Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available) VALUES
('10000000-0000-0000-0000-000000000005', 'California Roll', 'Crab, avocado, and cucumber wrapped in rice and seaweed', 8.99, 'Rolls', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', true),
('10000000-0000-0000-0000-000000000005', 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo and cucumber', 10.99, 'Rolls', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', true),
('10000000-0000-0000-0000-000000000005', 'Salmon Sashimi', '6 pieces of fresh salmon sashimi', 14.99, 'Sashimi', 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10', true),
('10000000-0000-0000-0000-000000000005', 'Dragon Roll', 'Shrimp tempura with eel and avocado on top', 15.99, 'Specialty Rolls', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', true),
('10000000-0000-0000-0000-000000000005', 'Miso Soup', 'Traditional Japanese soup with tofu and seaweed', 3.99, 'Soup', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84', true);

-- ============================================
-- ORDERS
-- ============================================
INSERT INTO orders (id, customer_id, restaurant_id, status, total_amount, delivery_address, delivery_fee, tax, notes) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 'delivered', 35.97, '123 Main St, New York, NY 10001', 4.99, 3.24, 'Please ring doorbell'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 'in_progress', 28.97, '456 Oak Ave, Los Angeles, CA 90001', 3.99, 2.60, 'Leave at door'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000004', 'pending', 32.97, '789 Pine Rd, Chicago, IL 60601', 4.99, 2.97, NULL);

-- ============================================
-- ORDER ITEMS
-- ============================================
-- Order 1 items (Italian Corner)
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
('20000000-0000-0000-0000-000000000001', (SELECT id FROM menu_items WHERE name = 'Margherita Pizza' LIMIT 1), 1, 12.99),
('20000000-0000-0000-0000-000000000001', (SELECT id FROM menu_items WHERE name = 'Spaghetti Carbonara' LIMIT 1), 1, 15.99),
('20000000-0000-0000-0000-000000000001', (SELECT id FROM menu_items WHERE name = 'Tiramisu' LIMIT 1), 1, 7.99);

-- Order 2 items (Taco Fiesta)
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
('20000000-0000-0000-0000-000000000002', (SELECT id FROM menu_items WHERE name = 'Beef Tacos' LIMIT 1), 2, 9.99),
('20000000-0000-0000-0000-000000000002', (SELECT id FROM menu_items WHERE name = 'Nachos Supreme' LIMIT 1), 1, 10.99);

-- Order 3 items (Burger Palace)
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
('20000000-0000-0000-0000-000000000003', (SELECT id FROM menu_items WHERE name = 'Classic Cheeseburger' LIMIT 1), 2, 11.99),
('20000000-0000-0000-0000-000000000003', (SELECT id FROM menu_items WHERE name = 'Loaded Fries' LIMIT 1), 1, 7.99);

-- ============================================
-- SUMMARY
-- ============================================
SELECT 'Seeding complete!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_restaurants FROM restaurants;
SELECT COUNT(*) as total_menu_items FROM menu_items;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_order_items FROM order_items;
