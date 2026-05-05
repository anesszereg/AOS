# Food Delivery Platform

## Quick Start

### 1. Set Database URL
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/food_delivery"
```

### 2. Start Server
```bash
npm start
```

### 3. Access Frontend
Open: https://fooddelevryapp.vercel.app

## Architecture

- **Backend**: localhost:3000 (all microservices)
- **Frontend**: Vercel (https://fooddelevryapp.vercel.app)
- **Database**: PostgreSQL

## Available Commands

```bash
npm start       # Start local server
npm run dev     # Build and start
```

## API Endpoints

- Auth: `/api/auth`
- Restaurants: `/api/restaurants`
- Menu: `/api/menu`
- Users: `/api/users`
- Orders: `/api/orders`
- Payments: `/api/payments`
- Delivery: `/api/delivery`

## Admin Endpoints

- Users: `/api/users/admin/*`
- Restaurants: `/api/restaurants/admin/*`
