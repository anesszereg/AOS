import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuAPI } from '../../services/api';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaUtensils } from 'react-icons/fa';

export const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Pizza', 'Pasta', 'Salads', 'Desserts'];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getByRestaurant('current-restaurant-id');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMenuItems([
        { _id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 18.99, available: true },
        { _id: '2', name: 'Spaghetti', category: 'Pasta', price: 16.99, available: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-management-page">
      <div className="menu-container">
        <div className="menu-header">
          <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h1>Menu Management</h1>
          <button className="add-item-btn" onClick={() => setShowAddItem(true)}>
            <FaPlus /> Add Item
          </button>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="menu-items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="item-image">{item.image}</div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="item-actions">
                <label className="availability-toggle">
                  <input type="checkbox" checked={item.available} readOnly />
                  <span>{item.available ? 'Available' : 'Unavailable'}</span>
                </label>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        {showAddItem && (
          <div className="modal-overlay" onClick={() => setShowAddItem(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Menu Item</h2>
              <form className="add-item-form">
                <input type="text" placeholder="Item Name" required />
                <textarea placeholder="Description" rows={3}></textarea>
                <select>
                  <option value="">Select Category</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input type="number" placeholder="Price" step="0.01" required />
                <input type="file" accept="image/*" />
                <div className="dietary-options">
                  <label><input type="checkbox" /> Vegetarian</label>
                  <label><input type="checkbox" /> Vegan</label>
                  <label><input type="checkbox" /> Gluten-Free</label>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAddItem(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Add Item</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .menu-management-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .menu-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .menu-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .menu-header h1 {
          flex: 1;
          font-size: 2rem;
        }

        .add-item-btn {
          padding: 12px 24px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .category-filter {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .filter-btn.active {
          background: var(--primary-orange);
          color: white;
          border-color: var(--primary-orange);
        }

        .menu-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .menu-item-card {
          background: white;
          padding: var(--spacing-lg);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .item-image {
          font-size: 4rem;
          text-align: center;
          margin-bottom: var(--spacing-md);
        }

        .item-details h3 {
          font-size: var(--font-size-lg);
          margin-bottom: 4px;
        }

        .item-category {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-sm);
        }

        .item-price {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--primary-orange);
          margin-bottom: var(--spacing-md);
        }

        .item-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .availability-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: 8px;
          background: var(--lighter-gray);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
        }

        .edit-btn, .delete-btn {
          padding: 8px;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-weight: var(--font-weight-medium);
        }

        .edit-btn {
          background: var(--primary-orange);
          color: white;
        }

        .delete-btn {
          background: var(--error-red);
          color: white;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: var(--spacing-2xl);
          border-radius: var(--border-radius-xl);
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h2 {
          margin-bottom: var(--spacing-xl);
        }

        .add-item-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .add-item-form input, .add-item-form textarea, .add-item-form select {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-family: inherit;
        }

        .dietary-options {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .dietary-options label {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .modal-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }

        .modal-actions button {
          flex: 1;
          padding: 12px;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .modal-actions button:first-child {
          background: white;
          border: 2px solid var(--border-color);
        }

        .submit-btn {
          background: var(--primary-orange);
          color: white;
          border: none;
        }
      `}</style>
    </div>
  );
};
