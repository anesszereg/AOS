import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantAPI, menuAPI } from '../../services/api';
import { FaStar, FaClock, FaArrowLeft, FaShoppingCart, FaTruck, FaPlus } from 'react-icons/fa';

export const RestaurantDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cart, setCart] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      console.log('[Customer:RestaurantDetails] Starting operation...');
      setLoading(true);
      console.log('[RestaurantDetails] Fetching restaurant data for ID:', id);
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id!),
        menuAPI.getByRestaurant(id!)
      ]);
      console.log('[RestaurantDetails] Restaurant loaded:', restaurantRes.data);
      console.log('[RestaurantDetails] Menu items loaded:', menuRes.data.length);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
    } catch (error: any) {
      console.error('[Customer:RestaurantDetails] Error:', error);
      console.error('[Customer:RestaurantDetails] Details:', error.response?.data || error.message);: any) {
      console.error('[RestaurantDetails] Error fetching restaurant:', error);
      console.error('[RestaurantDetails] Error details:', error.response?.data || error.message);
      toast.error('Failed to load restaurant. Showing sample data.');
      // Fallback to mock data
      setRestaurant({
        _id: id,
        name: "Luigi's Pizzeria",
        cuisine: 'Italian',
        rating: 4.7,
        estimatedDeliveryTime: '35-45 min',
        deliveryFee: 2.99,
      });
      setMenuItems([
        { _id: '1', name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, tomato sauce', price: 18.99, category: 'Pizza' },
        { _id: '2', name: 'Pepperoni Pizza', description: 'Classic pepperoni with extra cheese', price: 20.99, category: 'Pizza' },
        { _id: '3', name: 'Spaghetti Carbonara', description: 'Creamy sauce, bacon, parmesan', price: 16.99, category: 'Pasta' },
        { _id: '4', name: 'Fettuccine Alfredo', description: 'Rich cream sauce, butter, parmesan', price: 15.99, category: 'Pasta' },
      ]);
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

  const addToCart = (item: any) => {
    console.log('[RestaurantDetails] Adding to cart:', item.name);
    setCart([...cart, item]);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="restaurant-details-page">
      {/* Header Image */}
      <div className="restaurant-header">
        <button className="back-btn-overlay" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="header-overlay">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.cuisine}</p>
          <div className="header-meta">
            <span><FaStar /> {restaurant?.rating}</span>
            <span><FaClock /> {restaurant?.estimatedDeliveryTime}</span>
            <span><FaTruck /> ${restaurant?.deliveryFee?.toFixed(2)}</span>
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
                        <span className="item-price">${item.price.toFixed(2)}</span>
                        <button className="add-btn" onClick={() => addToCart(item)}>
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
      {cart.length > 0 && (
        <div className="floating-cart" onClick={() => navigate('/cart')}>
          <FaShoppingCart />
          <span>{cart.length} items</span>
          <span>View Cart</span>
          <span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
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
