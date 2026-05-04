import axios, { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Direct service URLs - no proxy
const AUTH_SERVICE_URL = 'https://food-delevery-app-g73l.onrender.com/api/auth';
const RESTAURANT_SERVICE_URL = 'https://food-delevery-app-g73l.onrender.com/api/v1/restaurants';
const MENU_SERVICE_URL = 'https://food-delevery-app-g73l.onrender.com/api/v1/menu';
const USER_SERVICE_URL = 'https://food-delevery-app-g73l.onrender.com/api/v1/users';

// Create axios instance with common config
const createApiClient = (baseURL: string) => axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Create separate clients for each service
const authApi = createApiClient(AUTH_SERVICE_URL);
const restaurantApi = createApiClient(RESTAURANT_SERVICE_URL);
const menuApi = createApiClient(MENU_SERVICE_URL);
const userApi = createApiClient(USER_SERVICE_URL);

// Add auth token to all API clients
const addAuthInterceptor = (client: any) => {
  client.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );
};

addAuthInterceptor(authApi);
addAuthInterceptor(restaurantApi);
addAuthInterceptor(menuApi);
addAuthInterceptor(userApi);

// Default API for backward compatibility
const api = restaurantApi;

// Response interceptor with toast notifications
restaurantApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Success toast for mutations (POST, PUT, PATCH, DELETE)
    const method = response.config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const successMessage = getSuccessMessage(response.config.url || '', method);
      if (successMessage) {
        toast.success(successMessage);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Suppress toast for 404 on admin endpoints (not implemented yet)
    const url = error.config?.url || '';
    const is404 = error.response?.status === 404;
    const isAdminEndpoint = url.includes('/admin/');
    
    if (is404 && isAdminEndpoint) {
      // Just log to console, don't show toast
      console.warn(`Admin endpoint not implemented: ${url}`);
      return Promise.reject(error);
    }

    // Handle other errors with toast
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

// Helper function to get success messages
function getSuccessMessage(url: string, method: string): string {
  // Auth
  if (url.includes('/auth/register')) return 'Account created successfully!';
  if (url.includes('/auth/login')) return 'Welcome back!';
  if (url.includes('/auth/logout')) return 'Logged out successfully';

  // Orders
  if (url.includes('/orders') && method === 'POST') return 'Order placed successfully!';
  if (url.includes('/orders') && url.includes('/accept')) return 'Order accepted!';
  if (url.includes('/orders') && url.includes('/complete')) return 'Order completed!';
  if (url.includes('/orders') && url.includes('/status')) return 'Order status updated';

  // Menu
  if (url.includes('/menu') && method === 'POST') return 'Menu item added successfully!';
  if (url.includes('/menu') && method === 'PUT') return 'Menu item updated successfully!';
  if (url.includes('/menu') && method === 'DELETE') return 'Menu item deleted successfully!';

  // Restaurant
  if (url.includes('/restaurants') && method === 'POST') return 'Restaurant created successfully!';
  if (url.includes('/restaurants') && method === 'PUT') return 'Restaurant updated successfully!';
  if (url.includes('/restaurants') && method === 'DELETE') return 'Restaurant deleted successfully!';

  // Profile
  if (url.includes('/profile') && method === 'POST') return 'Profile created successfully!';
  if (url.includes('/profile') && method === 'PUT') return 'Profile updated successfully!';

  // Driver
  if (url.includes('/drivers/status')) return 'Status updated successfully!';
  if (url.includes('/drivers/location')) return 'Location updated';

  // Admin
  if (url.includes('/admin/users') && url.includes('/status')) return 'User status updated';
  if (url.includes('/admin/restaurants') && url.includes('/approve')) return 'Restaurant approved!';
  if (url.includes('/admin/restaurants') && url.includes('/reject')) return 'Restaurant rejected';
  if (url.includes('/admin/support-tickets')) return 'Ticket updated successfully!';

  // Reviews
  if (url.includes('/reviews') && method === 'POST') return 'Review submitted successfully!';
  if (url.includes('/reviews') && url.includes('/respond')) return 'Response added successfully!';

  return '';
}

// Helper function to get error messages
function getErrorMessage(error: AxiosError): string {
  const response = error.response as any;
  
  // Check for custom error message from backend
  if (response?.data?.error?.message) {
    return response.data.error.message;
  }
  
  if (response?.data?.message) {
    return response.data.message;
  }

  // HTTP status code messages
  switch (response?.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Unauthorized. Please login again.';
    case 403:
      return 'Access denied. You don\'t have permission.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. Resource already exists.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred';
  }
}

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; role: string; name?: string }) =>
    authApi.post('/register', data),
  
  login: (data: { email: string; password: string }) =>
    authApi.post('/login', data),
  
  logout: () => authApi.post('/logout'),
  
  refreshToken: (refreshToken: string) =>
    authApi.post('/refresh', { refreshToken }),
};

// User APIs
export const userAPI = {
  getProfile: () => userApi.get('/profile'),
  createProfile: (data: any) => userApi.post('/profile', data),
  updateProfile: (data: any) => userApi.put('/profile', data),
  getById: (id: string) => userApi.get(`/${id}`),
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (params?: { cuisine?: string; search?: string; limit?: number; offset?: number }) => 
    restaurantApi.get('/', { params }),
  
  getById: (id: string) => restaurantApi.get(`/${id}`),
  
  create: (data: any) => restaurantApi.post('/', data),
  
  update: (id: string, data: any) => restaurantApi.put(`/${id}`, data),
  
  delete: (id: string) => restaurantApi.delete(`/${id}`),
  
  getMyRestaurant: () => restaurantApi.get('/my-restaurant'),
};

// Menu Item APIs
export const menuAPI = {
  getByRestaurant: (restaurantId: string) => 
    menuApi.get(`/restaurant/${restaurantId}`),
  
  create: (data: any) => 
    menuApi.post('/', data),
  
  update: (id: string, data: any) => 
    menuApi.put(`/${id}`, data),
  
  delete: (id: string) => 
    menuApi.delete(`/${id}`),
  
  toggleAvailability: (restaurantId: string, itemId: string) =>
    menuApi.patch(`/${itemId}/availability`),
};

// Order APIs
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  
  getById: (id: string) => api.get(`/orders/${id}`),
  
  getMyOrders: (params?: { status?: string; limit?: number }) => 
    api.get('/orders/my-orders', { params }),
  
  updateStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
  
  getRestaurantOrders: (restaurantId: string, params?: { status?: string }) => 
    api.get(`/orders/restaurant/${restaurantId}`, { params }),
  
  getDriverOrders: (params?: { status?: string }) => 
    api.get('/orders/driver', { params }),
  
  acceptOrder: (id: string) => api.patch(`/orders/${id}/accept`),
  
  completeOrder: (id: string) => api.patch(`/orders/${id}/complete`),
  
  cancelOrder: (id: string, reason: string) => 
    api.patch(`/orders/${id}/cancel`, { reason }),
};

// Review APIs
export const reviewAPI = {
  create: (data: { restaurantId: string; orderId: string; rating: number; comment: string }) => 
    api.post('/reviews', data),
  
  getByRestaurant: (restaurantId: string, params?: { limit?: number; offset?: number }) => 
    api.get(`/reviews/restaurant/${restaurantId}`, { params }),
  
  respond: (id: string, response: string) => 
    api.patch(`/reviews/${id}/respond`, { response }),
  
  getMyReviews: () => api.get('/reviews/my-reviews'),
};

// Driver APIs
export const driverAPI = {
  updateStatus: (status: 'online' | 'offline') => 
    api.patch('/drivers/status', { status }),
  
  getEarnings: (params?: { period?: string; startDate?: string; endDate?: string }) => 
    api.get('/drivers/earnings', { params }),
  
  getAvailableOrders: () => api.get('/drivers/available-orders'),
  
  updateLocation: (location: { lat: number; lng: number }) => 
    api.patch('/drivers/location', location),
  
  getStats: () => api.get('/drivers/stats'),
  
  getActiveDelivery: () => api.get('/drivers/active-delivery'),
};

// Admin APIs (Note: These endpoints may not be implemented in backend yet)
export const adminAPI = {
  getAllUsers: async (params?: { role?: string; search?: string; limit?: number; offset?: number }) => {
    try {
      return await api.get('/admin/users', { params });
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Admin users endpoint not implemented yet');
        return { data: { data: [] } };
      }
      throw error;
    }
  },
  
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => 
    api.patch(`/admin/users/${userId}/status`, { status }),
  
  getPendingRestaurants: async () => {
    try {
      return await api.get('/admin/restaurants/pending');
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Admin pending restaurants endpoint not implemented yet');
        return { data: { data: [] } };
      }
      throw error;
    }
  },
  
  approveRestaurant: (id: string) => api.patch(`/admin/restaurants/${id}/approve`),
  
  rejectRestaurant: (id: string, reason: string) => 
    api.patch(`/admin/restaurants/${id}/reject`, { reason }),
  
  getStats: async () => {
    try {
      return await api.get('/admin/stats');
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Admin stats endpoint not implemented yet');
        return { data: { data: { totalRevenue: 0, totalOrders: 0, activeUsers: 0, activeRestaurants: 0, activeDrivers: 0, todayOrders: 0 } } };
      }
      throw error;
    }
  },
  
  createCoupon: (data: any) => api.post('/admin/coupons', data),
  
  getCoupons: () => api.get('/admin/coupons'),
  
  getSupportTickets: async (params?: { status?: string }) => {
    try {
      return await api.get('/admin/support-tickets', { params });
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Admin support tickets endpoint not implemented yet');
        return { data: { data: [] } };
      }
      throw error;
    }
  },
  
  updateTicket: (id: string, data: any) => 
    api.patch(`/admin/support-tickets/${id}`, data),
  
  createTicket: (data: any) => api.post('/admin/support-tickets', data),
};

// Payment APIs
export const paymentAPI = {
  createPaymentIntent: (orderId: string, amount: number) =>
    api.post('/payments/intent', { orderId, amount }),
  
  confirmPayment: (paymentIntentId: string) =>
    api.post('/payments/confirm', { paymentIntentId }),
  
  getPaymentHistory: () => api.get('/payments/history'),
};

export { api };
export default api;
