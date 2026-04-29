module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'services/auth-service/dist/index.js',
      env: {
        PORT: 3001,
        SERVICE_NAME: 'auth-service'
      }
    },
    {
      name: 'user-service',
      script: 'services/user-service/dist/index.js',
      env: {
        PORT: 3002,
        SERVICE_NAME: 'user-service'
      }
    },
    {
      name: 'restaurant-service',
      script: 'services/restaurant-service/dist/index.js',
      env: {
        PORT: 3003,
        SERVICE_NAME: 'restaurant-service'
      }
    },
    {
      name: 'menu-service',
      script: 'services/menu-service/dist/index.js',
      env: {
        PORT: 3004,
        SERVICE_NAME: 'menu-service'
      }
    },
    {
      name: 'order-service',
      script: 'services/order-service/dist/index.js',
      env: {
        PORT: 3005,
        SERVICE_NAME: 'order-service'
      }
    },
    {
      name: 'payment-service',
      script: 'services/payment-service/dist/index.js',
      env: {
        PORT: 3006,
        SERVICE_NAME: 'payment-service'
      }
    },
    {
      name: 'delivery-service',
      script: 'services/delivery-service/dist/index.js',
      env: {
        PORT: 3007,
        SERVICE_NAME: 'delivery-service'
      }
    },
    {
      name: 'notification-service',
      script: 'services/notification-service/dist/index.js',
      env: {
        PORT: 3008,
        SERVICE_NAME: 'notification-service'
      }
    }
  ]
};
