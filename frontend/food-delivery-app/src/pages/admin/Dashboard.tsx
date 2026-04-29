import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const stats = {
    totalRevenue: 125450.75,
    totalOrders: 3542,
    activeUsers: 1250,
    activeRestaurants: 145,
    activeDrivers: 89,
    todayOrders: 234,
  };

  const recentActivity = [
    { id: 1, type: 'order', message: 'New order placed by John Doe', time: '2 min ago' },
    { id: 2, type: 'restaurant', message: 'New restaurant application from Pizza Palace', time: '15 min ago' },
    { id: 3, type: 'user', message: '5 new users registered', time: '1 hour ago' },
    { id: 4, type: 'support', message: 'New support ticket #1234', time: '2 hours ago' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.email}</p>
        </div>
        <button className="logout-btn-admin" onClick={logout}>Logout</button>
      </header>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-icon-admin">💰</span>
          <div>
            <h3>${stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon-admin">📦</span>
          <div>
            <h3>{stats.totalOrders.toLocaleString()}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon-admin">👥</span>
          <div>
            <h3>{stats.activeUsers.toLocaleString()}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon-admin">🏪</span>
          <div>
            <h3>{stats.activeRestaurants}</h3>
            <p>Restaurants</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon-admin">🚗</span>
          <div>
            <h3>{stats.activeDrivers}</h3>
            <p>Active Drivers</p>
          </div>
        </div>
        <div className="admin-stat-card highlight-admin">
          <span className="stat-icon-admin">📊</span>
          <div>
            <h3>{stats.todayOrders}</h3>
            <p>Orders Today</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div className="admin-actions-grid">
          <button className="admin-action-card" onClick={() => navigate('/admin/users')}>
            <span>👥</span>
            <span>Manage Users</span>
          </button>
          <button className="admin-action-card" onClick={() => navigate('/admin/restaurants')}>
            <span>🏪</span>
            <span>Restaurant Approvals</span>
          </button>
          <button className="admin-action-card" onClick={() => navigate('/admin/content')}>
            <span>🎨</span>
            <span>Content Management</span>
          </button>
          <button className="admin-action-card" onClick={() => navigate('/admin/support')}>
            <span>💬</span>
            <span>Support Tickets</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'order' && '📦'}
                {activity.type === 'restaurant' && '🏪'}
                {activity.type === 'user' && '👤'}
                {activity.type === 'support' && '💬'}
              </div>
              <div className="activity-content">
                <p>{activity.message}</p>
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .admin-header {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-header h1 {
          font-size: 2rem;
          margin-bottom: 4px;
        }

        .logout-btn-admin {
          padding: 10px 24px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .admin-stat-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .admin-stat-card.highlight-admin {
          background: var(--primary-orange);
          color: white;
        }

        .stat-icon-admin {
          font-size: 3rem;
        }

        .admin-stat-card h3 {
          font-size: 2rem;
          margin-bottom: 4px;
        }

        .admin-stat-card p {
          font-size: var(--font-size-sm);
          opacity: 0.8;
        }

        .admin-quick-actions, .recent-activity-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
        }

        .admin-quick-actions h2, .recent-activity-section h2 {
          margin-bottom: var(--spacing-lg);
        }

        .admin-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .admin-action-card {
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

        .admin-action-card:hover {
          border-color: var(--primary-orange);
          background: white;
          box-shadow: var(--shadow-md);
        }

        .admin-action-card span:first-child {
          font-size: 2.5rem;
        }

        .admin-action-card span:last-child {
          font-weight: var(--font-weight-semibold);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .activity-item {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          margin-bottom: 4px;
        }

        .activity-content span {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
