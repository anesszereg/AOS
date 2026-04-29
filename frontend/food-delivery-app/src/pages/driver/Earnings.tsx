import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Earnings: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('week');

  const earnings = {
    total: 1245.50,
    thisWeek: 345.75,
    pending: 145.50,
    nextPayout: 'Friday, Apr 28',
  };

  const weeklyData = [
    { day: 'Mon', amount: 45.50, deliveries: 4 },
    { day: 'Tue', amount: 67.25, deliveries: 6 },
    { day: 'Wed', amount: 52.00, deliveries: 5 },
    { day: 'Thu', amount: 78.50, deliveries: 7 },
    { day: 'Fri', amount: 102.50, deliveries: 9 },
    { day: 'Sat', amount: 0, deliveries: 0 },
    { day: 'Sun', amount: 0, deliveries: 0 },
  ];

  const recentDeliveries = [
    { id: 1, date: 'Apr 25, 2:30 PM', restaurant: "Luigi's Pizzeria", amount: 12.50 },
    { id: 2, date: 'Apr 25, 1:15 PM', restaurant: 'Burger House', amount: 8.75 },
    { id: 3, date: 'Apr 25, 12:00 PM', restaurant: 'Sushi Palace', amount: 15.00 },
    { id: 4, date: 'Apr 24, 7:45 PM', restaurant: 'Pizza Corner', amount: 11.25 },
    { id: 5, date: 'Apr 24, 6:30 PM', restaurant: 'Taco Bell', amount: 9.50 },
  ];

  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  return (
    <div className="earnings-page">
      <div className="earnings-container">
        <div className="earnings-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>Earnings</h1>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Total Earnings</span>
            <span className="summary-value">${earnings.total.toFixed(2)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">This Week</span>
            <span className="summary-value">${earnings.thisWeek.toFixed(2)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Pending</span>
            <span className="summary-value">${earnings.pending.toFixed(2)}</span>
          </div>
          <div className="summary-card highlight">
            <span className="summary-label">Next Payout</span>
            <span className="summary-value">{earnings.nextPayout}</span>
          </div>
        </div>

        {/* Period Filter */}
        <div className="period-filter">
          <button className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>
            This Week
          </button>
          <button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>
            This Month
          </button>
          <button className={period === 'all' ? 'active' : ''} onClick={() => setPeriod('all')}>
            All Time
          </button>
        </div>

        {/* Chart */}
        <div className="chart-section">
          <h3>Daily Earnings</h3>
          <div className="chart">
            {weeklyData.map((day) => (
              <div key={day.day} className="chart-bar">
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{height: `${(day.amount / maxAmount) * 100}%`}}
                  ></div>
                </div>
                <span className="bar-label">{day.day}</span>
                <span className="bar-value">${day.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="recent-section">
          <h3>Recent Deliveries</h3>
          <div className="deliveries-list">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="delivery-row">
                <div className="delivery-info">
                  <strong>{delivery.restaurant}</strong>
                  <span>{delivery.date}</span>
                </div>
                <span className="delivery-amount">${delivery.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .earnings-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .earnings-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .earnings-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .earnings-header h1 {
          font-size: 2rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .summary-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .summary-card.highlight {
          background: var(--secondary-green);
          color: white;
        }

        .summary-label {
          font-size: var(--font-size-sm);
          opacity: 0.8;
        }

        .summary-value {
          font-size: 1.8rem;
          font-weight: var(--font-weight-bold);
        }

        .period-filter {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
        }

        .period-filter button {
          flex: 1;
          padding: 12px;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
        }

        .period-filter button.active {
          background: var(--primary-orange);
          color: white;
          border-color: var(--primary-orange);
        }

        .chart-section, .recent-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
        }

        .chart-section h3, .recent-section h3 {
          margin-bottom: var(--spacing-lg);
        }

        .chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
          padding: var(--spacing-md) 0;
        }

        .chart-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .bar-container {
          width: 40px;
          height: 150px;
          background: var(--lighter-gray);
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .bar-fill {
          width: 100%;
          background: var(--primary-orange);
          transition: height 0.3s ease;
        }

        .bar-label {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
        }

        .bar-value {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }

        .deliveries-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .delivery-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .delivery-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .delivery-info strong {
          font-size: var(--font-size-base);
        }

        .delivery-info span {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .delivery-amount {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--secondary-green);
        }
      `}</style>
    </div>
  );
};
