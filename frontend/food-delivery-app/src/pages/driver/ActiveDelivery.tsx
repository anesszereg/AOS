import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaHome, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export const ActiveDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'going_to_restaurant' | 'at_restaurant' | 'picked_up' | 'delivering'>('going_to_restaurant');

  const delivery = {
    orderId: 'ORD-A7X9K2',
    restaurant: "Luigi's Pizzeria",
    restaurantAddress: '123 Main St, Naperville, IL 60540',
    restaurantPhone: '+1 (555) 123-4567',
    customer: 'John Doe',
    customerAddress: '456 Oak Ave, Naperville, IL 60563',
    customerPhone: '+1 (555) 987-6543',
    items: ['2x Margherita Pizza', '1x Spaghetti Carbonara'],
    payout: 12.50,
  };

  const handleStatusUpdate = () => {
    const statusFlow = {
      'going_to_restaurant': 'at_restaurant',
      'at_restaurant': 'picked_up',
      'picked_up': 'delivering',
      'delivering': 'completed'
    };
    
    const nextStatus = statusFlow[status];
    if (nextStatus === 'completed') {
      navigate('/driver/dashboard');
    } else {
      setStatus(nextStatus as any);
    }
  };

  const getStatusText = () => {
    switch(status) {
      case 'going_to_restaurant': return 'Going to Restaurant';
      case 'at_restaurant': return 'At Restaurant';
      case 'picked_up': return 'Order Picked Up';
      case 'delivering': return 'Delivering to Customer';
    }
  };

  const getActionText = () => {
    switch(status) {
      case 'going_to_restaurant': return 'Arrived at Restaurant';
      case 'at_restaurant': return 'Picked Up Order';
      case 'picked_up': return 'Started Delivery';
      case 'delivering': return 'Delivered';
    }
  };

  return (
    <div className="active-delivery-page">
      <div className="delivery-container">
        <div className="delivery-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <div>
            <h1>Active Delivery</h1>
            <p>#{delivery.orderId}</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="map-section">
          <div className="map-placeholder-delivery">
            <span>🗺️</span>
            <p>Navigation Map</p>
            <small>Route to {status === 'picked_up' || status === 'delivering' ? 'customer' : 'restaurant'}</small>
          </div>
        </div>

        {/* Status */}
        <div className="status-card">
          <h3>{getStatusText()}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${(Object.keys({going_to_restaurant:1, at_restaurant:2, picked_up:3, delivering:4}).indexOf(status) + 1) * 25}%`}}></div>
          </div>
        </div>

        {/* Restaurant Info */}
        {(status === 'going_to_restaurant' || status === 'at_restaurant') && (
          <div className="info-card">
            <h3><FaStore className="inline mr-2" /> Restaurant</h3>
            <p className="name">{delivery.restaurant}</p>
            <p className="address">{delivery.restaurantAddress}</p>
            <a href={`tel:${delivery.restaurantPhone}`} className="contact-btn">
              <FaPhone className="inline mr-2" /> Call Restaurant
            </a>
          </div>
        )}

        {/* Customer Info */}
        {(status === 'picked_up' || status === 'delivering') && (
          <div className="info-card">
            <h3><FaHome className="inline mr-2" /> Customer</h3>
            <p className="name">{delivery.customer}</p>
            <p className="address">{delivery.customerAddress}</p>
            <a href={`tel:${delivery.customerPhone}`} className="contact-btn">
              <FaPhone className="inline mr-2" /> Call Customer
            </a>
          </div>
        )}

        {/* Order Items */}
        <div className="items-card">
          <h3>Order Items</h3>
          {delivery.items.map((item, idx) => (
            <div key={idx} className="item-line-delivery">{item}</div>
          ))}
          <div className="payout-info">
            <span>Your Payout:</span>
            <strong>${delivery.payout.toFixed(2)}</strong>
          </div>
        </div>

        {/* Action Button */}
        <button className="status-action-btn" onClick={handleStatusUpdate}>
          {getActionText()}
        </button>
      </div>

      <style>{`
        .active-delivery-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding-bottom: 100px;
        }

        .delivery-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .delivery-header {
          background: white;
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-sm);
        }

        .delivery-header h1 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .delivery-header p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .map-section {
          height: 300px;
          margin: var(--spacing-lg);
        }

        .map-placeholder-delivery {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: var(--border-radius-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .map-placeholder-delivery span {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
        }

        .map-placeholder-delivery p {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          margin-bottom: 4px;
        }

        .map-placeholder-delivery small {
          opacity: 0.8;
        }

        .status-card {
          background: var(--primary-orange);
          color: white;
          padding: var(--spacing-xl);
          margin: 0 var(--spacing-lg) var(--spacing-lg);
          border-radius: var(--border-radius-lg);
        }

        .status-card h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-md);
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: white;
          transition: width 0.3s ease;
        }

        .info-card, .items-card {
          background: white;
          padding: var(--spacing-xl);
          margin: 0 var(--spacing-lg) var(--spacing-lg);
          border-radius: var(--border-radius-lg);
        }

        .info-card h3, .items-card h3 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-md);
        }

        .info-card .name {
          font-weight: var(--font-weight-semibold);
          margin-bottom: 4px;
        }

        .info-card .address {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
        }

        .contact-btn {
          display: block;
          padding: 12px;
          background: var(--primary-orange);
          color: white;
          text-align: center;
          border-radius: var(--border-radius-md);
          text-decoration: none;
          font-weight: var(--font-weight-semibold);
        }

        .item-line-delivery {
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--border-color);
        }

        .item-line-delivery:last-of-type {
          border-bottom: none;
        }

        .payout-info {
          display: flex;
          justify-content: space-between;
          padding-top: var(--spacing-md);
          margin-top: var(--spacing-md);
          border-top: 2px solid var(--border-color);
        }

        .payout-info strong {
          font-size: var(--font-size-xl);
          color: var(--secondary-green);
        }

        .status-action-btn {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 560px;
          padding: 18px;
          background: var(--secondary-green);
          color: white;
          border: none;
          border-radius: var(--border-radius-xl);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          box-shadow: var(--shadow-xl);
        }
      `}</style>
    </div>
  );
};
