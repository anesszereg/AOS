import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Dashboard.css';

function Dashboard() {
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
          <h1>🍔 Food Delivery</h1>
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
          <h2>Welcome, {user?.email}!</h2>
          <p>Role: <strong>{user?.role}</strong></p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>🏪 Restaurants</h3>
            <p className="stat-number">0</p>
            <p className="stat-label">Available</p>
          </div>

          <div className="stat-card">
            <h3>📦 Orders</h3>
            <p className="stat-number">0</p>
            <p className="stat-label">Total Orders</p>
          </div>

          <div className="stat-card">
            <h3>🚗 Deliveries</h3>
            <p className="stat-number">0</p>
            <p className="stat-label">In Progress</p>
          </div>

          <div className="stat-card">
            <h3>👥 Users</h3>
            <p className="stat-number">1</p>
            <p className="stat-label">Registered</p>
          </div>
        </div>

        <div className="info-section">
          <h3>🚀 Platform Status</h3>
          <div className="service-status">
            <div className="service-item">
              <span className="status-dot active"></span>
              <span>Auth Service</span>
              <span className="status-badge">Running</span>
            </div>
            <div className="service-item">
              <span className="status-dot active"></span>
              <span>User Service</span>
              <span className="status-badge">Running</span>
            </div>
            <div className="service-item">
              <span className="status-dot inactive"></span>
              <span>Restaurant Service</span>
              <span className="status-badge pending">Pending</span>
            </div>
            <div className="service-item">
              <span className="status-dot inactive"></span>
              <span>Order Service</span>
              <span className="status-badge pending">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
