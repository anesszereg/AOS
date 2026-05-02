import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FaArrowLeft, FaMapMarkedAlt, FaUser, FaPhone, FaStar, FaClipboardList, FaUtensils, FaCheckCircle, FaTruck, FaGift } from 'react-icons/fa';

export const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStatus();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchOrderStatus, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      console.log('[Customer:OrderTracking] Starting operation...');
      if (orderId) {
        const response = console.log('API call:', 'await orderAPI.getById(orderId)...');
      await orderAPI.getById(orderId);
        setOrder(response.data);
      } else {
        // Fallback mock data
        setOrder({
          _id: '123',
          orderNumber: 'ORD-A7X9K2',
          status: 'out_for_delivery',
          estimatedDeliveryTime: '15-20 min',
          driver: {
            name: 'John Smith',
            phone: '+1 (555) 123-4567',
            rating: 4.9,
            vehicle: 'Honda Civic - ABC 123'
          }
        });
      }
    } catch (error: any) {
      console.error('[Customer:OrderTracking] Error:', error);
      console.error('[Customer:OrderTracking] Details:', error.response?.data || error.message);) {
      console.error('Error fetching order:', error);
      // Fallback
      setOrder({
        _id: orderId || '123',
        orderNumber: 'ORD-A7X9K2',
        status: 'out_for_delivery',
        estimatedDeliveryTime: '15-20 min',
        driver: {
          name: 'John Smith',
          phone: '+1 (555) 123-4567',
          rating: 4.9
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { id: 'placed', label: 'Order Placed', icon: <FaClipboardList />, completed: true },
    { id: 'preparing', label: 'Preparing', icon: <FaUtensils />, completed: order?.status !== 'placed' },
    { id: 'ready', label: 'Ready', icon: <FaCheckCircle />, completed: ['out_for_delivery', 'delivered'].includes(order?.status) },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: <FaTruck />, completed: order?.status === 'out_for_delivery' || order?.status === 'delivered' },
    { id: 'delivered', label: 'Delivered', icon: <FaGift />, completed: order?.status === 'delivered' },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading order...</p>
      </div>
    );
  }

  return (
    <div className="order-tracking-page">
      <div className="tracking-container">
        <div className="tracking-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div>
            <h1>Track Order</h1>
            <p className="order-num">#{order?.orderNumber}</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="map-container">
          <div className="map-placeholder">
            <FaMapMarkedAlt size={48} />
            <p>Map View</p>
            <small>Driver location will appear here</small>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="eta-card">
          <div className="eta-info">
            <span className="eta-label">Estimated Delivery</span>
            <span className="eta-time">{order?.estimatedDeliveryTime}</span>
          </div>
        </div>

        {/* Driver Info */}
        {order?.driver && (
          <div className="driver-card">
            <div className="driver-avatar"><FaUser size={32} /></div>
            <div className="driver-info">
              <h3>{order.driver.name}</h3>
              <p><FaStar color="#FFD700" /> {order.driver.rating} {order.driver.vehicle && `• ${order.driver.vehicle}`}</p>
            </div>
            <a href={`tel:${order.driver.phone}`} className="call-btn">
              <FaPhone />
            </a>
          </div>
        )}

        {/* Status Timeline */}
        <div className="status-timeline">
          <h3>Order Status</h3>
          {statusSteps.map((step, index) => (
            <div key={step.id} className={`timeline-step ${step.completed ? 'completed' : ''} ${order?.status === step.id ? 'active' : ''}`}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h4>{step.label}</h4>
                {order?.status === step.id && (
                  <p className="step-status">In Progress...</p>
                )}
              </div>
              {index < statusSteps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        {/* Order Items */}
        <div className="order-items-summary">
          <h3>Order Items</h3>
          <div className="item-row">
            <span>2x Margherita Pizza</span>
            <span>$37.98</span>
          </div>
          <div className="item-row">
            <span>1x Spaghetti Carbonara</span>
            <span>$16.99</span>
          </div>
          <div className="item-row total-row">
            <span>Total</span>
            <span>$62.36</span>
          </div>
        </div>
      </div>

      <style>{`
        .order-tracking-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding-bottom: var(--spacing-xl);
        }

        .tracking-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .tracking-header {
          background: white;
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-sm);
        }

        .tracking-header h1 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .order-num {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .map-container {
          height: 300px;
          background: white;
          margin: var(--spacing-lg);
          border-radius: var(--border-radius-xl);
          overflow: hidden;
        }

        .map-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .map-placeholder span {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
        }

        .map-placeholder p {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          margin-bottom: 4px;
        }

        .map-placeholder small {
          opacity: 0.8;
        }

        .eta-card {
          background: var(--secondary-green);
          color: white;
          padding: var(--spacing-lg);
          margin: 0 var(--spacing-lg) var(--spacing-lg);
          border-radius: var(--border-radius-lg);
          text-align: center;
        }

        .eta-label {
          display: block;
          font-size: var(--font-size-sm);
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .eta-time {
          font-size: 2rem;
          font-weight: var(--font-weight-bold);
        }

        .driver-card {
          background: white;
          padding: var(--spacing-lg);
          margin: 0 var(--spacing-lg) var(--spacing-lg);
          border-radius: var(--border-radius-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-sm);
        }

        .driver-avatar {
          width: 60px;
          height: 60px;
          background: var(--lighter-gray);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .driver-info {
          flex: 1;
        }

        .driver-info h3 {
          font-size: var(--font-size-lg);
          margin-bottom: 4px;
        }

        .driver-info p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .call-btn {
          width: 50px;
          height: 50px;
          background: var(--primary-orange);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          text-decoration: none;
          box-shadow: var(--shadow-md);
        }

        .status-timeline {
          background: white;
          padding: var(--spacing-xl);
          margin: 0 var(--spacing-lg) var(--spacing-lg);
          border-radius: var(--border-radius-lg);
        }

        .status-timeline h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-lg);
        }

        .timeline-step {
          position: relative;
          display: flex;
          gap: var(--spacing-md);
          padding-bottom: var(--spacing-lg);
        }

        .step-icon {
          width: 50px;
          height: 50px;
          background: var(--lighter-gray);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          z-index: 1;
        }

        .timeline-step.completed .step-icon {
          background: var(--secondary-green);
        }

        .timeline-step.active .step-icon {
          background: var(--primary-orange);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .step-content h4 {
          font-size: var(--font-size-base);
          margin-bottom: 4px;
        }

        .step-status {
          color: var(--primary-orange);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
        }

        .step-line {
          position: absolute;
          left: 25px;
          top: 50px;
          width: 2px;
          height: calc(100% - 50px);
          background: var(--border-color);
        }

        .timeline-step.completed .step-line {
          background: var(--secondary-green);
        }

        .order-items-summary {
          background: white;
          padding: var(--spacing-xl);
          margin: 0 var(--spacing-lg);
          border-radius: var(--border-radius-lg);
        }

        .order-items-summary h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-lg);
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          color: var(--text-secondary);
        }

        .item-row.total-row {
          border-top: 2px solid var(--border-color);
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-md);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
