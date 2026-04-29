import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';
import { MenuItem } from '../models/MenuItem';
import { Order } from '../models/Order';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

// Seed Users
const seedUsers = async () => {
  const users = [
    // Customers
    {
      email: 'customer1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'customer',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      addresses: [
        {
          street: '456 Oak Ave',
          city: 'Naperville',
          state: 'IL',
          zipCode: '60563',
          isDefault: true
        }
      ]
    },
    {
      email: 'customer2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'customer',
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      addresses: [
        {
          street: '789 Pine Rd',
          city: 'Naperville',
          state: 'IL',
          zipCode: '60540',
          isDefault: true
        }
      ]
    },
    // Restaurant Owners
    {
      email: 'restaurant1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'restaurant',
      name: 'Luigi Rossi',
      phone: '+1 (555) 111-2222'
    },
    {
      email: 'restaurant2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'restaurant',
      name: 'Sushi Master',
      phone: '+1 (555) 333-4444'
    },
    {
      email: 'restaurant3@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'restaurant',
      name: 'Burger Boss',
      phone: '+1 (555) 555-6666'
    },
    // Drivers
    {
      email: 'driver1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'driver',
      name: 'Bob Driver',
      phone: '+1 (555) 777-8888',
      vehicleInfo: {
        make: 'Honda',
        model: 'Civic',
        year: '2020',
        licensePlate: 'ABC 123'
      }
    },
    {
      email: 'driver2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'driver',
      name: 'Alice Wheeler',
      phone: '+1 (555) 999-0000',
      vehicleInfo: {
        make: 'Toyota',
        model: 'Camry',
        year: '2021',
        licensePlate: 'XYZ 789'
      }
    },
    // Admin
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      name: 'Admin User',
      phone: '+1 (555) 000-1111'
    }
  ];

  await User.insertMany(users);
  console.log('✅ Users seeded');
  return users;
};

// Seed Restaurants
const seedRestaurants = async (users: any[]) => {
  const restaurantOwner1 = users.find(u => u.email === 'restaurant1@example.com');
  const restaurantOwner2 = users.find(u => u.email === 'restaurant2@example.com');
  const restaurantOwner3 = users.find(u => u.email === 'restaurant3@example.com');

  const restaurants = [
    {
      name: "Luigi's Pizzeria",
      owner: restaurantOwner1._id,
      cuisine: 'Italian',
      description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
      address: {
        street: '123 Main St',
        city: 'Naperville',
        state: 'IL',
        zipCode: '60540'
      },
      phone: '+1 (555) 123-4567',
      email: 'luigi@pizzeria.com',
      rating: 4.7,
      totalReviews: 245,
      deliveryFee: 3.99,
      minimumOrder: 15.00,
      estimatedDeliveryTime: '30-45 min',
      isActive: true,
      businessHours: [
        { day: 'Monday', open: '11:00', close: '22:00', closed: false },
        { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
        { day: 'Wednesday', open: '11:00', close: '22:00', closed: false },
        { day: 'Thursday', open: '11:00', close: '22:00', closed: false },
        { day: 'Friday', open: '11:00', close: '23:00', closed: false },
        { day: 'Saturday', open: '11:00', close: '23:00', closed: false },
        { day: 'Sunday', open: '12:00', close: '21:00', closed: false }
      ]
    },
    {
      name: 'Sushi Palace',
      owner: restaurantOwner2._id,
      cuisine: 'Japanese',
      description: 'Fresh sushi and authentic Japanese dishes',
      address: {
        street: '555 Market St',
        city: 'Naperville',
        state: 'IL',
        zipCode: '60563'
      },
      phone: '+1 (555) 333-4444',
      email: 'info@sushipalace.com',
      rating: 4.8,
      totalReviews: 189,
      deliveryFee: 4.99,
      minimumOrder: 20.00,
      estimatedDeliveryTime: '40-50 min',
      isActive: true,
      businessHours: [
        { day: 'Monday', open: '11:30', close: '22:00', closed: false },
        { day: 'Tuesday', open: '11:30', close: '22:00', closed: false },
        { day: 'Wednesday', open: '11:30', close: '22:00', closed: false },
        { day: 'Thursday', open: '11:30', close: '22:00', closed: false },
        { day: 'Friday', open: '11:30', close: '23:00', closed: false },
        { day: 'Saturday', open: '11:30', close: '23:00', closed: false },
        { day: 'Sunday', open: '12:00', close: '22:00', closed: false }
      ]
    },
    {
      name: 'Burger House',
      owner: restaurantOwner3._id,
      cuisine: 'American',
      description: 'Gourmet burgers and classic American favorites',
      address: {
        street: '789 Elm St',
        city: 'Naperville',
        state: 'IL',
        zipCode: '60540'
      },
      phone: '+1 (555) 555-6666',
      email: 'hello@burgerhouse.com',
      rating: 4.5,
      totalReviews: 312,
      deliveryFee: 2.99,
      minimumOrder: 12.00,
      estimatedDeliveryTime: '25-35 min',
      isActive: true,
      businessHours: [
        { day: 'Monday', open: '10:00', close: '23:00', closed: false },
        { day: 'Tuesday', open: '10:00', close: '23:00', closed: false },
        { day: 'Wednesday', open: '10:00', close: '23:00', closed: false },
        { day: 'Thursday', open: '10:00', close: '23:00', closed: false },
        { day: 'Friday', open: '10:00', close: '00:00', closed: false },
        { day: 'Saturday', open: '10:00', close: '00:00', closed: false },
        { day: 'Sunday', open: '10:00', close: '23:00', closed: false }
      ]
    }
  ];

  const createdRestaurants = await Restaurant.insertMany(restaurants);
  console.log('✅ Restaurants seeded');
  return createdRestaurants;
};

// Seed Menu Items
const seedMenuItems = async (restaurants: any[]) => {
  const luigis = restaurants.find(r => r.name === "Luigi's Pizzeria");
  const sushi = restaurants.find(r => r.name === 'Sushi Palace');
  const burger = restaurants.find(r => r.name === 'Burger House');

  const menuItems = [
    // Luigi's Pizzeria Menu
    {
      restaurant: luigis._id,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 18.99,
      category: 'Pizza',
      isAvailable: true,
      preparationTime: 20,
      isVegetarian: true
    },
    {
      restaurant: luigis._id,
      name: 'Pepperoni Pizza',
      description: 'Traditional pepperoni pizza with extra cheese',
      price: 20.99,
      category: 'Pizza',
      isAvailable: true,
      preparationTime: 20
    },
    {
      restaurant: luigis._id,
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with bacon, eggs, and parmesan',
      price: 16.99,
      category: 'Pasta',
      isAvailable: true,
      preparationTime: 15
    },
    {
      restaurant: luigis._id,
      name: 'Fettuccine Alfredo',
      description: 'Rich and creamy Alfredo sauce with fettuccine pasta',
      price: 15.99,
      category: 'Pasta',
      isAvailable: true,
      preparationTime: 15,
      isVegetarian: true
    },
    {
      restaurant: luigis._id,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing and croutons',
      price: 12.99,
      category: 'Salads',
      isAvailable: true,
      preparationTime: 10,
      isVegetarian: true
    },
    {
      restaurant: luigis._id,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers',
      price: 8.99,
      category: 'Desserts',
      isAvailable: true,
      preparationTime: 5,
      isVegetarian: true
    },
    
    // Sushi Palace Menu
    {
      restaurant: sushi._id,
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber roll',
      price: 12.99,
      category: 'Rolls',
      isAvailable: true,
      preparationTime: 15
    },
    {
      restaurant: sushi._id,
      name: 'Spicy Tuna Roll',
      description: 'Fresh tuna with spicy mayo',
      price: 14.99,
      category: 'Rolls',
      isAvailable: true,
      preparationTime: 15
    },
    {
      restaurant: sushi._id,
      name: 'Salmon Nigiri',
      description: 'Fresh salmon over sushi rice (2 pieces)',
      price: 8.99,
      category: 'Nigiri',
      isAvailable: true,
      preparationTime: 10
    },
    {
      restaurant: sushi._id,
      name: 'Tuna Sashimi',
      description: 'Fresh sliced tuna (6 pieces)',
      price: 16.99,
      category: 'Sashimi',
      isAvailable: true,
      preparationTime: 10
    },
    {
      restaurant: sushi._id,
      name: 'Miso Soup',
      description: 'Traditional Japanese soup with tofu and seaweed',
      price: 4.99,
      category: 'Soups',
      isAvailable: true,
      preparationTime: 5,
      isVegetarian: true
    },
    
    // Burger House Menu
    {
      restaurant: burger._id,
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, onion, and special sauce',
      price: 12.99,
      category: 'Burgers',
      isAvailable: true,
      preparationTime: 15
    },
    {
      restaurant: burger._id,
      name: 'Cheeseburger',
      description: 'Classic burger with melted cheddar cheese',
      price: 13.99,
      category: 'Burgers',
      isAvailable: true,
      preparationTime: 15
    },
    {
      restaurant: burger._id,
      name: 'Bacon Burger',
      description: 'Burger topped with crispy bacon and BBQ sauce',
      price: 15.99,
      category: 'Burgers',
      isAvailable: true,
      preparationTime: 18
    },
    {
      restaurant: burger._id,
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 4.99,
      category: 'Sides',
      isAvailable: true,
      preparationTime: 10,
      isVegetarian: true
    },
    {
      restaurant: burger._id,
      name: 'Onion Rings',
      description: 'Crispy battered onion rings',
      price: 5.99,
      category: 'Sides',
      isAvailable: true,
      preparationTime: 12,
      isVegetarian: true
    },
    {
      restaurant: burger._id,
      name: 'Milkshake',
      description: 'Creamy vanilla milkshake',
      price: 6.99,
      category: 'Drinks',
      isAvailable: true,
      preparationTime: 5,
      isVegetarian: true
    }
  ];

  await MenuItem.insertMany(menuItems);
  console.log('✅ Menu items seeded');
};

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed data
    const users = await seedUsers();
    const restaurants = await seedRestaurants(users);
    await seedMenuItems(restaurants);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Customer: customer1@example.com / password123');
    console.log('Restaurant: restaurant1@example.com / password123');
    console.log('Driver: driver1@example.com / password123');
    console.log('Admin: admin@example.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
