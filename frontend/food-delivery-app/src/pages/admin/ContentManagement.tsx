import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('banners');

  const banners = [
    { id: 1, title: 'Summer Sale', active: true, startDate: 'Apr 20', endDate: 'May 20' },
    { id: 2, title: 'Free Delivery', active: true, startDate: 'Apr 15', endDate: 'Apr 30' },
  ];

  const coupons = [
    { id: 1, code: 'SAVE20', discount: '20%', uses: 145, maxUses: 500, expires: 'May 1, 2026' },
    { id: 2, code: 'FIRST10', discount: '$10', uses: 89, maxUses: 200, expires: 'Apr 30, 2026' },
  ];

  const featured = [
    { id: 1, restaurant: "Luigi's Pizzeria", position: 1, active: true },
    { id: 2, restaurant: 'Sushi Palace', position: 2, active: true },
    { id: 3, restaurant: 'Burger House', position: 3, active: false },
  ];

  return (
    <div className="content-management-page">
      <div className="content-container">
        <div className="content-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>Content Management</h1>
        </div>

        {/* Tabs */}
        <div className="content-tabs">
          <button className={activeTab === 'banners' ? 'active' : ''} onClick={() => setActiveTab('banners')}>
            Banners
          </button>
          <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => setActiveTab('coupons')}>
            Coupons
          </button>
          <button className={activeTab === 'featured' ? 'active' : ''} onClick={() => setActiveTab('featured')}>
            Featured
          </button>
        </div>

        {/* Banners */}
        {activeTab === 'banners' && (
          <div className="content-section">
            <div className="section-header-content">
              <h2>Promotional Banners</h2>
              <button className="add-content-btn">+ Add Banner</button>
            </div>
            <div className="content-list">
              {banners.map((banner) => (
                <div key={banner.id} className="content-item">
                  <div className="content-info">
                    <h3>{banner.title}</h3>
                    <p>{banner.startDate} - {banner.endDate}</p>
                  </div>
                  <div className="content-actions-row">
                    <span className={`content-status ${banner.active ? 'active' : 'inactive'}`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                    <button className="edit-content-btn">Edit</button>
                    <button className="delete-content-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupons */}
        {activeTab === 'coupons' && (
          <div className="content-section">
            <div className="section-header-content">
              <h2>Coupon Codes</h2>
              <button className="add-content-btn">+ Create Coupon</button>
            </div>
            <div className="content-list">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="content-item">
                  <div className="content-info">
                    <h3>{coupon.code}</h3>
                    <p>{coupon.discount} off • {coupon.uses}/{coupon.maxUses} uses • Expires {coupon.expires}</p>
                  </div>
                  <div className="content-actions-row">
                    <button className="edit-content-btn">Edit</button>
                    <button className="delete-content-btn">Disable</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured */}
        {activeTab === 'featured' && (
          <div className="content-section">
            <div className="section-header-content">
              <h2>Featured Restaurants</h2>
              <button className="add-content-btn">+ Add Featured</button>
            </div>
            <div className="content-list">
              {featured.map((item) => (
                <div key={item.id} className="content-item">
                  <div className="content-info">
                    <h3>{item.restaurant}</h3>
                    <p>Position: {item.position}</p>
                  </div>
                  <div className="content-actions-row">
                    <span className={`content-status ${item.active ? 'active' : 'inactive'}`}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                    <button className="edit-content-btn">Edit</button>
                    <button className="delete-content-btn">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .content-management-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .content-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .content-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .content-header h1 {
          font-size: 2rem;
        }

        .content-tabs {
          display: flex;
          gap: var(--spacing-sm);
          background: white;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--spacing-xl);
        }

        .content-tabs button {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .content-tabs button.active {
          background: var(--primary-orange);
          color: white;
        }

        .content-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
        }

        .section-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .add-content-btn {
          padding: 10px 20px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .content-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .content-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .content-info h3 {
          margin-bottom: 4px;
        }

        .content-info p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .content-actions-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .content-status {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
        }

        .content-status.active {
          background: rgba(0, 200, 83, 0.2);
          color: var(--secondary-green);
        }

        .content-status.inactive {
          background: rgba(158, 158, 158, 0.2);
          color: var(--text-secondary);
        }

        .edit-content-btn, .delete-content-btn {
          padding: 8px 16px;
          border: none;
          border-radius: var(--border-radius-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
        }

        .edit-content-btn {
          background: var(--primary-orange);
          color: white;
        }

        .delete-content-btn {
          background: var(--error-red);
          color: white;
        }
      `}</style>
    </div>
  );
};
