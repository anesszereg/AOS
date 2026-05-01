import axios from 'axios';

const API_BASE_URL = 'https://food-delevery-app-g73l.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  createProfile: (data: any) => api.post('/users/profile', data),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (params?: { cuisine?: string; search?: string }) => 
    api.get('/restaurants', { params }),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  create: (data: any) => api.post('/restaurants', data),
  update: (id: string, data: any) => api.put(`/restaurants/${id}`, data),
  delete: (id: string) => api.delete(`/restaurants/${id}`),
};

// Menu Item APIs
export const menuAPI = {
  getByRestaurant: (restaurantId: string) => 
    api.get(`/restaurants/${restaurantId}/menu`),
  create: (restaurantId: string, data: any) => 
    api.post(`/restaurants/${restaurantId}/menu`, data),
  update: (restaurantId: string, itemId: string, data: any) => 
    api.put(`/restaurants/${restaurantId}/menu/${itemId}`, data),
  delete: (restaurantId: string, itemId: string) => 
    api.delete(`/restaurants/${restaurantId}/menu/${itemId}`),
};

// Order APIs
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getById: (id: string) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/my-orders'),
  updateStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
  getRestaurantOrders: (restaurantId: string) => 
    api.get(`/orders/restaurant/${restaurantId}`),
  getDriverOrders: () => api.get('/orders/driver'),
  acceptOrder: (id: string) => api.patch(`/orders/${id}/accept`),
  completeOrder: (id: string) => api.patch(`/orders/${id}/complete`),
};

// Review APIs
export const reviewAPI = {
  create: (data: any) => api.post('/reviews', data),
  getByRestaurant: (restaurantId: string) => 
    api.get(`/reviews/restaurant/${restaurantId}`),
  respond: (id: string, response: string) => 
    api.patch(`/reviews/${id}/respond`, { response }),
};

// Driver APIs
export const driverAPI = {
  updateStatus: (status: 'online' | 'offline') => 
    api.patch('/drivers/status', { status }),
  getEarnings: (period?: string) => 
    api.get('/drivers/earnings', { params: { period } }),
  getAvailableOrders: () => api.get('/drivers/available-orders'),
  updateLocation: (location: { lat: number; lng: number }) => 
    api.patch('/drivers/location', location),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: (params?: { role?: string; search?: string }) => 
    api.get('/admin/users', { params }),
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => 
    api.patch(`/admin/users/${userId}/status`, { status }),
  getPendingRestaurants: () => api.get('/admin/restaurants/pending'),
  approveRestaurant: (id: string) => api.patch(`/admin/restaurants/${id}/approve`),
  rejectRestaurant: (id: string) => api.patch(`/admin/restaurants/${id}/reject`),
  createCoupon: (data: any) => api.post('/admin/coupons', data),
  getSupportTickets: () => api.get('/admin/support-tickets'),
  updateTicket: (id: string, data: any) => api.patch(`/admin/support-tickets/${id}`, data),
};

export { api };
export default api;
