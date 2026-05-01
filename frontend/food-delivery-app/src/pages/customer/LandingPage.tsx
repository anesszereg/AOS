import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaUtensils, FaUsers, FaShoppingBag, FaStar, FaClock, FaShieldAlt } from 'react-icons/fa';
import '../../styles/CustomerHome.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious Food,<br />
            Delivered to Your Door
          </h1>
          <p className="hero-subtitle">
            Order from your favorite restaurants and get it delivered fast
          </p>
          
          {/* Search Bar */}
          <div className="hero-search">
            <div className="search-box">
              <span className="search-icon"><FaMapMarkerAlt /></span>
              <input
                type="text"
                placeholder="Enter your delivery address"
                className="search-input-large"
              />
              <button className="search-btn-primary" onClick={() => navigate('/set-location')}>
                Find Food
              </button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Restaurants</p>
            </div>
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3>30min</h3>
              <p>Avg Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title-center">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon"><FaMapMarkerAlt size={40} /></div>
            <h3>Set Your Location</h3>
            <p>Enter your delivery address to see restaurants near you</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><FaUtensils size={40} /></div>
            <h3>Choose Your Food</h3>
            <p>Browse menus and select your favorite dishes</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><FaShieldAlt size={40} /></div>
            <h3>Pay Securely</h3>
            <p>Multiple payment options available</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><FaClock size={40} /></div>
            <h3>Fast Delivery</h3>
            <p>Track your order in real-time</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="popular-categories">
        <h2 className="section-title-center">Popular Categories</h2>
        <div className="category-grid">
          {[
            { name: 'Burgers', icon: <FaUtensils size={32} /> },
            { name: 'Pizza', icon: <FaUtensils size={32} /> },
            { name: 'Sushi', icon: <FaUtensils size={32} /> },
            { name: 'Healthy', icon: <FaUtensils size={32} /> },
            { name: 'Coffee', icon: <FaUtensils size={32} /> },
            { name: 'Desserts', icon: <FaUtensils size={32} /> },
            { name: 'Asian', icon: <FaUtensils size={32} /> },
            { name: 'Mexican', icon: <FaUtensils size={32} /> }
          ].map((cat) => (
            <div key={cat.name} className="category-card" onClick={() => navigate('/browse')}>
              <span className="category-icon-large">{cat.icon}</span>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Order?</h2>
        <p>Join thousands of happy customers</p>
        <div className="cta-buttons">
          <button className="btn-primary-large" onClick={() => navigate('/register')}>
            Sign Up Now
          </button>
          <button className="btn-secondary-large" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>

      <style>{`
        .landing-page {
          min-height: 100vh;
        }

        .hero-section {
          position: relative;
          height: 600px;
          background: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-dark) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200') center/cover;
          opacity: 0.2;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
          padding: 0 var(--spacing-lg);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--spacing-md);
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-2xl);
          opacity: 0.95;
        }

        .hero-search {
          margin-bottom: var(--spacing-2xl);
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: var(--border-radius-xl);
          padding: 8px;
          box-shadow: var(--shadow-xl);
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input-large {
          flex: 1;
          border: none;
          padding: 16px;
          font-size: var(--font-size-lg);
          color: var(--text-primary);
        }

        .search-input-large:focus {
          outline: none;
        }

        .search-btn-primary {
          background: var(--primary-orange);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: var(--border-radius-lg);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          font-size: var(--font-size-lg);
          transition: all var(--transition-base);
        }

        .search-btn-primary:hover {
          background: var(--primary-orange-dark);
          transform: translateY(-2px);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: var(--spacing-2xl);
        }

        .stat-item h3 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-xs);
        }

        .stat-item p {
          font-size: var(--font-size-base);
          opacity: 0.9;
        }

        .how-it-works, .popular-categories {
          padding: var(--spacing-4xl) var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title-center {
          text-align: center;
          font-size: 2.5rem;
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--spacing-2xl);
          color: var(--text-primary);
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-xl);
        }

        .step-card {
          text-align: center;
          padding: var(--spacing-xl);
          background: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
        }

        .step-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .step-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
        }

        .step-card h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
        }

        .step-card p {
          color: var(--text-secondary);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--spacing-lg);
        }

        .category-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          text-align: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
        }

        .category-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
          background: var(--lighter-gray);
        }

        .category-icon-large {
          font-size: 3rem;
          display: block;
          margin-bottom: var(--spacing-sm);
        }

        .category-card p {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .cta-section {
          background: linear-gradient(135deg, var(--secondary-green) 0%, #00A843 100%);
          padding: var(--spacing-4xl) var(--spacing-lg);
          text-align: center;
          color: white;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
        }

        .cta-section p {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-2xl);
        }

        .cta-buttons {
          display: flex;
          gap: var(--spacing-lg);
          justify-content: center;
        }

        .btn-primary-large, .btn-secondary-large {
          padding: 16px 48px;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          border-radius: var(--border-radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          border: 2px solid white;
        }

        .btn-primary-large {
          background: white;
          color: var(--secondary-green);
        }

        .btn-secondary-large {
          background: transparent;
          color: white;
        }

        .btn-primary-large:hover, .btn-secondary-large:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: var(--font-size-base);
          }
          
          .search-box {
            flex-direction: column;
          }
          
          .search-btn-primary {
            width: 100%;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: var(--spacing-md);
          }
          
          .cta-buttons {
            flex-direction: column;
          }
          
          .btn-primary-large, .btn-secondary-large {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
