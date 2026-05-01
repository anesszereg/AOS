import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Auth
import { NewLogin } from './pages/NewLogin';
import { NewRegister } from './pages/NewRegister';

// Customer
import { LandingPage } from './pages/customer/LandingPage';
import { SetLocation } from './pages/customer/SetLocation';
import { NewCustomerHome } from './pages/NewCustomerHome';
import { SearchResults } from './pages/customer/SearchResults';
import { RestaurantDetails } from './pages/customer/RestaurantDetails';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { OrderConfirmation } from './pages/customer/OrderConfirmation';
import { OrderTracking } from './pages/customer/OrderTracking';
import { OrderHistory } from './pages/customer/OrderHistory';

// Restaurant
import { RestaurantDashboard } from './pages/restaurant/Dashboard';
import { OrderManagement } from './pages/restaurant/OrderManagement';
import { MenuManagement } from './pages/restaurant/MenuManagement';
import { RestaurantProfile } from './pages/restaurant/RestaurantProfile';
import { Reviews } from './pages/restaurant/Reviews';

// Driver
import { DriverDashboard } from './pages/driver/Dashboard';
import { AvailableOrders } from './pages/driver/AvailableOrders';
import { ActiveDelivery } from './pages/driver/ActiveDelivery';
import { Earnings } from './pages/driver/Earnings';
import { DriverProfile } from './pages/driver/Profile';

// Admin
import { AdminDashboard } from './pages/admin/Dashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { RestaurantOnboarding } from './pages/admin/RestaurantOnboarding';
import { ContentManagement } from './pages/admin/ContentManagement';
import { SupportTickets } from './pages/admin/SupportTickets';

// Legacy
import Profile from './pages/Profile';

// Components
import { RoleProtectedRoute } from './components/RoleProtectedRoute';

function App() {
  const { initializeAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const getDashboardByRole = () => {
    if (!user) return <LandingPage />;
    
    switch (user.role) {
      case 'customer':
        return <NewCustomerHome />;
      case 'restaurant':
        return <RestaurantDashboard />;
      case 'driver':
        return <DriverDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<NewLogin />} />
        <Route path="/register" element={<NewRegister />} />
        
        {/* Customer Routes */}
        <Route path="/set-location" element={<SetLocation />} />
        <Route path="/browse" element={<NewCustomerHome />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/order-history" element={<OrderHistory />} />
        
        {/* Restaurant Routes */}
        <Route
          path="/restaurant/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['restaurant']}>
              <RestaurantDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/restaurant/orders"
          element={
            <RoleProtectedRoute allowedRoles={['restaurant']}>
              <OrderManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/restaurant/menu"
          element={
            <RoleProtectedRoute allowedRoles={['restaurant']}>
              <MenuManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/restaurant/profile"
          element={
            <RoleProtectedRoute allowedRoles={['restaurant']}>
              <RestaurantProfile />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/restaurant/reviews"
          element={
            <RoleProtectedRoute allowedRoles={['restaurant']}>
              <Reviews />
            </RoleProtectedRoute>
          }
        />
        
        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/driver/available-orders"
          element={
            <RoleProtectedRoute allowedRoles={['driver']}>
              <AvailableOrders />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/driver/active-delivery"
          element={
            <RoleProtectedRoute allowedRoles={['driver']}>
              <ActiveDelivery />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/driver/earnings"
          element={
            <RoleProtectedRoute allowedRoles={['driver']}>
              <Earnings />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/driver/profile"
          element={
            <RoleProtectedRoute allowedRoles={['driver']}>
              <DriverProfile />
            </RoleProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <RestaurantOnboarding />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <ContentManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <SupportTickets />
            </RoleProtectedRoute>
          }
        />
        
        {/* Legacy/Default Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {getDashboardByRole()}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
