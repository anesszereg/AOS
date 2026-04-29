export enum EventType {
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_CANCELLED = 'order.cancelled',
  
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_PROCESSED = 'payment.processed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  
  DELIVERY_ASSIGNED = 'delivery.assigned',
  DELIVERY_PICKED_UP = 'delivery.picked_up',
  DELIVERY_STATUS_UPDATED = 'delivery.status_updated',
  DELIVERY_COMPLETED = 'delivery.completed',
  
  NOTIFICATION_SEND = 'notification.send',
}

export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  correlationId: string;
  payload: any;
}

export interface OrderCreatedEvent extends BaseEvent {
  type: EventType.ORDER_CREATED;
  payload: {
    orderId: string;
    orderNumber: string;
    userId: string;
    restaurantId: string;
    items: Array<{
      menuItemId: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    paymentMethod: string;
  };
}

export interface OrderUpdatedEvent extends BaseEvent {
  type: EventType.ORDER_UPDATED;
  payload: {
    orderId: string;
    orderNumber: string;
    status: string;
    previousStatus: string;
    updatedBy: string;
    reason?: string;
  };
}

export interface OrderConfirmedEvent extends BaseEvent {
  type: EventType.ORDER_CONFIRMED;
  payload: {
    orderId: string;
    orderNumber: string;
    userId: string;
    restaurantId: string;
    estimatedDeliveryTime: Date;
  };
}

export interface OrderCancelledEvent extends BaseEvent {
  type: EventType.ORDER_CANCELLED;
  payload: {
    orderId: string;
    orderNumber: string;
    userId: string;
    reason: string;
    cancelledBy: string;
  };
}

export interface PaymentInitiatedEvent extends BaseEvent {
  type: EventType.PAYMENT_INITIATED;
  payload: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    method: string;
  };
}

export interface PaymentProcessedEvent extends BaseEvent {
  type: EventType.PAYMENT_PROCESSED;
  payload: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    transactionId: string;
    method: string;
    processedAt: Date;
  };
}

export interface PaymentFailedEvent extends BaseEvent {
  type: EventType.PAYMENT_FAILED;
  payload: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    reason: string;
    failedAt: Date;
  };
}

export interface PaymentRefundedEvent extends BaseEvent {
  type: EventType.PAYMENT_REFUNDED;
  payload: {
    paymentId: string;
    orderId: string;
    refundId: string;
    amount: number;
    reason: string;
    refundedAt: Date;
  };
}

export interface DeliveryAssignedEvent extends BaseEvent {
  type: EventType.DELIVERY_ASSIGNED;
  payload: {
    deliveryId: string;
    orderId: string;
    driverId: string;
    driverName: string;
    driverPhone: string;
    estimatedPickupTime: Date;
    estimatedDeliveryTime: Date;
  };
}

export interface DeliveryPickedUpEvent extends BaseEvent {
  type: EventType.DELIVERY_PICKED_UP;
  payload: {
    deliveryId: string;
    orderId: string;
    driverId: string;
    pickedUpAt: Date;
  };
}

export interface DeliveryStatusUpdatedEvent extends BaseEvent {
  type: EventType.DELIVERY_STATUS_UPDATED;
  payload: {
    deliveryId: string;
    orderId: string;
    status: string;
    previousStatus: string;
    location?: {
      lat: number;
      lng: number;
    };
    updatedAt: Date;
  };
}

export interface DeliveryCompletedEvent extends BaseEvent {
  type: EventType.DELIVERY_COMPLETED;
  payload: {
    deliveryId: string;
    orderId: string;
    driverId: string;
    deliveredAt: Date;
    proofUrl?: string;
  };
}

export interface NotificationSendEvent extends BaseEvent {
  type: EventType.NOTIFICATION_SEND;
  payload: {
    userId: string;
    type: 'email' | 'sms' | 'push' | 'in_app';
    template: string;
    data: Record<string, any>;
    priority?: 'high' | 'normal' | 'low';
  };
}

export type DomainEvent =
  | OrderCreatedEvent
  | OrderUpdatedEvent
  | OrderConfirmedEvent
  | OrderCancelledEvent
  | PaymentInitiatedEvent
  | PaymentProcessedEvent
  | PaymentFailedEvent
  | PaymentRefundedEvent
  | DeliveryAssignedEvent
  | DeliveryPickedUpEvent
  | DeliveryStatusUpdatedEvent
  | DeliveryCompletedEvent
  | NotificationSendEvent;
