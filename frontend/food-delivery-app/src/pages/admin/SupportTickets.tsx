import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SupportTickets: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const tickets = [
    { id: 1, ticketNumber: '#1234', user: 'John Doe', type: 'Refund Request', priority: 'high', status: 'open', created: '2 hours ago', message: 'Order never arrived' },
    { id: 2, ticketNumber: '#1233', user: 'Jane Smith', type: 'Payment Issue', priority: 'medium', status: 'in_progress', created: '5 hours ago', message: 'Card was charged twice' },
    { id: 3, ticketNumber: '#1232', user: 'Bob Johnson', type: 'Account Issue', priority: 'low', status: 'resolved', created: '1 day ago', message: 'Cannot reset password' },
  ];

  return (
    <div className="support-tickets-page">
      <div className="tickets-container">
        <div className="tickets-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>Support Tickets</h1>
        </div>

        {/* Filter */}
        <div className="tickets-filter">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All Tickets
          </button>
          <button className={filter === 'open' ? 'active' : ''} onClick={() => setFilter('open')}>
            Open
          </button>
          <button className={filter === 'in_progress' ? 'active' : ''} onClick={() => setFilter('in_progress')}>
            In Progress
          </button>
          <button className={filter === 'resolved' ? 'active' : ''} onClick={() => setFilter('resolved')}>
            Resolved
          </button>
        </div>

        {/* Tickets List */}
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header-support">
                <div>
                  <h3>{ticket.ticketNumber}</h3>
                  <p>{ticket.user}</p>
                </div>
                <div className="ticket-badges">
                  <span className={`priority-badge ${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                  <span className={`ticket-status-badge ${ticket.status}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="ticket-body">
                <div className="ticket-info-row">
                  <span className="info-label">Type:</span>
                  <span>{ticket.type}</span>
                </div>
                <div className="ticket-info-row">
                  <span className="info-label">Created:</span>
                  <span>{ticket.created}</span>
                </div>
                <div className="ticket-message">
                  <strong>Message:</strong>
                  <p>{ticket.message}</p>
                </div>
              </div>

              <div className="ticket-actions-support">
                <button className="view-ticket-btn">View Details</button>
                {ticket.status !== 'resolved' && (
                  <>
                    <button className="respond-btn">Respond</button>
                    <button className="resolve-btn">Mark Resolved</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .support-tickets-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .tickets-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .tickets-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .tickets-header h1 {
          font-size: 2rem;
        }

        .tickets-filter {
          display: flex;
          gap: var(--spacing-sm);
          background: white;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--spacing-xl);
        }

        .tickets-filter button {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
        }

        .tickets-filter button.active {
          background: var(--primary-orange);
          color: white;
        }

        .tickets-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .ticket-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
        }

        .ticket-header-support {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .ticket-header-support h3 {
          font-size: var(--font-size-xl);
          margin-bottom: 4px;
        }

        .ticket-header-support p {
          color: var(--text-secondary);
        }

        .ticket-badges {
          display: flex;
          gap: var(--spacing-sm);
        }

        .priority-badge, .ticket-status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: capitalize;
        }

        .priority-badge.high {
          background: rgba(244, 67, 54, 0.2);
          color: var(--error-red);
        }

        .priority-badge.medium {
          background: rgba(255, 193, 7, 0.2);
          color: #F57C00;
        }

        .priority-badge.low {
          background: rgba(158, 158, 158, 0.2);
          color: var(--text-secondary);
        }

        .ticket-status-badge.open {
          background: rgba(33, 150, 243, 0.2);
          color: #1976D2;
        }

        .ticket-status-badge.in_progress {
          background: rgba(255, 193, 7, 0.2);
          color: #F57C00;
        }

        .ticket-status-badge.resolved {
          background: rgba(0, 200, 83, 0.2);
          color: var(--secondary-green);
        }

        .ticket-body {
          margin-bottom: var(--spacing-lg);
        }

        .ticket-info-row {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xs);
        }

        .info-label {
          font-weight: var(--font-weight-semibold);
          color: var(--text-secondary);
        }

        .ticket-message {
          margin-top: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .ticket-message strong {
          display: block;
          margin-bottom: var(--spacing-xs);
        }

        .ticket-message p {
          color: var(--text-primary);
        }

        .ticket-actions-support {
          display: flex;
          gap: var(--spacing-sm);
        }

        .view-ticket-btn, .respond-btn, .resolve-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .view-ticket-btn {
          background: white;
          border: 2px solid var(--primary-orange);
          color: var(--primary-orange);
        }

        .respond-btn {
          background: var(--primary-orange);
          color: white;
        }

        .resolve-btn {
          background: var(--secondary-green);
          color: white;
        }
      `}</style>
    </div>
  );
};
