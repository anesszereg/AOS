import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { orderAPI } from '../../services/api';
import { FaDollarSign, FaBox, FaMoneyBillWave, FaStar, FaClipboardList, FaUtensils, FaChartLine, FaComments } from 'react-icons/fa';

export const RestaurantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    avgOrderValue: 0,
    rating: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getRestaurantOrders('current-restaurant-id');
      setRecentOrders(response.data.slice(0, 3));
      // Calculate stats from orders
      const orders = response.data;
      setStats({
        todayRevenue: orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0),
        todayOrders: orders.length,
        avgOrderValue: orders.length > 0 ? orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0) / orders.length : 0,
        rating: 4.7,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // Fallback mock data
      setStats({ todayRevenue: 1250.50, todayOrders: 45, avgOrderValue: 27.79, rating: 4.7 });
      setRecentOrders([
        { _id: '1', orderNumber: 'ORD-A7X9K2', customer: { name: 'John Doe' }, items: [1,2,3], totalAmount: 62.36, status: 'preparing', createdAt: new Date() },
        { _id: '2', orderNumber: 'ORD-B3M5L8', customer: { name: 'Jane Smith' }, items: [1,2], totalAmount: 28.50, status: 'ready', createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restaurant-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Restaurant Dashboard</h1>
          <p>Welcome back, {user?.email}</p>
        </div>
        <div className="header-actions">
          <button className="profile-btn" onClick={() => navigate('/restaurant/profile')}>
            Profile
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaDollarSign size={32} /></div>
          <div className="stat-info">
            <h3>${stats.todayRevenue.toFixed(2)}</h3>
            <p>Today's Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaBox size={32} /></div>
          <div className="stat-info">
            <h3>{stats.todayOrders}</h3>
            <p>Today's Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaMoneyBillWave size={32} /></div>
          <div className="stat-info">
            <h3>${stats.avgOrderValue.toFixed(2)}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaStar size={32} color="#FFD700" /></div>
          <div className="stat-info">
            <h3>{stats.rating}</h3>
            <p>Rating</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/restaurant/orders')}>
            <span className="action-icon"><FaClipboardList size={24} /></span>
            <span>Manage Orders</span>
          </button>
          <button className="action-card" onClick={() => navigate('/restaurant/menu')}>
            <span className="action-icon"><FaUtensils size={24} /></span>
            <span>Edit Menu</span>
          </button>
          <button className="action-card" onClick={() => navigate('/restaurant/reviews')}>
            <span className="action-icon"><FaComments size={24} /></span>
            <span>View Reviews</span>
          </button>
          <button className="action-card" onClick={() => navigate('/restaurant/profile')}>
            <span className="action-icon"><FaChartLine size={24} /></span>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="view-all-btn" onClick={() => navigate('/restaurant/orders')}>
            View All
          </button>
        </div>
        <div className="orders-table">
          {recentOrders.map((order) => (
            <div key={order.id} className="order-row">
              <div className="order-info">
                <strong>{order.number}</strong>
                <span>{order.customer}</span>
              </div>
              <div className="order-details">
                <span>{order.items} items</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <span className={`order-status ${order.status}`}>
                {order.status}
              </span>
              <span className="order-time">{order.time}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .restaurant-dashboard {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .dashboard-header {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: var(--shadow-sm);
        }

        .dashboard-header h1 {
          font-size: 2rem;
          margin-bottom: 4px;
        }

        .dashboard-header p {
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .profile-btn, .logout-btn {
          padding: 10px 20px;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .profile-btn {
          background: var(--lighter-gray);
          border: none;
          color: var(--text-primary);
        }

        .logout-btn {
          background: var(--primary-orange);
          border: none;
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-sm);
        }

        .stat-icon {
          font-size: 3rem;
        }

        .stat-info h3 {
          font-size: 2rem;
          margin-bottom: 4px;
          color: var(--primary-orange);
        }

        .stat-info p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .quick-actions {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
        }

        .quick-actions h2 {
          margin-bottom: var(--spacing-lg);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .action-card {
          padding: var(--spacing-xl);
          background: var(--lighter-gray);
          border: 2px solid transparent;
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .action-card:hover {
          border-color: var(--primary-orange);
          background: white;
          box-shadow: var(--shadow-md);
        }

        .action-icon {
          font-size: 2.5rem;
        }

        .action-card span:last-child {
          font-weight: var(--font-weight-semibold);
        }

        .recent-orders {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .view-all-btn {
          background: none;
          border: none;
          color: var(--primary-orange);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .orders-table {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .order-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
          align-items: center;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-info strong {
          color: var(--text-primary);
        }

        .order-info span {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .order-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: var(--font-size-sm);
        }

        .order-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-align: center;
          text-transform: capitalize;
        }

        .order-status.preparing {
          background: rgba(255, 193, 7, 0.2);
          color: #F57C00;
        }

        .order-status.ready {
          background: rgba(0, 200, 83, 0.2);
          color: var(--secondary-green);
        }

        .order-status.completed {
          background: rgba(158, 158, 158, 0.2);
          color: var(--text-secondary);
        }

        .order-time {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          text-align: right;
        }

        @media (max-width: 768px) {
          .order-row {
            grid-template-columns: 1fr;
          }
          
          .order-time {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};
