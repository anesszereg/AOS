import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const RestaurantOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState<number | null>(null);

  const applications = [
    { id: 1, name: 'Pizza Paradise', owner: 'John Smith', cuisine: 'Italian', address: '123 Main St', phone: '+1 (555) 123-4567', submitted: 'Apr 24, 2026', status: 'pending' },
    { id: 2, name: 'Sushi World', owner: 'Jane Doe', cuisine: 'Japanese', address: '456 Oak Ave', phone: '+1 (555) 987-6543', submitted: 'Apr 23, 2026', status: 'pending' },
    { id: 3, name: 'Burger King', owner: 'Bob Johnson', cuisine: 'American', address: '789 Elm St', phone: '+1 (555) 456-7890', submitted: 'Apr 22, 2026', status: 'approved' },
  ];

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>Restaurant Onboarding</h1>
        </div>

        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app.id} className="application-card" onClick={() => setSelectedApp(app.id)}>
              <div className="app-header">
                <h3>{app.name}</h3>
                <span className={`app-status ${app.status}`}>{app.status}</span>
              </div>
              <div className="app-details">
                <div className="detail-item">
                  <span className="label">Owner:</span>
                  <span>{app.owner}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Cuisine:</span>
                  <span>{app.cuisine}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Address:</span>
                  <span>{app.address}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span>{app.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Submitted:</span>
                  <span>{app.submitted}</span>
                </div>
              </div>
              {app.status === 'pending' && (
                <div className="app-actions">
                  <button className="reject-app-btn" onClick={(e) => e.stopPropagation()}>
                    Reject
                  </button>
                  <button className="approve-app-btn" onClick={(e) => e.stopPropagation()}>
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .onboarding-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .onboarding-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .onboarding-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .onboarding-header h1 {
          font-size: 2rem;
        }

        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--spacing-lg);
        }

        .application-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .application-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .app-header h3 {
          font-size: var(--font-size-xl);
        }

        .app-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: capitalize;
        }

        .app-status.pending {
          background: rgba(255, 193, 7, 0.2);
          color: #F57C00;
        }

        .app-status.approved {
          background: rgba(0, 200, 83, 0.2);
          color: var(--secondary-green);
        }

        .app-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
        }

        .detail-item .label {
          color: var(--text-secondary);
          font-weight: var(--font-weight-medium);
        }

        .app-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .reject-app-btn, .approve-app-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .reject-app-btn {
          background: white;
          border: 2px solid var(--error-red);
          color: var(--error-red);
        }

        .approve-app-btn {
          background: var(--secondary-green);
          color: white;
        }
      `}</style>
    </div>
  );
};
