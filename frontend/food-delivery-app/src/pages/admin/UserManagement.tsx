import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: 'Apr 20, 2026' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'restaurant', status: 'active', joined: 'Apr 18, 2026' },
    { id: 3, name: 'Bob Driver', email: 'bob@example.com', role: 'driver', status: 'active', joined: 'Apr 15, 2026' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'customer', status: 'suspended', joined: 'Apr 10, 2026' },
  ];

  return (
    <div className="user-management-page">
      <div className="user-mgmt-container">
        <div className="user-mgmt-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>User Management</h1>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-mgmt"
          />
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="restaurant">Restaurants</option>
            <option value="driver">Drivers</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge-mgmt ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joined}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn-mgmt">View</button>
                      <button className={user.status === 'active' ? 'suspend-btn' : 'activate-btn'}>
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .user-management-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .user-mgmt-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .user-mgmt-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .user-mgmt-header h1 {
          font-size: 2rem;
        }

        .search-filter-section {
          background: white;
          padding: var(--spacing-lg);
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--spacing-xl);
          display: flex;
          gap: var(--spacing-md);
        }

        .search-input-mgmt {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-base);
        }

        .filter-select {
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-base);
          min-width: 150px;
        }

        .users-table-container {
          background: white;
          border-radius: var(--border-radius-xl);
          overflow: hidden;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: var(--lighter-gray);
        }

        .users-table th {
          padding: var(--spacing-md);
          text-align: left;
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .users-table td {
          padding: var(--spacing-md);
          border-top: 1px solid var(--border-color);
        }

        .role-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: capitalize;
        }

        .role-badge.customer {
          background: rgba(33, 150, 243, 0.2);
          color: #1976D2;
        }

        .role-badge.restaurant {
          background: rgba(255, 152, 0, 0.2);
          color: #F57C00;
        }

        .role-badge.driver {
          background: rgba(76, 175, 80, 0.2);
          color: #388E3C;
        }

        .status-badge-mgmt {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: capitalize;
        }

        .status-badge-mgmt.active {
          background: rgba(0, 200, 83, 0.2);
          color: var(--secondary-green);
        }

        .status-badge-mgmt.suspended {
          background: rgba(244, 67, 54, 0.2);
          color: var(--error-red);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-xs);
        }

        .view-btn-mgmt, .suspend-btn, .activate-btn {
          padding: 6px 12px;
          border: none;
          border-radius: var(--border-radius-sm);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
        }

        .view-btn-mgmt {
          background: var(--primary-orange);
          color: white;
        }

        .suspend-btn {
          background: var(--error-red);
          color: white;
        }

        .activate-btn {
          background: var(--secondary-green);
          color: white;
        }

        @media (max-width: 768px) {
          .users-table-container {
            overflow-x: auto;
          }
          
          .search-filter-section {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
