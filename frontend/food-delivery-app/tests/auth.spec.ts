import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="role"]', 'customer');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', 'customer1@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Should show user info
    await expect(page.locator('text=customer1@example.com')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/invalid credentials|login failed/i')).toBeVisible();
  });

  test('should logout user', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'customer1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await page.click('button:has-text("Logout")');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'customer1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should browse restaurants', async ({ page }) => {
    await page.goto('/dashboard');

    // Should show restaurants
    await expect(page.locator('[data-testid="restaurant-card"]').first()).toBeVisible();
  });

  test('should view restaurant details', async ({ page }) => {
    await page.goto('/dashboard');

    // Click on first restaurant
    await page.locator('[data-testid="restaurant-card"]').first().click();

    // Should show menu items
    await expect(page.locator('[data-testid="menu-item"]').first()).toBeVisible();
  });

  test('should add items to cart', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('[data-testid="restaurant-card"]').first().click();

    // Add item to cart
    await page.locator('[data-testid="add-to-cart"]').first().click();

    // Cart should show 1 item
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('should complete checkout', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('[data-testid="restaurant-card"]').first().click();
    await page.locator('[data-testid="add-to-cart"]').first().click();

    // Go to cart
    await page.click('[data-testid="cart-button"]');

    // Proceed to checkout
    await page.click('button:has-text("Checkout")');

    // Fill delivery address
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="zip"]', '10001');

    // Place order
    await page.click('button:has-text("Place Order")');

    // Should show confirmation
    await expect(page.locator('text=/order confirmed|thank you/i')).toBeVisible();
  });
});

test.describe('Restaurant Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as restaurant owner
    await page.goto('/login');
    await page.fill('input[name="email"]', 'restaurant1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should view incoming orders', async ({ page }) => {
    await page.goto('/restaurant/orders');

    // Should show orders tab
    await expect(page.locator('text=Incoming Orders')).toBeVisible();
  });

  test('should manage menu items', async ({ page }) => {
    await page.goto('/restaurant/menu');

    // Should show menu items
    await expect(page.locator('[data-testid="menu-item"]').first()).toBeVisible();
  });
});

test.describe('Driver Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as driver
    await page.goto('/login');
    await page.fill('input[name="email"]', 'driver1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should toggle online status', async ({ page }) => {
    await page.goto('/driver/dashboard');

    // Toggle online
    await page.click('button:has-text("Go Online")');

    // Should show online status
    await expect(page.locator('text=/you are online/i')).toBeVisible();
  });

  test('should view available orders', async ({ page }) => {
    await page.goto('/driver/available-orders');

    // Should show available orders list
    await expect(page.locator('text=Available Orders')).toBeVisible();
  });
});
