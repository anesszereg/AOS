import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { restaurantAPI } from '../services/api';
import { FaUtensils, FaStar, FaClock, FaSearch, FaShoppingCart, FaMapMarkerAlt, FaAngleDown, FaBell, FaCog } from 'react-icons/fa';
import '../styles/CustomerHome.css';

export const NewCustomerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'All', icon: <FaUtensils /> },
    { name: 'Italian', icon: <FaUtensils /> },
    { name: 'Japanese', icon: <FaUtensils /> },
    { name: 'American', icon: <FaUtensils /> },
    { name: 'Mexican', icon: <FaUtensils /> },
    { name: 'Chinese', icon: <FaUtensils /> },
  ];

  useEffect(() => {
    fetchRestaurants();
  }, [activeCategory]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = activeCategory !== 'All' ? { cuisine: activeCategory } : {};
      const response = await restaurantAPI.getAll(params);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Fallback to mock data if API fails
      setRestaurants(mockRestaurants);
    } finally {
      setLoading(false);
    }
  };

  const mockRestaurants = [
    {
      _id: '1',
      name: "Luigi's Pizzeria",
      cuisine: 'Italian',
      rating: 4.7,
      estimatedDeliveryTime: '30-45 min',
      deliveryFee: 3.99,
      isActive: true
    },
    {
      _id: '2',
      name: 'Sushi Palace',
      cuisine: 'Japanese',
      rating: 4.8,
      estimatedDeliveryTime: '40-50 min',
      deliveryFee: 4.99,
      isActive: true
    },
    {
      _id: '3',
      name: 'Burger House',
      cuisine: 'American',
      rating: 4.5,
      estimatedDeliveryTime: '25-35 min',
      deliveryFee: 2.99,
      isActive: true
    }
  ];


  return (
    <div className="customer-home">
      {/* Header */}
      <header className="home-header">
        <div className="header-container">
          <div className="header-logo">
            <div className="logo-icon"><FaUtensils /></div>
            <span>FoodExpress</span>
          </div>

          <div className="header-location">
            <span><FaMapMarkerAlt /></span>
            <span className="location-text">Naperville, Illinois</span>
            <span><FaAngleDown /></span>
          </div>

          <div className="header-search">
            <span className="search-icon"><FaSearch /></span>
            <input
              type="text"
              className="search-input"
              placeholder="Search for restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="header-icon-btn">
              <FaBell />
              <span className="icon-badge">3</span>
            </button>
            <button className="header-icon-btn" onClick={() => navigate('/cart')}>
              <FaShoppingCart />
              <span className="icon-badge">2</span>
            </button>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.email}&background=FF5722&color=fff`}
              alt="Profile"
              className="header-profile"
              onClick={() => navigate('/profile')}
            />
            <button className="header-icon-btn" onClick={logout}>
              <FaCog />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-content">
        {/* Promo Banner */}
        <div className="promo-banner">
          <div className="promo-content">
            <div className="promo-code">Use code <strong>FIRST50</strong> at checkout</div>
            <h2 className="promo-title">Get 50% Off Your First Order!</h2>
            <p className="promo-subtitle">Hurry, offer ends soon!</p>
            <button className="promo-btn">Order Now</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
            alt="Promo"
            className="promo-image"
          />
        </div>
        <div className="banner-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {/* Categories */}
        <section className="categories-section">
          <h2 className="section-title">Categories</h2>
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`category-chip ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading restaurants...</p>
          </div>
        )}

        {/* Restaurants */}
        {!loading && (
          <section className="food-section">
            <div className="section-header">
              <h2 className="section-title">Restaurants Near You</h2>
              <span className="see-all-link">See all</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {restaurants.map((restaurant) => (
                <div 
                  key={restaurant._id} 
                  className="restaurant-card"
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="restaurant-info">
                    <div className="restaurant-header">
                      <div>
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                      </div>
                      <div className="restaurant-rating">
                        <FaStar color="#FFD700" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="restaurant-meta">
                      <div className="meta-item">
                        <FaClock />
                        <span>{restaurant.estimatedDeliveryTime}</span>
                      </div>
                      <div className="meta-item">
                        <FaMapMarkerAlt />
                        <span>${restaurant.deliveryFee.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="restaurant-actions">
                      <button className="view-menu-btn">View Menu</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
