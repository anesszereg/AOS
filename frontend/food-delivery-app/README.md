# Food Delivery Platform - React Frontend

Modern, responsive React application for the food delivery platform with role-based dashboards.

## Features

- **Authentication** - Login/Register with JWT
- **Customer Portal** - Browse restaurants, place orders
- **Restaurant Dashboard** - Manage menu and orders
- **Driver Dashboard** - Accept and track deliveries
- **Profile Management** - Update user information

## Tech Stack

- React 18
- TypeScript
- React Router v6
- Zustand (State Management)
- Axios (API calls)
- Vite (Build tool)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Available Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── CustomerHome.tsx
│   ├── RestaurantDashboard.tsx
│   ├── DriverDashboard.tsx
│   └── Profile.tsx
├── services/        # API integration
│   └── api.ts
├── store/           # State management
│   └── authStore.ts
├── styles/          # CSS files
│   ├── Auth.css
│   └── Dashboard.css
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## API Integration

The app connects to backend services:
- Auth Service: http://localhost:3001
- User Service: http://localhost:3002

## Environment Setup

Make sure backend services are running:
```bash
# Auth Service
cd services/auth-service && npm run dev

# User Service
cd services/user-service && npm run dev
```

## User Roles

- **Customer** - Browse and order food
- **Restaurant** - Manage restaurant and menu
- **Driver** - Deliver orders
- **Admin** - Platform management

## Features by Role

### Customer
- Browse restaurants
- Search menu items
- Place orders
- Track deliveries
- Manage profile

### Restaurant Owner
- Manage menu items
- View orders
- Update restaurant info
- Track revenue

### Driver
- Accept deliveries
- Update delivery status
- Track earnings
- View delivery history

## Development

The app uses:
- **Vite** for fast development and HMR
- **TypeScript** for type safety
- **Zustand** for lightweight state management
- **React Router** for navigation

## Production Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

## License

MIT
