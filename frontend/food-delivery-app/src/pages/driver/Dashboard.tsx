import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);

  const stats = {
    todayEarnings: 145.50,
    deliveriesCompleted: 12,
    avgRating: 4.9,
    onlineHours: 6.5,
  };

  return (
    <div className="driver-dashboard">
      <header className="driver-header">
        <div>
          <h1>Driver Dashboard</h1>
          <p>Welcome, {user?.email}</p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      {/* Online Toggle */}
      <div className="online-toggle-card">
        <div className="toggle-content">
          <h2>You are {isOnline ? 'Online' : 'Offline'}</h2>
          <p>{isOnline ? 'Ready to accept deliveries' : 'Go online to start earning'}</p>
        </div>
        <button 
          className={`toggle-btn ${isOnline ? 'online' : 'offline'}`}
          onClick={() => setIsOnline(!isOnline)}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="driver-stats-grid">
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <h3>${stats.todayEarnings.toFixed(2)}</h3>
          <p>Today's Earnings</p>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <h3>{stats.deliveriesCompleted}</h3>
          <p>Deliveries Today</p>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <h3>{stats.avgRating}</h3>
          <p>Average Rating</p>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🕐</span>
          <h3>{stats.onlineHours}h</h3>
          <p>Online Hours</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn" onClick={() => navigate('/driver/available-orders')}>
          <span>📋</span>
          <span>Available Orders</span>
        </button>
        <button className="action-btn" onClick={() => navigate('/driver/earnings')}>
          <span>💵</span>
          <span>Earnings</span>
        </button>
        <button className="action-btn" onClick={() => navigate('/driver/profile')}>
          <span>⚙️</span>
          <span>Profile</span>
        </button>
      </div>

      <style>{`
        .driver-dashboard {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .driver-header {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .driver-header h1 {
          font-size: 2rem;
          margin-bottom: 4px;
        }

        .logout-btn {
          padding: 10px 24px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .online-toggle-card {
          background: white;
          padding: var(--spacing-2xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-content h2 {
          font-size: 1.8rem;
          margin-bottom: var(--spacing-xs);
        }

        .toggle-content p {
          color: var(--text-secondary);
        }

        .toggle-btn {
          padding: 16px 48px;
          border: none;
          border-radius: var(--border-radius-xl);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .toggle-btn.offline {
          background: var(--secondary-green);
          color: white;
        }

        .toggle-btn.online {
          background: var(--error-red);
          color: white;
        }

        .driver-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          text-align: center;
        }

        .stat-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .stat-card h3 {
          font-size: 2rem;
          color: var(--primary-orange);
          margin-bottom: var(--spacing-xs);
        }

        .stat-card p {
          color: var(--text-secondary);
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .action-btn {
          background: white;
          padding: var(--spacing-xl);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .action-btn:hover {
          border-color: var(--primary-orange);
          box-shadow: var(--shadow-md);
        }

        .action-btn span:first-child {
          font-size: 2.5rem;
        }

        .action-btn span:last-child {
          font-weight: var(--font-weight-semibold);
        }
      `}</style>
    </div>
  );
};
