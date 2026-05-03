# 🌱 Database Seeding Guide

Complete guide to populate your database with comprehensive test data for frontend testing.

---

## 📊 **What Gets Seeded**

### **Users (16 total)**
- **3 Customers** - For testing customer flows
- **8 Restaurant Owners** - Each owns one restaurant
- **3 Drivers** - For testing delivery flows
- **1 Admin** - For testing admin panel

### **Restaurants (8 total)**
1. **Luigi's Pizzeria** - Italian 🍕
2. **Sushi Palace** - Japanese 🍣
3. **Burger House** - American 🍔
4. **Taco Fiesta** - Mexican 🌮
5. **Dragon Wok** - Chinese 🥡
6. **Thai Spice** - Thai 🍜
7. **India Curry House** - Indian 🍛
8. **French Bistro** - French 🥐

### **Menu Items (40+ items)**
- Each restaurant has 4-8 menu items
- Includes appetizers, mains, sides, desserts
- All items have images, prices, descriptions
- Vegetarian/vegan flags included
- Calorie information provided

---

## 🚀 **How to Run**

### **Option 1: Using Node.js Script (Recommended)**

```bash
# Make sure you're in the project root
cd /Users/mac/Desktop/AOS\ orriject/food-delivery-platform

# Run the seeding script
node seed-database.js
```

**Output:**
```
🌱 Starting database seeding...

👥 Seeding users...
✅ Created 16 users

🍽️  Seeding restaurants...
✅ Created 8 restaurants

🍕 Seeding menu items...
✅ Created 40+ menu items

🎉 Database seeding completed successfully!

📊 Summary:
   - 16 users created
   - 8 restaurants created
   - 40+ menu items created

✅ Test credentials (password: Test123456!):
   - customer1@test.com (Customer)
   - luigi@pizzeria.com (Restaurant Owner)
   - driver1@test.com (Driver)
   - admin@test.com (Admin)
```

### **Option 2: Using SQL File**

```bash
# Connect to your database
psql $DATABASE_URL -f seed-database.sql
```

---

## 🔑 **Test Credentials**

All accounts use the same password: **`Test123456!`**

### **Customers**
```
customer1@test.com
customer2@test.com
customer3@test.com
```

### **Restaurant Owners**
```
luigi@pizzeria.com       - Luigi's Pizzeria
sushi@palace.com         - Sushi Palace
burger@house.com         - Burger House
taco@fiesta.com          - Taco Fiesta
dragon@wok.com           - Dragon Wok
thai@spice.com           - Thai Spice
india@curry.com          - India Curry House
french@bistro.com        - French Bistro
```

### **Drivers**
```
driver1@test.com
driver2@test.com
driver3@test.com
```

### **Admin**
```
admin@test.com
```

---

## 🧪 **Testing Workflows**

### **1. Customer Flow**
```
1. Login as: customer1@test.com
2. Browse restaurants at /browse
3. Click on "Luigi's Pizzeria"
4. View menu items (8 items)
5. Add items to cart
6. Proceed to checkout
```

### **2. Restaurant Owner Flow**
```
1. Login as: luigi@pizzeria.com
2. View restaurant dashboard
3. See menu items (8 items)
4. Manage orders
5. View reviews
```

### **3. Driver Flow**
```
1. Login as: driver1@test.com
2. View available orders
3. Accept delivery
4. Track delivery
5. View earnings
```

### **4. Admin Flow**
```
1. Login as: admin@test.com
2. View all users (16 users)
3. View all restaurants (8 restaurants)
4. Manage content
5. Handle support tickets
```

---

## 📋 **Database Schema**

### **Users Table** (auth_db)
```sql
- id (UUID)
- email (VARCHAR)
- password_hash (VARCHAR)
- role (customer|restaurant|driver|admin)
- is_active (BOOLEAN)
- email_verified (BOOLEAN)
- created_at (TIMESTAMP)
```

### **Restaurants Table** (restaurant_db)
```sql
- id (UUID)
- owner_id (UUID)
- name (VARCHAR)
- cuisine (VARCHAR)
- description (TEXT)
- address_street, address_city, address_state, address_zip
- phone, email
- rating (DECIMAL)
- total_reviews (INTEGER)
- delivery_fee (DECIMAL)
- minimum_order (DECIMAL)
- estimated_delivery_time (VARCHAR)
- is_active (BOOLEAN)
- image (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

### **Menu Items Table** (menu_db)
```sql
- id (UUID)
- restaurant_id (UUID)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- category (VARCHAR)
- image (VARCHAR)
- is_available (BOOLEAN)
- is_vegetarian (BOOLEAN)
- is_vegan (BOOLEAN)
- is_gluten_free (BOOLEAN)
- calories (INTEGER)
- prep_time (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

---

## 🎨 **Sample Data Details**

### **Luigi's Pizzeria Menu**
- Margherita Pizza - $18.99
- Pepperoni Pizza - $20.99
- Quattro Formaggi - $22.99
- Spaghetti Carbonara - $16.99
- Fettuccine Alfredo - $15.99
- Lasagna Bolognese - $19.99
- Tiramisu - $8.99
- Caprese Salad - $12.99

### **Sushi Palace Menu**
- California Roll - $12.99
- Spicy Tuna Roll - $14.99
- Dragon Roll - $18.99
- Salmon Nigiri (6pc) - $16.99
- Tuna Sashimi (8pc) - $22.99
- Miso Soup - $4.99
- Edamame - $5.99
- Green Tea Ice Cream - $6.99

### **Burger House Menu**
- Classic Cheeseburger - $13.99
- Bacon BBQ Burger - $15.99
- Mushroom Swiss Burger - $14.99
- Veggie Burger - $12.99
- French Fries - $4.99
- Onion Rings - $5.99
- Chocolate Milkshake - $6.99
- Buffalo Wings (8pc) - $11.99

---

## 🔄 **Re-seeding**

To clear and re-seed the database:

```bash
# The script automatically deletes existing data before inserting
node seed-database.js
```

**Warning:** This will delete all existing:
- Users
- Restaurants
- Menu items
- Orders (if any)
- Reviews (if any)

---

## ✅ **Verification**

After seeding, verify the data:

```bash
# Check restaurants
curl https://food-delevery-app-g73l.onrender.com/api/restaurants | jq .

# Check specific restaurant
curl https://food-delevery-app-g73l.onrender.com/api/restaurants/8bc47665-1384-4b6b-802f-34ffd764eac0 | jq .

# Check menu items
curl https://food-delevery-app-g73l.onrender.com/api/restaurants/8bc47665-1384-4b6b-802f-34ffd764eac0/menu | jq .
```

---

## 🐛 **Troubleshooting**

### **Error: DATABASE_URL not set**
```bash
# Make sure .env file has DATABASE_URL
echo $DATABASE_URL

# Or set it manually
export DATABASE_URL="your-database-url"
```

### **Error: Connection refused**
- Check if database is running
- Verify DATABASE_URL is correct
- Check SSL settings

### **Error: Table does not exist**
- Run migrations first
- Services create tables on startup
- Check service logs

---

## 📝 **Notes**

- All images use Unsplash URLs (free, no attribution required)
- Password hash is for "Test123456!" (bcrypt)
- UUIDs are fixed for consistency
- All restaurants are in Naperville, IL
- Delivery fees range from $2.99 to $5.99
- Ratings range from 4.50 to 4.85

---

**Happy Testing!** 🎉
