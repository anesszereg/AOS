import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import '../styles/NewAuth.css';

export const NewLogin: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { user, tokens } = response.data.data;
      
      login(user, tokens.accessToken, tokens.refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="auth-container">
      {/* Left Side - Dark with Food Images */}
      <div className="auth-left">
        <div className="auth-logo">
          <div className="auth-logo-icon">🍔</div>
          <span>CraveBite</span>
        </div>

        <div className="auth-hero">
          <div className="auth-hero-content">
            <div style={{ position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=600&h=600&fit=crop" 
                alt="Delicious Ramen"
                className="auth-hero-image"
              />
              <div className="auth-badge">🔥 20% OFF FIRST ORDER</div>
              <div className="auth-tag">
                <div className="auth-tag-title">Hot & Spicy</div>
                <div className="auth-tag-subtitle">Trending near you</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-features">
          <div className="auth-feature-card">
            <div className="auth-feature-icon">⚡</div>
            <div className="auth-feature-title">Lightning Fast</div>
            <div className="auth-feature-desc">Hot food delivered to your door in under 30 minutes, guaranteed.</div>
          </div>
          <div className="auth-feature-card">
            <div className="auth-feature-icon">🥗</div>
            <div className="auth-feature-title">Fresh Ingredients</div>
            <div className="auth-feature-desc">Partnering only with top-rated local restaurants and chefs.</div>
          </div>
        </div>
      </div>

      {/* Right Side - White with Form */}
      <div className="auth-right">
        <div className="auth-help">
          <span>Help & Support</span>
          <span>❓</span>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h1 className="auth-title">
              Welcome <span className="auth-title-highlight">Back</span>
            </h1>
            <p className="auth-subtitle">Enter your details to access your account.</p>
          </div>

          <div className="auth-tabs">
            <button className="auth-tab active">Sign In</button>
            <Link to="/register" className="auth-tab">Create Account</Link>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon">📧</span>
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
                <span className="form-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="form-input-action"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <Link to="/forgot-password" className="form-forgot">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider">OR CONTINUE WITH</div>

          <div className="auth-social">
            <button 
              className="social-btn social-btn-google"
              onClick={() => handleSocialLogin('google')}
            >
              <span>G</span>
              <span>Continue with Google</span>
            </button>
            <button 
              className="social-btn social-btn-apple"
              onClick={() => handleSocialLogin('apple')}
            >
              <span>🍎</span>
              <span>Continue with Apple</span>
            </button>
            <button 
              className="social-btn social-btn-facebook"
              onClick={() => handleSocialLogin('facebook')}
            >
              <span>f</span>
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="auth-guest">
            <button 
              className="auth-guest-btn"
              onClick={() => navigate('/browse')}
            >
              <span>🌐</span>
              <span>Browse as Guest</span>
            </button>
          </div>

          <div className="auth-footer">
            <div className="auth-trust">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Secure</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⭐</span>
                <span>4.9/5</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🕐</span>
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
