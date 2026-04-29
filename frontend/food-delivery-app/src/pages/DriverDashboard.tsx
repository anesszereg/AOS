import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Dashboard.css';

function DriverDashboard() {
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
          <h1>🚗 Driver Dashboard</h1>
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
          <h2>Driver Portal</h2>
          <p>Manage your deliveries</p>
          <button className="btn-primary">🟢 Go Online</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>📦 Today's Deliveries</h3>
            <p className="stat-number">0</p>
            <p className="stat-label">Completed</p>
          </div>

          <div className="stat-card">
            <h3>💰 Earnings</h3>
            <p className="stat-number">$0</p>
            <p className="stat-label">Today</p>
          </div>

          <div className="stat-card">
            <h3>⭐ Rating</h3>
            <p className="stat-number">0.0</p>
            <p className="stat-label">Average</p>
          </div>

          <div className="stat-card">
            <h3>🕐 Online Time</h3>
            <p className="stat-number">0h</p>
            <p className="stat-label">Today</p>
          </div>
        </div>

        <div className="section">
          <h3>🚚 Available Deliveries</h3>
          <div className="empty-state">
            <p>No deliveries available. Go online to start accepting orders!</p>
          </div>
        </div>

        <div className="section">
          <h3>📋 Delivery History</h3>
          <div className="empty-state">
            <p>No delivery history yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
