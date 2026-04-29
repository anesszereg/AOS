import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await userAPI.getProfile();
      setProfile(response.data.data);
      setName(response.data.data.name || '');
      setPhone(response.data.data.phone || '');
    } catch (error) {
      console.log('No profile yet');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (profile) {
        await userAPI.updateProfile({ name, phone });
        setMessage('Profile updated successfully!');
      } else {
        await userAPI.createProfile({ name, phone });
        setMessage('Profile created successfully!');
      }
      loadProfile();
    } catch (error: any) {
      setMessage(error.response?.data?.error?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <h1>🍔 Food Delivery</h1>
          <div className="nav-actions">
            <button onClick={() => navigate('/')} className="btn-secondary">
              Dashboard
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="profile-section">
          <h2>👤 My Profile</h2>
          
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
              {loading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
