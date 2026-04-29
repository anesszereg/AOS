import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewAPI } from '../../services/api';
import { FaArrowLeft, FaStar, FaReply } from 'react-icons/fa';

export const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ overall: 0, total: 0, breakdown: [] });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getByRestaurant('current-restaurant-id');
      setReviews(response.data);
      setStats({ overall: 4.7, total: response.data.length, breakdown: [] });
    } catch (error) {
      console.error('Error:', error);
      setReviews([
        { _id: '1', customer: { name: 'John Doe' }, rating: 5, comment: 'Amazing!', createdAt: new Date(), replied: false },
      ]);
      setStats({ overall: 4.7, total: 1, breakdown: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        <div className="reviews-header">
          <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h1>Customer Reviews</h1>
        </div>

        {/* Overall Rating */}
        <div className="rating-overview">
          <div className="overall-rating">
            <h2>{stats.overall}</h2>
            <div className="stars">
              {[...Array(5)].map((_, i) => <FaStar key={i} color="#FFD700" />)}
            </div>
            <p>{stats.total} reviews</p>
          </div>
          <div className="rating-breakdown">
            {stats.breakdown.map((item) => (
              <div key={item.stars} className="rating-bar">
                <span>{item.stars} ⭐</span>
                <div className="bar">
                  <div className="fill" style={{width: `${(item.count / stats.total) * 100}%`}}></div>
                </div>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="review-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All Reviews
          </button>
          <button className={filter === 'unreplied' ? 'active' : ''} onClick={() => setFilter('unreplied')}>
            Needs Response
          </button>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="customer-info">
                  <div className="avatar">👤</div>
                  <div>
                    <h3>{review.customer}</h3>
                    <div className="review-stars">
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
              {review.replied ? (
                <div className="response">
                  <strong>Your Response:</strong>
                  <p>{review.response}</p>
                </div>
              ) : (
                <div className="response-form">
                  <textarea placeholder="Write your response..."></textarea>
                  <button className="send-response-btn">Send Response</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .reviews-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .reviews-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .reviews-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .reviews-header h1 {
          font-size: 2rem;
        }

        .rating-overview {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
          margin-bottom: var(--spacing-xl);
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: var(--spacing-2xl);
        }

        .overall-rating {
          text-align: center;
        }

        .overall-rating h2 {
          font-size: 4rem;
          color: var(--primary-orange);
          margin-bottom: var(--spacing-sm);
        }

        .stars {
          font-size: 1.5rem;
          margin-bottom: var(--spacing-sm);
        }

        .rating-breakdown {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .rating-bar {
          display: grid;
          grid-template-columns: 60px 1fr 40px;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .bar {
          height: 8px;
          background: var(--lighter-gray);
          border-radius: 4px;
          overflow: hidden;
        }

        .fill {
          height: 100%;
          background: var(--primary-orange);
        }

        .review-filters {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
        }

        .review-filters button {
          padding: 10px 20px;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          font-weight: var(--font-weight-medium);
        }

        .review-filters button.active {
          background: var(--primary-orange);
          color: white;
          border-color: var(--primary-orange);
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .review-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .customer-info {
          display: flex;
          gap: var(--spacing-md);
        }

        .avatar {
          width: 50px;
          height: 50px;
          background: var(--lighter-gray);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .customer-info h3 {
          margin-bottom: 4px;
        }

        .review-stars {
          color: var(--yellow-badge);
        }

        .review-date {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .review-comment {
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
        }

        .response {
          background: var(--lighter-gray);
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          border-left: 3px solid var(--primary-orange);
        }

        .response strong {
          display: block;
          margin-bottom: var(--spacing-xs);
        }

        .response-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .response-form textarea {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-family: inherit;
          resize: vertical;
        }

        .send-response-btn {
          align-self: flex-end;
          padding: 10px 24px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .rating-overview {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
