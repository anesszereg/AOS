# 🧪 Testing Strategy

## Test Pyramid

```
        /\
       /E2E\
      /------\
     /Integration\
    /--------------\
   /   Unit Tests   \
  /------------------\
```

## Unit Tests

### Auth Service Example

```typescript
// auth.service.test.ts
import { authService } from '../services/auth.service';
import { userModel } from '../models/user.model';

describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        role: 'customer' as const,
      };

      const result = await authService.register(userData);

      expect(result.user.email).toBe(userData.email);
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        role: 'customer' as const,
      };

      await expect(authService.register(userData)).rejects.toThrow();
    });
  });
});
```

## Integration Tests

### Order Flow Test

```typescript
describe('Order Flow Integration', () => {
  it('should complete full order flow', async () => {
    // 1. Create order
    const order = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData)
      .expect(201);

    // 2. Verify payment initiated
    await waitForEvent('payment.initiated');

    // 3. Process payment
    const payment = await request(paymentApp)
      .post('/api/v1/payments/process')
      .send({ orderId: order.body.data.id })
      .expect(200);

    // 4. Verify delivery assigned
    await waitForEvent('delivery.assigned');

    // 5. Check order status updated
    const updatedOrder = await request(app)
      .get(`/api/v1/orders/${order.body.data.id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(updatedOrder.body.data.status).toBe('confirmed');
  });
});
```

## E2E Tests

Use Playwright for frontend testing.

## Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```
