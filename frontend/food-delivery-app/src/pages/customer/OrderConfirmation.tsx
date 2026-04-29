import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';

export const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderNumber = orderId || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"><FaCheckCircle size={64} /></div>
          </div>
        </div>

        <h1>Order Placed Successfully!</h1>
        <p className="confirmation-message">
          Your order has been confirmed and will be delivered soon
        </p>

        <div className="order-details-card">
          <div className="order-number">
            <span>Order Number</span>
            <strong>{orderNumber}</strong>
          </div>
          
          <div className="order-info-grid">
            <div className="info-item">
              <span className="info-label"><FaClock /> Estimated Delivery</span>
              <span className="info-value">35-45 min</span>
            </div>
            <div className="info-item">
              <span className="info-label"><FaDollarSign /> Total Amount</span>
              <span className="info-value">$62.36</span>
            </div>
          </div>

          <div className="delivery-address-confirm">
            <span className="info-label"><FaMapMarkerAlt /> Delivering to</span>
            <span className="info-value">123 Main St, Naperville, IL 60540</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="track-order-btn" onClick={() => navigate(`/order-tracking?orderId=${orderId}`)}>
            Track Order
          </button>
          <button className="back-home-btn" onClick={() => navigate('/browse')}>
            Back to Home
          </button>
        </div>
      </div>

      <style>{`
        .order-confirmation-page {
          min-height: 100vh;
          background: var(--bg-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
        }

        .confirmation-container {
          max-width: 500px;
          width: 100%;
          text-align: center;
        }

        .success-animation {
          margin-bottom: var(--spacing-2xl);
        }

        .checkmark-circle {
          width: 120px;
          height: 120px;
          background: var(--secondary-green);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .checkmark {
          color: white;
          font-size: 4rem;
          font-weight: bold;
        }

        .confirmation-container h1 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
        }

        .confirmation-message {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-2xl);
          font-size: var(--font-size-lg);
        }

        .order-details-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          box-shadow: var(--shadow-md);
          margin-bottom: var(--spacing-xl);
          text-align: left;
        }

        .order-number {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
          margin-bottom: var(--spacing-md);
        }

        .order-number span {
          color: var(--text-secondary);
        }

        .order-number strong {
          font-size: var(--font-size-lg);
          color: var(--primary-orange);
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .info-value {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .delivery-address-confirm {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-color);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .track-order-btn, .back-home-btn {
          width: 100%;
          padding: 16px;
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .track-order-btn {
          background: var(--primary-orange);
          color: white;
          border: none;
        }

        .track-order-btn:hover {
          background: var(--primary-orange-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .back-home-btn {
          background: white;
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .back-home-btn:hover {
          border-color: var(--primary-orange);
          color: var(--primary-orange);
        }
      `}</style>
    </div>
  );
};
