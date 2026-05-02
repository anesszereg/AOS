export enum EventType {
  // Order Events
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_COMPLETED = 'order.completed',
  
  // Payment Events
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_PROCESSED = 'payment.processed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  
  // Delivery Events
  DELIVERY_ASSIGNED = 'delivery.assigned',
  DELIVERY_PICKED_UP = 'delivery.picked_up',
  DELIVERY_IN_TRANSIT = 'delivery.in_transit',
  DELIVERY_COMPLETED = 'delivery.completed',
  DELIVERY_FAILED = 'delivery.failed',
  
  // Notification Events
  NOTIFICATION_SEND = 'notification.send',
  NOTIFICATION_SENT = 'notification.sent',
  NOTIFICATION_FAILED = 'notification.failed',
  
  // User Events
  USER_REGISTERED = 'user.registered',
  USER_UPDATED = 'user.updated',
  
  // Restaurant Events
  RESTAURANT_REGISTERED = 'restaurant.registered',
  RESTAURANT_UPDATED = 'restaurant.updated',
}

export interface BaseEvent {
  eventId: string;
  eventType: EventType;
  timestamp: Date;
  version: string;
  correlationId?: string;
}

export interface OrderCreatedEvent extends BaseEvent {
  eventType: EventType.ORDER_CREATED;
  data: {
    orderId: string;
    userId: string;
    restaurantId: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    deliveryAddress: string;
  };
}

export interface PaymentProcessedEvent extends BaseEvent {
  eventType: EventType.PAYMENT_PROCESSED;
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    method: string;
    transactionId: string;
  };
}

export interface DeliveryAssignedEvent extends BaseEvent {
  eventType: EventType.DELIVERY_ASSIGNED;
  data: {
    deliveryId: string;
    orderId: string;
    driverId: string;
    pickupLocation: string;
    deliveryLocation: string;
    estimatedTime: number;
  };
}

export interface NotificationEvent extends BaseEvent {
  eventType: EventType.NOTIFICATION_SEND;
  data: {
    userId: string;
    type: 'email' | 'sms' | 'push';
    subject?: string;
    message: string;
    metadata?: Record<string, any>;
  };
}

export type DomainEvent = 
  | OrderCreatedEvent 
  | PaymentProcessedEvent 
  | DeliveryAssignedEvent 
  | NotificationEvent;
