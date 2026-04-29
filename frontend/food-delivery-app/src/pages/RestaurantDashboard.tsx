import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Dashboard.css';

function RestaurantDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <h1>🍔 Restaurant Dashboard</h1>
          <div className="nav-actions">
            <button onClick={() => navigate('/profile')} className="btn-secondary">
              Profile
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="welcome-section">
          <h2>Restaurant Owner Portal</h2>
          <p>Manage your restaurant and orders</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>📦 Today's Orders</h3>
            <p className="stat-number">0</p>
            <p className="stat-label">New orders</p>
          </div>

          <div className="stat-card">
            <h3>💰 Revenue</h3>
            <p className="stat-number">$0</p>
            <p className="stat-label">Today</p>
          </div>

          <div className="stat-card">
            <h3>🍽️ Menu Items</h3>
            <p className="stat-number">0</p>
            <p className="stat-label">Active items</p>
          </div>

          <div className="stat-card">
            <h3>⭐ Rating</h3>
            <p className="stat-number">0.0</p>
            <p className="stat-label">Average</p>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>🍽️ Menu Management</h3>
            <button className="btn-primary">+ Add Item</button>
          </div>
          <div className="empty-state">
            <p>No menu items yet. Add your first dish!</p>
          </div>
        </div>

        <div className="section">
          <h3>📋 Recent Orders</h3>
          <div className="empty-state">
            <p>No orders yet. Your orders will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
