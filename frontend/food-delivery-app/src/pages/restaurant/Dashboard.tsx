import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { orderAPI, restaurantAPI } from '../../services/apiWithToast';
import { FaDollarSign, FaBox, FaMoneyBillWave, FaStar, FaClipboardList, FaUtensils, FaChartLine, FaComments } from 'react-icons/fa';

export const RestaurantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    avgOrderValue: 0,
    rating: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get restaurant ID
      const restaurantRes = await restaurantAPI.getMyRestaurant();
      const restaurant = restaurantRes.data.data || restaurantRes.data;
      const restaurantId = restaurant.id || restaurant._id;
      
      // Fetch orders
      const response = await orderAPI.getRestaurantOrders(restaurantId);
      const ordersData = response.data.data || response.data || [];
      setRecentOrders(ordersData.slice(0, 3));
      
      // Calculate stats from orders
      const todayOrders = ordersData.filter((o: any) => {
        const orderDate = new Date(o.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      });
      
      setStats({
        todayRevenue: todayOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0),
        todayOrders: todayOrders.length,
        avgOrderValue: todayOrders.length > 0 ? todayOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0) / todayOrders.length : 0,
        rating: restaurant.rating || 0,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard:', error);
      // If restaurant not found, redirect to profile to create one
      if (error.response?.status === 404) {
        navigate('/restaurant/profile');
        return;
      }
      setStats({ todayRevenue: 0, todayOrders: 0, avgOrderValue: 0, rating: 0 });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      preparing: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-yellow-100 text-yellow-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-gray-100 text-gray-600',
      completed: 'bg-gray-100 text-gray-600',
      cancelled: 'bg-red-100 text-red-700',
    };
    return map[s] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-lighter flex items-center justify-center">
        <div className="text-gray-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-lighter p-4 md:p-8">
      {/* Header */}
      <header className="bg-white rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy">Restaurant Dashboard</h1>
          <p className="text-gray-medium text-sm mt-1">Welcome back, {user?.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-5 py-2.5 rounded-lg bg-gray-lighter text-navy font-medium hover:bg-gray-light transition"
            onClick={() => navigate('/restaurant/profile')}
          >
            Profile
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { icon: <FaDollarSign size={28} />, value: `$${stats.todayRevenue.toFixed(2)}`, label: "Today's Revenue", iconBg: 'bg-green-100 text-green-600' },
          { icon: <FaBox size={28} />, value: stats.todayOrders, label: "Today's Orders", iconBg: 'bg-blue-100 text-blue-600' },
          { icon: <FaMoneyBillWave size={28} />, value: `$${stats.avgOrderValue.toFixed(2)}`, label: 'Avg Order Value', iconBg: 'bg-purple-100 text-purple-600' },
          { icon: <FaStar size={28} />, value: stats.rating.toFixed(1), label: 'Rating', iconBg: 'bg-yellow-100 text-yellow-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.iconBg}`}>{s.icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-navy">{s.value}</h3>
              <p className="text-sm text-gray-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-navy mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <FaClipboardList size={24} />, label: 'Manage Orders', path: '/restaurant/orders' },
            { icon: <FaUtensils size={24} />, label: 'Edit Menu', path: '/restaurant/menu' },
            { icon: <FaComments size={24} />, label: 'View Reviews', path: '/restaurant/reviews' },
            { icon: <FaChartLine size={24} />, label: 'Settings', path: '/restaurant/profile' },
          ].map((a, i) => (
            <button
              key={i}
              className="p-6 bg-gray-lighter hover:bg-white border-2 border-transparent hover:border-primary rounded-xl flex flex-col items-center gap-2 transition group"
              onClick={() => navigate(a.path)}
            >
              <span className="text-primary group-hover:scale-110 transition-transform">{a.icon}</span>
              <span className="font-semibold text-navy text-sm">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy">Recent Orders</h2>
          <button className="text-primary font-semibold hover:underline text-sm" onClick={() => navigate('/restaurant/orders')}>
            View All →
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-medium">
            <FaBox size={40} className="mx-auto mb-2 opacity-30" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-lighter rounded-lg">
                <div className="flex flex-col">
                  <strong className="text-navy">#{order.id?.slice(0, 8) || order.number}</strong>
                  <span className="text-xs text-gray-medium">{order.customer || order.user_id?.slice(0, 8)}</span>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-gray-medium">{order.items?.length || order.items || 0} items</span>
                  <span className="font-semibold text-navy">${(order.total_amount || order.total || 0).toFixed?.(2) || '0.00'}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-xs text-gray-medium">
                  {order.created_at ? new Date(order.created_at).toLocaleTimeString() : order.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
};
