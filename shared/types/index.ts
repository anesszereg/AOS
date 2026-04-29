export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT = 'restaurant',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  PICKED_UP = 'picked_up',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  cuisine?: string;
  phone: string;
  email?: string;
  address: Address;
  rating: number;
  reviewCount: number;
  minimumOrder: number;
  deliveryFee: number;
  estimatedDeliveryTime?: string;
  isOpen: boolean;
  isActive: boolean;
  imageUrl?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  spiceLevel?: number;
  calories?: number;
  allergens?: string[];
}

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customizations?: Record<string, any>;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  specialInstructions?: string;
  estimatedDeliveryTime?: Date;
  createdAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  transactionId?: string;
  gateway?: string;
  processedAt?: Date;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId?: string;
  status: DeliveryStatus;
  pickupAddress: Address;
  deliveryAddress: Address;
  distanceKm?: number;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
