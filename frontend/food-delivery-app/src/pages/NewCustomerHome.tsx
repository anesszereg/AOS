import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { restaurantAPI } from '../services/apiWithToast';
import { FaUtensils, FaStar, FaClock, FaSearch, FaShoppingCart, FaMapMarkerAlt, FaAngleDown, FaBell, FaCog } from 'react-icons/fa';
import '../styles/CustomerHome.css';

export const NewCustomerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Naperville, Illinois');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  const cartCount = getItemCount();

  const banners = [
    {
      code: 'FIRST50',
      title: 'Get 50% Off Your First Order!',
      subtitle: 'Hurry, offer ends soon!',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'
    },
    {
      code: 'FREESHIP',
      title: 'Free Delivery on Orders Over $30',
      subtitle: 'Limited time offer',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'
    },
    {
      code: 'WEEKEND20',
      title: '20% Off Weekend Special',
      subtitle: 'Valid on Saturdays & Sundays',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop'
    }
  ];

  const categories = [
    { name: 'All', icon: <FaUtensils /> },
    { name: 'Italian', icon: <FaUtensils /> },
    { name: 'Japanese', icon: <FaUtensils /> },
    { name: 'American', icon: <FaUtensils /> },
    { name: 'Mexican', icon: <FaUtensils /> },
    { name: 'Chinese', icon: <FaUtensils /> },
  ];

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
    fetchRestaurants();
  }, [activeCategory]);

  useEffect(() => {
    // Check location when page gains focus (user returns from set-location)
    const handleFocus = () => {
      const savedLocation = localStorage.getItem('deliveryLocation');
      if (savedLocation) {
        setLocation(savedLocation);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    handleFocus();
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      console.log('[CustomerHome] Fetching restaurants...', { category: activeCategory });
      const params = activeCategory !== 'All' ? { cuisine: activeCategory } : {};
      const response = await restaurantAPI.getAll(params);
      
      // Backend returns {success: true, data: [...]}
      const restaurantsData = response.data.data || response.data;
      console.log('[CustomerHome] Restaurants loaded:', restaurantsData);
      
      // Map API response to frontend format
      const mappedRestaurants = restaurantsData.map((restaurant: any) => {
        // Combine address fields
        const addressParts = [
          restaurant.address_street,
          restaurant.address_city,
          restaurant.address_state,
          restaurant.address_zip
        ].filter(Boolean);
        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (restaurant.address || '');

        return {
          _id: restaurant.id || restaurant._id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          rating: parseFloat(restaurant.rating) || 0,
          estimatedDeliveryTime: restaurant.estimated_delivery_time || restaurant.estimatedDeliveryTime || '30-45 min',
          deliveryFee: parseFloat(restaurant.delivery_fee || restaurant.deliveryFee) || 0,
          isActive: restaurant.is_active !== undefined ? restaurant.is_active : restaurant.isActive,
          description: restaurant.description,
          address: fullAddress,
        };
      });
      
      setRestaurants(mappedRestaurants);
    } catch (error: any) {
      console.error('[CustomerHome] Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="customer-home">
      {/* Header */}
      <header className="home-header">
        <div className="header-container">
          <div className="header-logo">
            <div className="logo-icon"><FaUtensils /></div>
            <span>FoodExpress</span>
          </div>

          <div className="header-location" onClick={() => navigate('/set-location')} style={{ cursor: 'pointer' }}>
            <span><FaMapMarkerAlt /></span>
            <span className="location-text">{location}</span>
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
            <button className="header-icon-btn" onClick={() => navigate('/orders')} title="Notifications">
              <FaBell />
              {/* <span className="icon-badge">3</span> */}
            </button>
            <button className="header-icon-btn" onClick={() => navigate('/cart')} title="Cart">
              <FaShoppingCart />
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </button>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.email}&background=FF5722&color=fff`}
              alt="Profile"
              className="header-profile"
              onClick={() => navigate('/profile')}
            />
            <button className="header-icon-btn" onClick={() => navigate('/profile')} title="Settings">
              <FaCog />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-content">
        {/* Promo Banner Slider */}
        <div className="promo-banner">
          <div className="promo-content">
            <div className="promo-code">Use code <strong>{banners[currentBanner].code}</strong> at checkout</div>
            <h2 className="promo-title">{banners[currentBanner].title}</h2>
            <p className="promo-subtitle">{banners[currentBanner].subtitle}</p>
            <button className="promo-btn" onClick={() => navigate('/browse')}>Order Now</button>
          </div>
          <img
            src={banners[currentBanner].image}
            alt="Promo"
            className="promo-image"
          />
        </div>
        <div className="banner-dots">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
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
            <div className="restaurants-grid">
              {filteredRestaurants.map((restaurant) => (
                <div 
                  key={restaurant._id} 
                  className="restaurant-card"
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                >
                  <div className="restaurant-image-container">
                    <img 
                      src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop'} 
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                    <div className="restaurant-badge">
                      <FaStar className="star-icon" />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="restaurant-info">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                    <div className="restaurant-meta">
                      <span className="meta-item"><FaClock /> {restaurant.estimatedDeliveryTime}</span>
                      <span className="meta-item">💵 ${restaurant.deliveryFee.toFixed(2)} delivery</span>
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
