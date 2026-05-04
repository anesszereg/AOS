import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, menuAPI } from '../../services/apiWithToast';
import { useCartStore } from '../../store/cartStore';
import { FaArrowLeft, FaStar, FaClock, FaTruck, FaShoppingCart, FaPlus, FaMapMarkerAlt, FaPhone, FaInfoCircle } from 'react-icons/fa';

export const RestaurantDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addItem, items: cartItems, getItemCount } = useCartStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      console.log('[RestaurantDetails] Fetching data for restaurant:', id);
      
      // Fetch restaurant data
      const restaurantRes = await restaurantAPI.getById(id!);
      const restaurantData = restaurantRes.data.data || restaurantRes.data;
      
      console.log('[RestaurantDetails] Restaurant loaded:', restaurantData.name);
      
      // Combine address fields
      const addressParts = [
        restaurantData.address_street,
        restaurantData.address_city,
        restaurantData.address_state,
        restaurantData.address_zip
      ].filter(Boolean);
      const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (restaurantData.address || '');
      
      // Map API response to frontend format
      const mappedRestaurant = {
        _id: restaurantData.id || restaurantData._id,
        name: restaurantData.name,
        cuisine: restaurantData.cuisine,
        rating: parseFloat(restaurantData.rating) || 0,
        estimatedDeliveryTime: restaurantData.estimated_delivery_time || restaurantData.estimatedDeliveryTime || '30-45 min',
        deliveryFee: parseFloat(restaurantData.delivery_fee || restaurantData.deliveryFee) || 0,
        description: restaurantData.description,
        address: fullAddress,
        phone: restaurantData.phone,
        image: restaurantData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
      };
      
      setRestaurant(mappedRestaurant);
      
      // Try to fetch menu items (optional - won't fail if menu service is down)
      try {
        const menuRes = await menuAPI.getByRestaurant(id!);
        const menuData = menuRes.data.data || menuRes.data || [];
        
        const mappedMenuItems = menuData.map((item: any) => ({
          _id: item.id || item._id,
          name: item.name,
          description: item.description,
          price: parseFloat(item.price) || 0,
          category: item.category || 'Other',
          image: item.image || null,
        }));
        
        setMenuItems(mappedMenuItems);
      } catch (menuError) {
        console.log('[RestaurantDetails] Menu service unavailable, showing restaurant without menu');
        setMenuItems([]);
      }
    } catch (error: any) {
      console.error('[RestaurantDetails] Error:', error);
      console.error('[RestaurantDetails] Details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Group menu items by category
  const menuCategories = menuItems.reduce((acc: any, item: any) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const handleAddToCart = (item: any) => {
    if (!restaurant) return;
    
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      image: item.image,
      description: item.description,
    });
  };

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="restaurant-details-page">
      {/* Hero Section */}
      <div className="restaurant-hero">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="hero-image-container">
          <img 
            src={restaurant?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop'} 
            alt={restaurant?.name || 'Restaurant'}
            className="hero-image"
          />
          <div className="hero-gradient"></div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="restaurant-info-card">
        <div className="info-header">
          <div>
            <h1 className="restaurant-title">{restaurant?.name || 'Loading...'}</h1>
            <p className="restaurant-cuisine">
              <FaInfoCircle /> {restaurant?.cuisine || 'Various cuisines'}
            </p>
          </div>
          <div className="rating-badge">
            <FaStar className="star" />
            <span className="rating-value">{restaurant?.rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>

        <p className="restaurant-description">{restaurant?.description || 'Welcome to our restaurant!'}</p>

        <div className="info-grid">
          <div className="info-item">
            <FaClock className="icon" />
            <div>
              <span className="label">Delivery Time</span>
              <span className="value">{restaurant?.estimatedDeliveryTime || '30-45 min'}</span>
            </div>
          </div>
          <div className="info-item">
            <FaTruck className="icon" />
            <div>
              <span className="label">Delivery Fee</span>
              <span className="value">${(restaurant?.deliveryFee || 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <span className="label">Address</span>
              <span className="value">{restaurant?.address || 'N/A'}</span>
            </div>
          </div>
          <div className="info-item">
            <FaPhone className="icon" />
            <div>
              <span className="label">Phone</span>
              <span className="value">{restaurant?.phone || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <h2 className="section-title">Menu</h2>
        
        {/* Category Filter */}
        {menuItems.length > 0 && (
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading delicious menu...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && menuItems.length === 0 && (
          <div className="empty-state">
            <FaInfoCircle className="empty-icon" />
            <h3>No Menu Available</h3>
            <p>This restaurant hasn't added their menu yet. Please check back later!</p>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="menu-grid">
            {filteredItems.map((item: any) => (
              <div key={item._id} className="menu-item-card">
                {item.image && (
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                )}
                <div className="item-content">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description || 'Delicious dish'}</p>
                  <div className="item-footer">
                    <span className="item-price">${parseFloat(item.price).toFixed(2)}</span>
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                      <FaPlus /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {cartItems.length > 0 && (
        <div className="floating-cart" onClick={() => navigate('/cart')}>
          <FaShoppingCart />
          <span>{getItemCount()} items</span>
          <span>View Cart</span>
          <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
        </div>
      )}

      <style>{`
        .restaurant-details-page {
          min-height: 100vh;
          background: #f5f5f5;
          padding-bottom: 100px;
        }

        /* Hero Section */
        .restaurant-hero {
          position: relative;
          height: 350px;
          overflow: hidden;
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .hero-image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 150px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }

        /* Restaurant Info Card */
        .restaurant-info-card {
          max-width: 1200px;
          margin: -80px auto 0;
          position: relative;
          z-index: 5;
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 16px;
        }

        .restaurant-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .restaurant-cuisine {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 1rem;
        }

        .rating-badge {
          background: linear-gradient(135deg, #FF5722, #FF7043);
          color: white;
          padding: 12px 20px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
        }

        .star {
          color: #FFD700;
        }

        .restaurant-description {
          color: #555;
          line-height: 1.6;
          margin: 16px 0 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          background: #e9ecef;
          transform: translateY(-2px);
        }

        .info-item .icon {
          font-size: 1.5rem;
          color: #FF5722;
        }

        .info-item .label {
          display: block;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 4px;
        }

        .info-item .value {
          display: block;
          font-weight: 600;
          color: #333;
        }

        /* Menu Section */
        .menu-section {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 24px;
        }

        /* Category Filter */
        .category-filter {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .category-filter::-webkit-scrollbar {
          height: 4px;
        }

        .category-filter::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 2px;
        }

        .category-btn {
          padding: 10px 24px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .category-btn:hover {
          border-color: #FF5722;
          color: #FF5722;
        }

        .category-btn.active {
          background: #FF5722;
          color: white;
          border-color: #FF5722;
        }

        /* Loading & Empty States */
        .loading-state, .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          margin: 20px 0;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #FF5722;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-icon {
          font-size: 4rem;
          color: #ddd;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #888;
        }

        /* Menu Grid */
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .menu-item-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .menu-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .item-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .menu-item-card:hover .item-image img {
          transform: scale(1.05);
        }

        .item-content {
          padding: 20px;
        }

        .item-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .item-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-price {
          font-size: 1.4rem;
          font-weight: 700;
          color: #FF5722;
        }

        .add-to-cart-btn {
          background: #FF5722;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn:hover {
          background: #E64A19;
          transform: scale(1.05);
        }

        /* Floating Cart */
        .floating-cart {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #FF5722, #FF7043);
          color: white;
          padding: 16px 32px;
          border-radius: 30px;
          display: flex;
          gap: 20px;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(255, 87, 34, 0.4);
          font-weight: 600;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .floating-cart:hover {
          transform: translateX(-50%) translateY(-4px);
          box-shadow: 0 12px 32px rgba(255, 87, 34, 0.5);
        }

        @media (max-width: 768px) {
          .restaurant-info-card {
            margin: -60px 16px 0;
            padding: 24px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .menu-grid {
            grid-template-columns: 1fr;
          }

          .restaurant-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
