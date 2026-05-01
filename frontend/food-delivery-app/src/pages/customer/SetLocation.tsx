import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaMapMarkerAlt, FaSearch, FaCheck } from 'react-icons/fa';

export const SetLocation: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [savedAddresses] = useState([
    { id: 1, label: 'Home', address: '123 Main St, Naperville, IL 60540', isDefault: true },
    { id: 2, label: 'Work', address: '456 Office Blvd, Naperville, IL 60563', isDefault: false },
  ]);

  const handleConfirm = () => {
    console.log('Setting location...', { address });
    if (address || savedAddresses.length > 0) {
      const selectedAddress = address || savedAddresses[0].address;
      console.log('Location confirmed:', selectedAddress);
      toast.success('Location set successfully!');
      navigate('/browse');
    } else {
      toast.error('Please select or enter an address');
    }
  };

  return (
    <div className="set-location-page">
      <div className="location-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        
        <div className="location-content">
          <h1>Set Delivery Location</h1>
          <p className="subtitle">We'll show you restaurants that deliver to this address</p>

          {/* Current Location */}
          <button className="current-location-btn">
            <FaMapMarkerAlt />
            <span>Use Current Location</span>
          </button>

          {/* Search Address */}
          <div className="address-search">
            <input
              type="text"
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="address-input"
            />
            <button className="search-address-btn"><FaSearch /> Search</button>
          </div>

          {/* Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <h3>Saved Addresses</h3>
              {savedAddresses.map((addr) => (
                <div key={addr.id} className="address-card">
                  <div className="address-info">
                    <div className="address-label">
                      {addr.label}
                      {addr.isDefault && <span className="default-badge">Default</span>}
                    </div>
                    <div className="address-text">{addr.address}</div>
                  </div>
                  <button className="select-btn" onClick={handleConfirm}><FaCheck /> Select</button>
                </div>
              ))}
            </div>
          )}

          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Location
          </button>
        </div>
      </div>

      <style>{`
        .set-location-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .location-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .back-btn {
          background: white;
          border: none;
          padding: 12px 24px;
          border-radius: var(--border-radius-md);
          cursor: pointer;
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--spacing-lg);
          box-shadow: var(--shadow-sm);
        }

        .location-content {
          background: white;
          padding: var(--spacing-2xl);
          border-radius: var(--border-radius-xl);
          box-shadow: var(--shadow-md);
        }

        .location-content h1 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
        }

        .subtitle {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
        }

        .current-location-btn {
          width: 100%;
          padding: 16px;
          background: var(--lighter-gray);
          border: 2px dashed var(--border-color);
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--spacing-xl);
          transition: all var(--transition-base);
        }

        .current-location-btn:hover {
          background: var(--light-gray);
          border-color: var(--primary-orange);
        }

        .address-search {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-2xl);
        }

        .address-input {
          flex: 1;
          padding: 14px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-base);
        }

        .address-input:focus {
          outline: none;
          border-color: var(--primary-orange);
        }

        .search-address-btn {
          padding: 14px 24px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .saved-addresses {
          margin-bottom: var(--spacing-2xl);
        }

        .saved-addresses h3 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
        }

        .address-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
          margin-bottom: var(--spacing-md);
        }

        .address-label {
          font-weight: var(--font-weight-semibold);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .default-badge {
          background: var(--secondary-green);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: var(--font-size-xs);
        }

        .address-text {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .select-btn {
          padding: 8px 20px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
        }

        .confirm-btn {
          width: 100%;
          padding: 16px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .confirm-btn:hover {
          background: var(--primary-orange-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};
