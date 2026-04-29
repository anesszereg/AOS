import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import { FaArrowLeft, FaCamera, FaUtensils, FaSave } from 'react-icons/fa';

export const RestaurantProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Luigi's Pizzeria",
    cuisine: 'Italian',
    description: 'Authentic Italian cuisine with fresh ingredients',
    address: '123 Main St, Naperville, IL 60540',
    phone: '+1 (555) 123-4567',
    email: 'luigi@pizzeria.com',
  });

  const [hours] = useState([
    { day: 'Monday', open: '11:00', close: '22:00', closed: false },
    { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '22:00', closed: false },
    { day: 'Friday', open: '11:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '11:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '12:00', close: '21:00', closed: false },
  ]);

  return (
    <div className="restaurant-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h1>Restaurant Profile</h1>
        </div>

        {/* Cover Image */}
        <div className="cover-section">
          <div className="cover-image">
            <FaCamera size={48} />
            <p>Upload Cover Image</p>
          </div>
          <div className="logo-upload">
            <div className="logo-placeholder"><FaUtensils size={48} /></div>
            <button className="upload-logo-btn">Change Logo</button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="info-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Restaurant Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Cuisine Type</label>
              <input 
                type="text" 
                value={formData.cuisine}
                onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="form-group full-width">
              <label>Address</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="hours-section">
          <h2>Business Hours</h2>
          <div className="hours-list">
            {hours.map((day) => (
              <div key={day.day} className="hours-row">
                <span className="day-name">{day.day}</span>
                <div className="hours-inputs">
                  <input type="time" value={day.open} disabled={day.closed} />
                  <span>to</span>
                  <input type="time" value={day.close} disabled={day.closed} />
                </div>
                <label className="closed-toggle">
                  <input type="checkbox" checked={day.closed} readOnly />
                  <span>Closed</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button className="save-btn">Save Changes</button>
      </div>

      <style>{`
        .restaurant-profile-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .profile-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .profile-header h1 {
          font-size: 2rem;
        }

        .cover-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
          position: relative;
        }

        .cover-image {
          height: 200px;
          background: var(--lighter-gray);
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: var(--spacing-xl);
        }

        .cover-image span {
          font-size: 3rem;
          margin-bottom: var(--spacing-sm);
        }

        .logo-upload {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .logo-placeholder {
          width: 100px;
          height: 100px;
          background: var(--lighter-gray);
          border-radius: var(--border-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }

        .upload-logo-btn {
          padding: 10px 20px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          cursor: pointer;
        }

        .info-section, .hours-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
        }

        .info-section h2, .hours-section h2 {
          margin-bottom: var(--spacing-lg);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .form-group input, .form-group textarea {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-family: inherit;
        }

        .hours-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .hours-row {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: var(--spacing-md);
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .day-name {
          font-weight: var(--font-weight-semibold);
        }

        .hours-inputs {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .hours-inputs input {
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
        }

        .closed-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          cursor: pointer;
        }

        .save-btn {
          width: 100%;
          padding: 16px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .hours-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
