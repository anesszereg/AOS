import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AvailableOrders: React.FC = () => {
  const navigate = useNavigate();

  const availableOrders = [
    { id: 1, restaurant: "Luigi's Pizzeria", customer: 'John Doe', distance: 1.2, payout: 12.50, items: 3, pickup: '123 Main St', dropoff: '456 Oak Ave' },
    { id: 2, restaurant: 'Burger House', customer: 'Jane Smith', distance: 0.8, payout: 8.75, items: 2, pickup: '789 Elm St', dropoff: '321 Pine Rd' },
    { id: 3, restaurant: 'Sushi Palace', customer: 'Bob Johnson', distance: 2.5, payout: 15.00, items: 4, pickup: '555 Market St', dropoff: '888 Lake Dr' },
  ];

  return (
    <div className="available-orders-page">
      <div className="available-container">
        <div className="available-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>Available Orders</h1>
          <button className="refresh-btn">🔄</button>
        </div>

        <div className="orders-list">
          {availableOrders.map((order) => (
            <div key={order.id} className="order-card-available">
              <div className="order-header-available">
                <h3>{order.restaurant}</h3>
                <span className="payout">${order.payout.toFixed(2)}</span>
              </div>

              <div className="order-details-available">
                <div className="detail-row">
                  <span className="label">Customer:</span>
                  <span>{order.customer}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Items:</span>
                  <span>{order.items} items</span>
                </div>
                <div className="detail-row">
                  <span className="label">Distance:</span>
                  <span>{order.distance} mi</span>
                </div>
              </div>

              <div className="locations">
                <div className="location-item">
                  <span className="icon">📍</span>
                  <div>
                    <strong>Pickup</strong>
                    <p>{order.pickup}</p>
                  </div>
                </div>
                <div className="location-item">
                  <span className="icon">🏠</span>
                  <div>
                    <strong>Dropoff</strong>
                    <p>{order.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="order-actions-available">
                <button className="decline-btn-available">Decline</button>
                <button className="accept-btn-available" onClick={() => navigate('/driver/active-delivery')}>
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>

        {availableOrders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Orders Available</h3>
            <p>Check back soon for new delivery requests</p>
          </div>
        )}
      </div>

      <style>{`
        .available-orders-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .available-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .available-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .available-header h1 {
          flex: 1;
          font-size: 2rem;
        }

        .refresh-btn {
          width: 40px;
          height: 40px;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .order-card-available {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          box-shadow: var(--shadow-md);
        }

        .order-header-available {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .order-header-available h3 {
          font-size: var(--font-size-xl);
        }

        .payout {
          font-size: 1.5rem;
          font-weight: var(--font-weight-bold);
          color: var(--secondary-green);
        }

        .order-details-available {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
        }

        .detail-row .label {
          color: var(--text-secondary);
        }

        .locations {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .location-item {
          display: flex;
          gap: var(--spacing-md);
        }

        .location-item .icon {
          font-size: 1.5rem;
        }

        .location-item strong {
          display: block;
          margin-bottom: 4px;
        }

        .location-item p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .order-actions-available {
          display: flex;
          gap: var(--spacing-md);
        }

        .decline-btn-available, .accept-btn-available {
          flex: 1;
          padding: 14px;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .decline-btn-available {
          background: white;
          border: 2px solid var(--error-red);
          color: var(--error-red);
        }

        .accept-btn-available {
          background: var(--secondary-green);
          border: none;
          color: white;
        }

        .accept-btn-available:hover {
          background: #00A843;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .empty-state {
          background: white;
          padding: var(--spacing-4xl);
          border-radius: var(--border-radius-xl);
          text-align: center;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: var(--spacing-lg);
        }

        .empty-state h3 {
          margin-bottom: var(--spacing-sm);
        }

        .empty-state p {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
