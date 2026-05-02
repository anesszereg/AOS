# Render Environment Variables Configuration

## API Gateway Service

You need to add these environment variables to your API Gateway service on Render:

```
AUTH_SERVICE_URL=https://your-auth-service.onrender.com
USER_SERVICE_URL=https://your-user-service.onrender.com
RESTAURANT_SERVICE_URL=https://your-restaurant-service.onrender.com
MENU_SERVICE_URL=https://your-menu-service.onrender.com
ORDER_SERVICE_URL=https://your-order-service.onrender.com
PAYMENT_SERVICE_URL=https://your-payment-service.onrender.com
DELIVERY_SERVICE_URL=https://your-delivery-service.onrender.com
NOTIFICATION_SERVICE_URL=https://your-notification-service.onrender.com
```

## How to Add Environment Variables on Render:

1. Go to https://dashboard.render.com
2. Click on your API Gateway service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable above with the actual Render URLs of your services

## Finding Your Service URLs:

1. Go to each service in Render dashboard
2. Copy the URL (e.g., `https://service-name-xxxx.onrender.com`)
3. Use that URL as the value for the corresponding environment variable

**Note:** After adding environment variables, Render will automatically redeploy the service.
