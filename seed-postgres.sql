-- PostgreSQL Seed Script for Food Delivery Platform
-- This script creates test users and data for all services

-- ============================================
-- AUTH SERVICE DATABASE (auth_db)
-- ============================================

\c auth_db;

-- Insert test users
INSERT INTO users (email, password_hash, role, is_active, email_verified, created_at) VALUES
-- Customers
('customer1@example.com', '$2a$10$YourHashedPasswordHere', 'customer', true, true, NOW()),
('customer2@example.com', '$2a$10$YourHashedPasswordHere', 'customer', true, true, NOW()),
-- Restaurant Owners
('restaurant1@example.com', '$2a$10$YourHashedPasswordHere', 'restaurant', true, true, NOW()),
('restaurant2@example.com', '$2a$10$YourHashedPasswordHere', 'restaurant', true, true, NOW()),
('restaurant3@example.com', '$2a$10$YourHashedPasswordHere', 'restaurant', true, true, NOW()),
-- Drivers
('driver1@example.com', '$2a$10$YourHashedPasswordHere', 'driver', true, true, NOW()),
('driver2@example.com', '$2a$10$YourHashedPasswordHere', 'driver', true, true, NOW()),
-- Admin
('admin@example.com', '$2a$10$YourHashedPasswordHere', 'admin', true, true, NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- CREDENTIALS FOR TESTING
-- ============================================
-- Email: customer1@example.com | Password: password123
-- Email: customer2@example.com | Password: password123
-- Email: restaurant1@example.com | Password: password123
-- Email: restaurant2@example.com | Password: password123
-- Email: restaurant3@example.com | Password: password123
-- Email: driver1@example.com | Password: password123
-- Email: driver2@example.com | Password: password123
-- Email: admin@example.com | Password: admin123
