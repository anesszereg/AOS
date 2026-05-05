# Seed Data Information

## 📊 Database Seeded Successfully!

### **Data Summary:**
- ✅ **10 Users** (Admin, Restaurant Owners, Customers, Drivers)
- ✅ **5 Restaurants** (Various cuisines)
- ✅ **25 Menu Items** (5 items per restaurant)
- ✅ **3 Orders** (Sample orders with items)
- ✅ **7 Order Items** (Items in orders)

---

## 👥 **Test Accounts**

All passwords: `password123`

### **Admin**
- Email: `1`
- Role: Admin
- Use for: Admin panel testing

### **Restaurant Owners**
1. Email: `owner1@restaurant.com` - The Italian Corner
2. Email: `owner2@restaurant.com` - Taco Fiesta
3. Email: `owner3@restaurant.com` - Dragon Wok
4. Email: `owner4@restaurant.com` - Burger Palace

### **Customers**
1. Email: `customer1@example.com` - Alice Brown
2. Email: `customer2@example.com` - Bob Wilson
3. Email: `customer3@example.com` - Carol Davis

### **Drivers**
1. Email: `driver1@delivery.com` - Mike Thompson
2. Email: `driver2@delivery.com` - Lisa Anderson

---

## 🍽️ **Restaurants**

### 1. **The Italian Corner** 🇮🇹
- **Cuisine**: Italian
- **Rating**: 4.5/5
- **Menu**: Pizza, Pasta, Desserts
- **Items**: Margherita Pizza, Pepperoni Pizza, Spaghetti Carbonara, Fettuccine Alfredo, Tiramisu

### 2. **Taco Fiesta** 🌮
- **Cuisine**: Mexican
- **Rating**: 4.7/5
- **Menu**: Tacos, Burritos, Quesadillas
- **Items**: Beef Tacos, Chicken Burrito, Veggie Quesadilla, Nachos Supreme, Churros

### 3. **Dragon Wok** 🥡
- **Cuisine**: Chinese
- **Rating**: 4.3/5
- **Menu**: Stir-fry, Rice, Noodles
- **Items**: Kung Pao Chicken, Sweet and Sour Pork, Vegetable Fried Rice, Spring Rolls, Mango Pudding

### 4. **Burger Palace** 🍔
- **Cuisine**: American
- **Rating**: 4.6/5
- **Menu**: Burgers, Sides, Drinks
- **Items**: Classic Cheeseburger, Bacon BBQ Burger, Veggie Burger, Loaded Fries, Chocolate Milkshake

### 5. **Sushi Master** 🍣
- **Cuisine**: Japanese
- **Rating**: 4.8/5
- **Menu**: Sushi, Rolls, Sashimi
- **Items**: California Roll, Spicy Tuna Roll, Salmon Sashimi, Dragon Roll, Miso Soup

---

## 📦 **Sample Orders**

### Order 1 - Delivered
- **Customer**: Alice Brown
- **Restaurant**: The Italian Corner
- **Items**: Margherita Pizza, Spaghetti Carbonara, Tiramisu
- **Total**: $35.97
- **Status**: Delivered

### Order 2 - In Progress
- **Customer**: Bob Wilson
- **Restaurant**: Taco Fiesta
- **Items**: 2x Beef Tacos, Nachos Supreme
- **Total**: $28.97
- **Status**: In Progress

### Order 3 - Pending
- **Customer**: Carol Davis
- **Restaurant**: Burger Palace
- **Items**: 2x Classic Cheeseburger, Loaded Fries
- **Total**: $32.97
- **Status**: Pending

---

## 🧪 **Testing**

### **Login Test**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@example.com","password":"password123"}'
```

### **Get Restaurants**
```bash
curl http://localhost:3000/api/restaurants
```

### **Get Menu for Restaurant**
```bash
# Get first restaurant ID, then:
curl http://localhost:3000/api/menu/restaurant/RESTAURANT_ID
```

---

## 🔄 **Re-seed Database**

To clear and re-seed:
```bash
psql -d food_delivery -f seed-data.sql
```

---

## 📝 **Notes**

- All images use Unsplash URLs (placeholder images)
- Prices are in USD
- Ratings are on a 5-point scale
- All users have the same password for easy testing
- Orders have realistic delivery addresses
- Menu items have categories for filtering

---

## ✅ **Ready for Testing!**

You can now:
- ✅ Login with any test account
- ✅ Browse restaurants
- ✅ View menus
- ✅ Place orders (as customer)
- ✅ Manage restaurant (as owner)
- ✅ View admin panel (as admin)
- ✅ Accept deliveries (as driver)
