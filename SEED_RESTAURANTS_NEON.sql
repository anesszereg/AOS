-- SEED RESTAURANTS FOR NEON DATABASE
-- Copy and paste this into your Neon SQL Editor

INSERT INTO restaurants (owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, rating, delivery_fee, estimated_delivery_time, is_active, image)
VALUES 
-- Italian
((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Luigi''s Pizzeria', 'Italian', 'Authentic Italian pizza and pasta made with love', '123 Main Street', 'Naperville', 'IL', '60540', '+1-630-555-0101', 4.7, 3.99, '30-45 min', true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Bella Italia', 'Italian', 'Fine Italian dining with fresh ingredients', '456 Oak Avenue', 'Naperville', 'IL', '60540', '+1-630-555-0102', 4.8, 4.99, '35-50 min', true, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Pizza Paradise', 'Italian', 'New York style pizza with thin crust', '777 Cheese Lane', 'Naperville', 'IL', '60540', '+1-630-555-0115', 4.7, 2.99, '25-35 min', true, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'),

-- Japanese
((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Sushi Palace', 'Japanese', 'Premium sushi and Japanese cuisine', '789 Cherry Lane', 'Naperville', 'IL', '60540', '+1-630-555-0103', 4.9, 5.99, '40-55 min', true, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Tokyo Express', 'Japanese', 'Quick Japanese food - ramen and bento', '321 Bamboo Street', 'Naperville', 'IL', '60540', '+1-630-555-0104', 4.6, 3.49, '25-35 min', true, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400'),

-- American
((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Burger House', 'American', 'Juicy burgers and classic American food', '555 Grill Road', 'Naperville', 'IL', '60540', '+1-630-555-0105', 4.5, 2.99, '20-30 min', true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'The Steakhouse', 'American', 'Premium steaks and BBQ', '777 Beef Boulevard', 'Naperville', 'IL', '60540', '+1-630-555-0106', 4.8, 6.99, '45-60 min', true, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'),

-- Mexican
((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Taco Fiesta', 'Mexican', 'Authentic Mexican tacos and burritos', '888 Salsa Street', 'Naperville', 'IL', '60540', '+1-630-555-0107', 4.7, 3.49, '25-35 min', true, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'El Mariachi', 'Mexican', 'Traditional Mexican with modern twist', '999 Guacamole Lane', 'Naperville', 'IL', '60540', '+1-630-555-0108', 4.6, 4.49, '30-40 min', true, 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400'),

-- Chinese
((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Golden Dragon', 'Chinese', 'Authentic Chinese dim sum and noodles', '111 Wok Way', 'Naperville', 'IL', '60540', '+1-630-555-0109', 4.5, 3.99, '30-45 min', true, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Panda Garden', 'Chinese', 'Family-style Chinese restaurant', '222 Rice Road', 'Naperville', 'IL', '60540', '+1-630-555-0110', 4.4, 2.99, '25-35 min', true, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'),

-- Other Cuisines
((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Thai Orchid', 'Thai', 'Authentic Thai with bold flavors', '333 Spice Street', 'Naperville', 'IL', '60540', '+1-630-555-0111', 4.7, 4.49, '35-45 min', true, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Mediterranean Delight', 'Mediterranean', 'Fresh Mediterranean cuisine', '444 Olive Avenue', 'Naperville', 'IL', '60540', '+1-630-555-0112', 4.6, 3.99, '30-40 min', true, 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Indian Spice', 'Indian', 'Authentic Indian tandoori and curry', '555 Curry Court', 'Naperville', 'IL', '60540', '+1-630-555-0113', 4.8, 4.99, '40-50 min', true, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'),

((SELECT id FROM users WHERE role = 'restaurant' LIMIT 1), 'Healthy Bowls', 'Healthy', 'Fresh healthy bowls and salads', '666 Wellness Way', 'Naperville', 'IL', '60540', '+1-630-555-0114', 4.9, 3.49, '20-30 min', true, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400');
