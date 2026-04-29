import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FaArrowLeft, FaBox, FaClock, FaReceipt, FaRedo, FaCalendar, FaUtensils } from 'react-icons/fa';

export const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data
      setOrders([
        { _id: '1', orderNumber: 'ORD-A7X9K2', restaurant: { name: "Luigi's Pizzeria" }, items: [1,2,3], totalAmount: 62.36, status: 'delivered', createdAt: '2026-04-25T12:30:00' },
        { _id: '2', orderNumber: 'ORD-B3M5L8', restaurant: { name: 'Burger House' }, items: [1,2], totalAmount: 28.50, status: 'delivered', createdAt: '2026-04-23T19:15:00' },
        { _id: '3', orderNumber: 'ORD-C9P2N4', restaurant: { name: 'Sushi Palace' }, items: [1,2,3,4], totalAmount: 85.99, status: 'cancelled', createdAt: '2026-04-20T13:45:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'var(--secondary-green)';
      case 'cancelled': return 'var(--error-red)';
      case 'pending': return 'var(--primary-orange)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="order-history-page">
      <div className="history-container">
        <div className="history-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h1>Order History</h1>
        </div>

        {/* Filters */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-tab ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
          <button 
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading orders...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && (
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FaBox size={64} /></div>
              <h3>No orders found</h3>
              <p>You haven't placed any orders yet</p>
              <button className="browse-btn" onClick={() => navigate('/browse')}>
                Start Ordering
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3>{order.restaurant?.name || 'Restaurant'}</h3>
                    <p className="order-number">#{order.orderNumber}</p>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                
                <div className="order-card-body">
                  <div className="order-meta">
                    <span><FaCalendar /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span><FaClock /> {new Date(order.createdAt).toLocaleTimeString()}</span>
                    <span><FaUtensils /> {order.items?.length || 0} items</span>
                  </div>
                  
                  <div className="order-total">
                    <span>Total</span>
                    <strong>${order.totalAmount?.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="order-card-actions">
                  <button className="view-details-btn" onClick={() => navigate(`/order-tracking`)}>
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="reorder-btn">
                      <FaRedo /> Reorder
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        )}
      </div>

      <style>{`
        .order-history-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .history-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .history-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .history-header h1 {
          font-size: 2rem;
        }

        .filter-tabs {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
          background: white;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-lg);
        }

        .filter-tab {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--transition-base);
          color: var(--text-secondary);
        }

        .filter-tab.active {
          background: var(--primary-orange);
          color: white;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
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
          margin-bottom: var(--spacing-xl);
        }

        .browse-btn {
          padding: 14px 32px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .order-card {
          background: white;
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-sm);
        }

        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .order-card-header h3 {
          font-size: var(--font-size-lg);
          margin-bottom: 4px;
        }

        .order-number {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: capitalize;
        }

        .order-card-body {
          margin-bottom: var(--spacing-md);
        }

        .order-meta {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-md);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .order-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-color);
        }

        .order-total strong {
          font-size: var(--font-size-xl);
          color: var(--primary-orange);
        }

        .order-card-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .view-details-btn, .reorder-btn {
          flex: 1;
          padding: 12px;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .view-details-btn {
          background: transparent;
          border: 2px solid var(--primary-orange);
          color: var(--primary-orange);
        }

        .view-details-btn:hover {
          background: var(--primary-orange);
          color: white;
        }

        .reorder-btn {
          background: var(--primary-orange);
          color: white;
          border: none;
        }

        .reorder-btn:hover {
          background: var(--primary-orange-dark);
        }
      `}</style>
    </div>
  );
};
