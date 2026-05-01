import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCamera } from 'react-icons/fa';

export const DriverProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Driver',
    email: 'john.driver@example.com',
    phone: '+1 (555) 123-4567',
    vehicleMake: 'Honda',
    vehicleModel: 'Civic',
    vehicleYear: '2020',
    licensePlate: 'ABC 123',
    bankAccount: '****1234',
  });

  return (
    <div className="driver-profile-page">
      <div className="driver-profile-container">
        <div className="driver-profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>Driver Profile</h1>
        </div>

        {/* Profile Photo */}
        <div className="photo-section">
          <div className="profile-photo"><FaUser /></div>
          <button className="upload-photo-btn"><FaCamera className="inline mr-2" /> Change Photo</button>
        </div>

        {/* Personal Info */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="form-grid-driver">
            <div className="form-group-driver">
              <label>Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group-driver">
              <label>Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group-driver">
              <label>Phone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="profile-section">
          <h2>Vehicle Information</h2>
          <div className="form-grid-driver">
            <div className="form-group-driver">
              <label>Make</label>
              <input 
                type="text" 
                value={formData.vehicleMake}
                onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
              />
            </div>
            <div className="form-group-driver">
              <label>Model</label>
              <input 
                type="text" 
                value={formData.vehicleModel}
                onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
              />
            </div>
            <div className="form-group-driver">
              <label>Year</label>
              <input 
                type="text" 
                value={formData.vehicleYear}
                onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
              />
            </div>
            <div className="form-group-driver">
              <label>License Plate</label>
              <input 
                type="text" 
                value={formData.licensePlate}
                onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="profile-section">
          <h2>Documents</h2>
          <div className="documents-grid">
            <div className="document-card">
              <span className="doc-icon">📄</span>
              <div className="doc-info">
                <strong>Driver's License</strong>
                <span className="doc-status verified">Verified</span>
              </div>
              <button className="upload-doc-btn">Update</button>
            </div>
            <div className="document-card">
              <span className="doc-icon">📄</span>
              <div className="doc-info">
                <strong>Vehicle Insurance</strong>
                <span className="doc-status verified">Verified</span>
              </div>
              <button className="upload-doc-btn">Update</button>
            </div>
            <div className="document-card">
              <span className="doc-icon">📄</span>
              <div className="doc-info">
                <strong>Vehicle Registration</strong>
                <span className="doc-status pending">Pending</span>
              </div>
              <button className="upload-doc-btn">Upload</button>
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="profile-section">
          <h2>Bank Account</h2>
          <div className="bank-info">
            <div className="bank-display">
              <span>Account Number</span>
              <strong>{formData.bankAccount}</strong>
            </div>
            <button className="update-bank-btn">Update Bank Details</button>
          </div>
        </div>

        {/* Availability */}
        <div className="profile-section">
          <h2>Availability Settings</h2>
          <div className="availability-options">
            <label className="availability-item">
              <input type="checkbox" defaultChecked />
              <span>Available on Weekdays</span>
            </label>
            <label className="availability-item">
              <input type="checkbox" defaultChecked />
              <span>Available on Weekends</span>
            </label>
            <label className="availability-item">
              <input type="checkbox" />
              <span>Available for Late Night Deliveries</span>
            </label>
          </div>
        </div>

        <button className="save-profile-btn">Save Changes</button>
      </div>

      <style>{`
        .driver-profile-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .driver-profile-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .driver-profile-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .driver-profile-header h1 {
          font-size: 2rem;
        }

        .photo-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .profile-photo {
          width: 100px;
          height: 100px;
          background: var(--lighter-gray);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }

        .upload-photo-btn {
          padding: 10px 20px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          cursor: pointer;
        }

        .profile-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
        }

        .profile-section h2 {
          margin-bottom: var(--spacing-lg);
        }

        .form-grid-driver {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }

        .form-group-driver {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-group-driver label {
          font-weight: var(--font-weight-semibold);
        }

        .form-group-driver input {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
        }

        .documents-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .document-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .doc-icon {
          font-size: 2rem;
        }

        .doc-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .doc-status {
          font-size: var(--font-size-sm);
          padding: 4px 8px;
          border-radius: 12px;
          width: fit-content;
        }

        .doc-status.verified {
          background: rgba(0, 200, 83, 0.2);
          color: var(--secondary-green);
        }

        .doc-status.pending {
          background: rgba(255, 193, 7, 0.2);
          color: #F57C00;
        }

        .upload-doc-btn {
          padding: 8px 16px;
          background: white;
          border: 2px solid var(--primary-orange);
          color: var(--primary-orange);
          border-radius: var(--border-radius-md);
          cursor: pointer;
        }

        .bank-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .bank-display {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bank-display span {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .update-bank-btn {
          padding: 10px 20px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          cursor: pointer;
        }

        .availability-options {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .availability-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
          cursor: pointer;
        }

        .save-profile-btn {
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
      `}</style>
    </div>
  );
};
