import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaUtensils, FaEye, FaEyeSlash, FaGoogle, FaApple, FaGlobe, FaShieldAlt, FaStar, FaClock, FaQuestionCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import '../styles/NewAuth.css';

export const NewRegister: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Starting registration...', { email: formData.email, role: formData.role });

    try {
      console.log('Registering user...');
      await api.post('/auth/register', formData);
      toast.success('Account created successfully!');
      
      console.log('Logging in...');
      const loginResponse = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      const { user, tokens } = loginResponse.data.data;
      console.log('Login successful:', { user: user.email, role: user.role });
      login(user, tokens.accessToken, tokens.refreshToken);
      toast.success(`Welcome ${user.email}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || 'Registration failed. Please try again.';
      console.error('Registration failed:', err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">
        <div className="auth-logo">
          <div className="auth-logo-icon"><FaUtensils /></div>
          <span>CraveBite</span>
        </div>

        <div className="auth-hero">
          <div className="auth-hero-content">
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop" 
                alt="Burger"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop" 
                alt="Pizza"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop" 
                alt="Sushi"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop" 
                alt="Salad"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '24px 32px',
                borderRadius: '16px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#2C3E50' }}>
                  Discover Local Flavors
                </h3>
                <p style={{ color: '#7F8C8D', fontSize: '14px' }}>
                  Join thousands of foodies ordering from the best spots.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-features">
          <div className="auth-feature-card">
            <div className="auth-feature-icon"><FaClock /></div>
            <div className="auth-feature-title">Lightning Fast</div>
            <div className="auth-feature-desc">Hot food delivered to your door in under 30 minutes, guaranteed.</div>
          </div>
          <div className="auth-feature-card">
            <div className="auth-feature-icon"><FaUtensils /></div>
            <div className="auth-feature-title">Fresh Ingredients</div>
            <div className="auth-feature-desc">Partnering only with top-rated local restaurants and chefs.</div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className="auth-help">
          <span>Help & Support</span>
          <FaQuestionCircle />
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h1 className="auth-title">
              Satisfy your <span className="auth-title-highlight">Cravings</span>
            </h1>
            <p className="auth-subtitle">Join thousands of foodies discovering the best local flavors.</p>
          </div>

          <div className="auth-tabs">
            <Link to="/login" className="auth-tab">Sign In</Link>
            <button className="auth-tab active">Create Account</button>
          </div>

          {error && (
            <div className="error-message">
              <FaQuestionCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FaEnvelope /></span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FaLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="form-input-action"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">I am a</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{ paddingLeft: '16px' }}
                required
              >
                <option value="customer">Customer - Order food</option>
                <option value="restaurant">Restaurant Owner - Sell food</option>
                <option value="driver">Delivery Driver - Deliver orders</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign In / Register →'}
            </button>

            <p style={{ fontSize: '12px', color: '#7F8C8D', marginTop: '12px', textAlign: 'center' }}>
              By continuing, you agree to our <a href="#" style={{ color: '#FF5722' }}>Terms of Service</a> and <a href="#" style={{ color: '#FF5722' }}>Privacy Policy</a>
            </p>
          </form>

          <div className="auth-divider">OR CONTINUE WITH</div>

          <div className="auth-social">
            <button 
              className="social-btn social-btn-google"
              onClick={() => handleSocialSignup('google')}
            >
              <FaGoogle />
              <span>Continue with Google</span>
            </button>
            <button 
              className="social-btn social-btn-apple"
              onClick={() => handleSocialSignup('apple')}
            >
              <FaApple />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-guest">
            <button 
              className="auth-guest-btn"
              onClick={() => navigate('/browse')}
            >
              <FaGlobe />
              <span>Browse as Guest</span>
            </button>
          </div>

          <div className="auth-footer">
            <div className="auth-trust">
              <div className="trust-item">
                <span className="trust-icon"><FaShieldAlt /></span>
                <span>Secure</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><FaStar /></span>
                <span>4.9/5</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><FaClock /></span>
                <span>24/7</span>
              </div>
            </div>
            <div className="auth-links">
              <span>Terms of Service</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
