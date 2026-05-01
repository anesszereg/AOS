module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'server.js',
      env: {
        PORT: process.env.PORT || 10000,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'auth-service',
      script: 'services/auth-service/dist/index.js',
      env: {
        PORT: 3001,
        SERVICE_NAME: 'auth-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'user-service',
      script: 'services/user-service/dist/index.js',
      env: {
        PORT: 3002,
        SERVICE_NAME: 'user-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'restaurant-service',
      script: 'services/restaurant-service/dist/index.js',
      env: {
        PORT: 3003,
        SERVICE_NAME: 'restaurant-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'menu-service',
      script: 'services/menu-service/dist/index.js',
      env: {
        PORT: 3004,
        SERVICE_NAME: 'menu-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'order-service',
      script: 'services/order-service/dist/index.js',
      env: {
        PORT: 3005,
        SERVICE_NAME: 'order-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'payment-service',
      script: 'services/payment-service/dist/index.js',
      env: {
        PORT: 3006,
        SERVICE_NAME: 'payment-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'delivery-service',
      script: 'services/delivery-service/dist/index.js',
      env: {
        PORT: 3007,
        SERVICE_NAME: 'delivery-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    {
      name: 'notification-service',
      script: 'services/notification-service/dist/index.js',
      env: {
        PORT: 3008,
        SERVICE_NAME: 'notification-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    }
  ]
};
