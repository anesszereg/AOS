import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FaArrowLeft, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

export const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('incoming');
  const [orders, setOrders] = useState<any>({ incoming: [], preparing: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('[Restaurant:OrderManagement] Starting operation...');
      setLoading(true);
      const response = console.log('API call:', 'await orderAPI.getRestaurantOrders('current-restau...');
      await orderAPI.getRestaurantOrders('current-restaurant-id');
      const allOrders = response.data;
      setOrders({
        incoming: allOrders.filter((o: any) => o.status === 'placed'),
        preparing: allOrders.filter((o: any) => o.status === 'preparing'),
        completed: allOrders.filter((o: any) => o.status === 'completed'),
      });
    } catch (error: any) {
      console.error('[Restaurant:OrderManagement] Error:', error);
      console.error('[Restaurant:OrderManagement] Details:', error.response?.data || error.message);) {
      console.error('Error:', error);
      setOrders({
        incoming: [{ _id: '1', orderNumber: 'ORD-A7X9K2', customer: { name: 'John Doe' }, items: [{name: 'Pizza'}], totalAmount: 62.36 }],
        preparing: [],
        completed: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const currentOrders = orders[activeTab as keyof typeof orders];

  return (
    <div className="order-management-page">
      <div className="management-container">
        <div className="management-header">
          <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h1>Order Management</h1>
        </div>

        {/* Tabs */}
        <div className="order-tabs">
          <button 
            className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            Incoming ({orders.incoming.length})
          </button>
          <button 
            className={`tab ${activeTab === 'preparing' ? 'active' : ''}`}
            onClick={() => setActiveTab('preparing')}
          >
            Preparing ({orders.preparing.length})
          </button>
          <button 
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({orders.completed.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {currentOrders.map((order) => (
            <div key={order.id} className="order-card-mgmt">
              <div className="order-header-mgmt">
                <div>
                  <h3>#{order.number}</h3>
                  <p>{order.customer}</p>
                </div>
                <span className="order-time-mgmt">{order.time}</span>
              </div>

              <div className="order-items-mgmt">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-line">{item}</div>
                ))}
              </div>

              <div className="order-footer-mgmt">
                <strong className="order-total-mgmt">${order.total.toFixed(2)}</strong>
                <div className="order-actions-mgmt">
                  {activeTab === 'incoming' && (
                    <>
                      <button className="reject-btn">Reject</button>
                      <button className="accept-btn">Accept</button>
                    </>
                  )}
                  {activeTab === 'preparing' && (
                    <button className="ready-btn">Mark Ready</button>
                  )}
                  {activeTab === 'completed' && (
                    <button className="view-btn">View Details</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .order-management-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .management-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .management-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .management-header h1 {
          font-size: 2rem;
        }

        .order-tabs {
          display: flex;
          gap: var(--spacing-sm);
          background: white;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--spacing-xl);
        }

        .tab {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .tab.active {
          background: var(--primary-orange);
          color: white;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .order-card-mgmt {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .order-header-mgmt {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .order-header-mgmt h3 {
          font-size: var(--font-size-xl);
          margin-bottom: 4px;
        }

        .order-header-mgmt p {
          color: var(--text-secondary);
        }

        .order-time-mgmt {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .order-items-mgmt {
          margin-bottom: var(--spacing-md);
        }

        .item-line {
          padding: var(--spacing-xs) 0;
          color: var(--text-primary);
        }

        .order-footer-mgmt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-color);
        }

        .order-total-mgmt {
          font-size: var(--font-size-2xl);
          color: var(--primary-orange);
        }

        .order-actions-mgmt {
          display: flex;
          gap: var(--spacing-sm);
        }

        .reject-btn, .accept-btn, .ready-btn, .view-btn {
          padding: 10px 24px;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .reject-btn {
          background: white;
          border: 2px solid var(--error-red);
          color: var(--error-red);
        }

        .accept-btn, .ready-btn {
          background: var(--secondary-green);
          border: none;
          color: white;
        }

        .view-btn {
          background: var(--primary-orange);
          border: none;
          color: white;
        }
      `}</style>
    </div>
  );
};
