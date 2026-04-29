import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaShoppingCart, FaArrowLeft, FaUtensils } from 'react-icons/fa';

interface HeaderProps {
  showAuth?: boolean;
  showCart?: boolean;
  showBack?: boolean;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  showAuth = true, 
  showCart = false, 
  showBack = false,
  title 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDashboard = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer': return '/browse';
      case 'restaurant': return '/restaurant/dashboard';
      case 'driver': return '/driver/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {showBack ? (
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        ) : (
          <div className="logo" onClick={() => navigate(getRoleDashboard())}>
            <FaUtensils /> FoodDelivery
          </div>
        )}

        {title && <h1 className="header-title">{title}</h1>}

        <div className="header-actions">
          {showCart && (
            <button className="cart-icon" onClick={() => navigate('/cart')}>
              <FaShoppingCart size={20} />
            </button>
          )}
          
          {isAuthenticated && user ? (
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : showAuth ? (
            <div className="auth-buttons">
              <button className="login-button" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="register-button" onClick={() => navigate('/register')}>
                Sign Up
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        .app-header {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          color: var(--primary-orange);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-button {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .back-button:hover {
          border-color: var(--primary-orange);
          color: var(--primary-orange);
        }

        .header-title {
          flex: 1;
          text-align: center;
          font-size: 1.5rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-icon {
          font-size: 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .cart-icon:hover {
          background: var(--lighter-gray);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-email {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .logout-button {
          padding: 0.5rem 1rem;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .logout-button:hover {
          background: var(--primary-orange-dark);
        }

        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .login-button, .register-button {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .login-button {
          background: transparent;
          border: 2px solid var(--primary-orange);
          color: var(--primary-orange);
        }

        .login-button:hover {
          background: var(--primary-orange);
          color: white;
        }

        .register-button {
          background: var(--primary-orange);
          color: white;
          border: 2px solid var(--primary-orange);
        }

        .register-button:hover {
          background: var(--primary-orange-dark);
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 1rem;
          }

          .user-email {
            display: none;
          }

          .header-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </header>
  );
};
