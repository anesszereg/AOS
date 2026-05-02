import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import { FaArrowLeft, FaSearch, FaStar } from 'react-icons/fa';

export const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      console.log('[Customer:SearchResults] Starting operation...');
      setLoading(true);
      const response = console.log('API call:', 'await restaurantAPI.getAll({ search: query })...');
      await restaurantAPI.getAll({ search: query });
      setResults(response.data);
    } catch (error: any) {
      console.error('[Customer:SearchResults] Error:', error);
      console.error('[Customer:SearchResults] Details:', error.response?.data || error.message);) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="search-bar">
          <input type="text" defaultValue={query} placeholder="Search for food..." />
          <button><FaSearch /></button>
        </div>
      </div>

      <div className="results-container">
        <h2>Results for "{query}"</h2>
        <p className="results-count">{results.length} items found</p>

        <div className="results-grid">
          {results.map((item) => (
            <div key={item.id} className="result-card" onClick={() => navigate(`/restaurant/${item.id}`)}>
              <img src={item.image} alt={item.name} />
              <div className="result-info">
                <h3>{item.name}</h3>
                <p className="restaurant-name">{item.restaurant}</p>
                <div className="result-footer">
                  <span className="rating"><FaStar color="#FFD700" /> {item.rating}</span>
                  <span className="price">${item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .search-results-page {
          min-height: 100vh;
          background: var(--bg-gray);
        }

        .search-header {
          background: white;
          padding: var(--spacing-md);
          display: flex;
          gap: var(--spacing-md);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .search-bar {
          flex: 1;
          display: flex;
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
          overflow: hidden;
        }

        .search-bar input {
          flex: 1;
          border: none;
          padding: 12px 16px;
          font-size: var(--font-size-base);
        }

        .search-bar button {
          background: var(--primary-orange);
          color: white;
          border: none;
          padding: 0 20px;
          cursor: pointer;
        }

        .results-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-xl);
        }

        .results-container h2 {
          font-size: 1.8rem;
          margin-bottom: var(--spacing-xs);
        }

        .results-count {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .result-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
        }

        .result-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .result-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .result-info {
          padding: var(--spacing-md);
        }

        .result-info h3 {
          font-size: var(--font-size-lg);
          margin-bottom: 4px;
        }

        .restaurant-name {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-sm);
        }

        .result-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rating {
          font-weight: var(--font-weight-semibold);
        }

        .price {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--primary-orange);
        }
      `}</style>
    </div>
  );
};
