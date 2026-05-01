import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaUtensils, FaSignOutAlt, FaHome, FaSave, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../services/api';
import '../styles/Dashboard.css';

function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log('Loading profile...');
      const response = await userAPI.getProfile();
      console.log('Profile loaded:', response.data.data);
      setProfile(response.data.data);
      setName(response.data.data.name || '');
      setPhone(response.data.data.phone || '');
    } catch (error) {
      console.log('No profile yet', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log('Saving profile...', { name, phone });

    try {
      if (profile) {
        await userAPI.updateProfile({ name, phone });
        const successMsg = 'Profile updated successfully!';
        setMessage(successMsg);
        toast.success(successMsg);
        console.log('Profile updated');
      } else {
        await userAPI.createProfile({ name, phone });
        const successMsg = 'Profile created successfully!';
        setMessage(successMsg);
        toast.success(successMsg);
        console.log('Profile created');
      }
      loadProfile();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Failed to save profile';
      setMessage(errorMsg);
      toast.error(errorMsg);
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <h1><FaUtensils className="inline mr-2" /> Food Delivery</h1>
          <div className="nav-actions">
            <button onClick={() => navigate('/')} className="btn-secondary">
              <FaHome className="inline mr-1" /> Dashboard
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              <FaSignOutAlt className="inline mr-1" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="profile-section">
          <h2><FaUser className="inline mr-2" /> My Profile</h2>
          
          <div className="profile-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
          </div>

          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <><FaSpinner className="inline animate-spin mr-2" /> Saving...</>
              ) : (
                <><FaSave className="inline mr-2" /> {profile ? 'Update Profile' : 'Create Profile'}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
