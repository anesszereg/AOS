import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { restaurantAPI } from '../services/apiWithToast';
import { FaUtensils, FaStar, FaClock, FaSearch, FaShoppingCart, FaMapMarkerAlt, FaAngleDown, FaBell, FaCog } from 'react-icons/fa';

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
    { name: 'Turkish', icon: <FaUtensils /> },
    { name: 'Fast Food', icon: <FaUtensils /> },
    { name: 'Asian', icon: <FaUtensils /> },
    { name: 'French', icon: <FaUtensils /> },
    { name: 'Algerian', icon: <FaUtensils /> },

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
    <div className="min-h-screen bg-gray-lighter">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 font-bold text-lg text-navy">
            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center"><FaUtensils /></div>
            <span>FoodExpress</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer text-sm text-gray-medium hover:text-navy" onClick={() => navigate('/set-location')}>
            <FaMapMarkerAlt className="text-primary" />
            <span className="max-w-[200px] truncate">{location}</span>
            <FaAngleDown />
          </div>

          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium"><FaSearch /></span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-lighter border border-gray-100 focus:outline-none focus:border-primary focus:bg-white transition"
              placeholder="Search for restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-full bg-gray-lighter hover:bg-gray-light flex items-center justify-center text-navy transition" onClick={() => navigate('/orders')} title="Notifications">
              <FaBell />
            </button>
            <button className="relative w-10 h-10 rounded-full bg-gray-lighter hover:bg-gray-light flex items-center justify-center text-navy transition" onClick={() => navigate('/cart')} title="Cart">
              <FaShoppingCart />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{cartCount}</span>}
            </button>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.email}&background=FF5722&color=fff`}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary"
              onClick={() => navigate('/profile')}
            />
            <button className="w-10 h-10 rounded-full bg-gray-lighter hover:bg-gray-light flex items-center justify-center text-navy transition" onClick={() => navigate('/profile')} title="Settings">
              <FaCog />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Promo Banner Slider */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-light text-white p-8 flex items-center justify-between min-h-[220px]">
          <div className="flex-1 z-10">
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs mb-3">Use code <strong>{banners[currentBanner].code}</strong> at checkout</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{banners[currentBanner].title}</h2>
            <p className="text-white/90 mb-4">{banners[currentBanner].subtitle}</p>
            <button className="px-6 py-2.5 rounded-lg bg-white text-primary font-semibold hover:bg-gray-lighter transition" onClick={() => navigate('/browse')}>Order Now</button>
          </div>
          <img
            src={banners[currentBanner].image}
            alt="Promo"
            className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full object-cover shadow-xl"
          />
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full cursor-pointer transition-all ${index === currentBanner ? 'w-8 bg-primary' : 'w-2 bg-gray-light'}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>

        {/* Categories */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-navy mb-4">Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition ${activeCategory === category.name ? 'bg-primary text-white shadow-md' : 'bg-white text-navy hover:bg-gray-lighter border border-gray-100'}`}
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
          <div className="text-center py-12">
            <p className="text-gray-medium">Loading restaurants...</p>
          </div>
        )}

        {/* Restaurants */}
        {!loading && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-navy">Restaurants Near You</h2>
              <span className="text-primary font-medium cursor-pointer hover:underline">See all</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-md">
                      <FaStar className="text-yellow-badge" />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-navy mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-gray-medium mb-3">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-medium">
                      <span className="flex items-center gap-1"><FaClock /> {restaurant.estimatedDeliveryTime}</span>
                      <span className="flex items-center gap-1">💵 ${restaurant.deliveryFee.toFixed(2)} delivery</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-medium">No restaurants found.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
