import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Dashboard.css';

function CustomerHome() {
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
          <h2>Hi {user?.email}! 👋</h2>
          <p>What would you like to eat today?</p>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search for restaurants or dishes..."
            className="search-input"
          />
        </div>

        <div className="section">
          <h3>🍕 Popular Restaurants</h3>
          <div className="restaurant-grid">
            <div className="restaurant-card">
              <div className="restaurant-image">🍕</div>
              <h4>Pizza Palace</h4>
              <p>Italian • Pizza • Pasta</p>
              <div className="restaurant-meta">
                <span>⭐ 4.5</span>
                <span>🕐 30-40 min</span>
              </div>
              <button className="btn-primary">Order Now</button>
            </div>

            <div className="restaurant-card">
              <div className="restaurant-image">🍔</div>
              <h4>Burger House</h4>
              <p>American • Burgers • Fries</p>
              <div className="restaurant-meta">
                <span>⭐ 4.7</span>
                <span>🕐 20-30 min</span>
              </div>
              <button className="btn-primary">Order Now</button>
            </div>

            <div className="restaurant-card">
              <div className="restaurant-image">🍜</div>
              <h4>Noodle Bar</h4>
              <p>Asian • Noodles • Rice</p>
              <div className="restaurant-meta">
                <span>⭐ 4.3</span>
                <span>🕐 25-35 min</span>
              </div>
              <button className="btn-primary">Order Now</button>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>📦 Recent Orders</h3>
          <div className="empty-state">
            <p>No orders yet. Start ordering from your favorite restaurants!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerHome;
