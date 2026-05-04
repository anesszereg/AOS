import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, menuAPI } from '../../services/apiWithToast';
import { useCartStore } from '../../store/cartStore';
import { FaArrowLeft, FaStar, FaClock, FaTruck, FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';

export const RestaurantDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addItem, items: cartItems, getItemCount } = useCartStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      console.log('[RestaurantDetails] Fetching data for restaurant:', id);
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id!),
        menuAPI.getByRestaurant(id!)
      ]);
      
      // API returns {success: true, data: {...}} or just {...}
      const restaurantData = restaurantRes.data.data || restaurantRes.data;
      const menuData = menuRes.data.data || menuRes.data;
      
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
      
      // Map menu items
      const mappedMenuItems = menuData.map((item: any) => ({
        _id: item.id || item._id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price) || 0,
        category: item.category || 'Other',
        image: item.image || null,
      }));
      
      setRestaurant(mappedRestaurant);
      setMenuItems(mappedMenuItems);
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

  return (
    <div className="restaurant-details-page">
      {/* Header Image */}
      <div className="restaurant-header">
        <button className="back-btn-overlay" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <img src={restaurant?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop'} alt={restaurant?.name || 'Restaurant'} />
        <div className="header-overlay">
          <h1>{restaurant?.name || 'Restaurant'}</h1>
          <p>{restaurant?.cuisine || 'Various cuisines'}</p>
          <div className="header-meta">
            <span><FaStar /> {restaurant?.rating || 'N/A'}</span>
            <span><FaClock /> {restaurant?.estimatedDeliveryTime || '30-45 min'}</span>
            <span><FaTruck /> ${(restaurant?.deliveryFee || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading menu...</p>
        </div>
      )}

      {/* Menu */}
      {!loading && (
        <div className="menu-container">
          {Object.keys(menuCategories).map((categoryName) => (
            <div key={categoryName} className="menu-category">
              <h2>{categoryName}</h2>
              <div className="menu-items">
                {menuCategories[categoryName].map((item: any) => (
                  <div key={item._id} className="menu-item">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="item-footer">
                        <span className="item-price">${(parseFloat(item.price) || 0).toFixed(2)}</span>
                        <button className="add-btn" onClick={() => handleAddToCart(item)}>
                          <FaPlus /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
          background: var(--bg-gray);
          padding-bottom: 100px;
        }

        .restaurant-header {
          position: relative;
          height: 300px;
        }

        .restaurant-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .back-btn-overlay {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 2;
          background: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }

        .header-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
          padding: var(--spacing-xl);
        }

        .header-overlay h1 {
          font-size: 2rem;
          margin-bottom: var(--spacing-xs);
        }

        .header-overlay p {
          margin-bottom: var(--spacing-sm);
          opacity: 0.9;
        }

        .header-meta {
          display: flex;
          gap: var(--spacing-lg);
          font-size: var(--font-size-sm);
        }

        .menu-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: var(--spacing-xl);
        }

        .menu-category {
          margin-bottom: var(--spacing-2xl);
        }

        .menu-category h2 {
          font-size: 1.5rem;
          margin-bottom: var(--spacing-lg);
          color: var(--text-primary);
        }

        .menu-items {
          display: grid;
          gap: var(--spacing-lg);
        }

        .menu-item {
          background: white;
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
          display: flex;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-sm);
        }

        .menu-item img {
          width: 120px;
          height: 120px;
          border-radius: var(--border-radius-md);
          object-fit: cover;
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-info h3 {
          font-size: var(--font-size-lg);
          margin-bottom: 4px;
        }

        .item-info p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: auto;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-md);
        }

        .item-price {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .add-btn {
          background: var(--primary-orange);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .floating-cart {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-orange);
          color: white;
          padding: 16px 32px;
          border-radius: var(--border-radius-xl);
          display: flex;
          gap: var(--spacing-xl);
          align-items: center;
          cursor: pointer;
          box-shadow: var(--shadow-xl);
          font-weight: var(--font-weight-semibold);
          z-index: 100;
        }
      `}</style>
    </div>
  );
};
