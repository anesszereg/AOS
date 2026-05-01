import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Margherita Pizza', price: 18.99, quantity: 2, restaurant: "Luigi's Pizzeria" },
    { id: 2, name: 'Spaghetti Carbonara', price: 16.99, quantity: 1, restaurant: "Luigi's Pizzeria" },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h1>Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon"><FaShoppingCart size={64} /></div>
            <h2>Your cart is empty</h2>
            <p>Add items to get started</p>
            <button className="browse-btn" onClick={() => navigate('/browse')}>
              Browse Restaurants
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-restaurant">{item.restaurant}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}><FaMinus /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><FaPlus /></button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .cart-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .cart-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .cart-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .cart-header h1 {
          font-size: 2rem;
        }

        .empty-cart {
          background: white;
          padding: var(--spacing-4xl);
          border-radius: var(--border-radius-xl);
          text-align: center;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: var(--spacing-lg);
        }

        .empty-cart h2 {
          margin-bottom: var(--spacing-sm);
        }

        .empty-cart p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
        }

        .browse-btn {
          padding: 14px 32px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
        }

        .cart-items {
          background: white;
          border-radius: var(--border-radius-xl);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-md) 0;
          border-bottom: 1px solid var(--border-color);
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .item-details h3 {
          font-size: var(--font-size-lg);
          margin-bottom: 4px;
        }

        .item-restaurant {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .item-price {
          font-weight: var(--font-weight-semibold);
          color: var(--primary-orange);
        }

        .item-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
          padding: 4px;
        }

        .quantity-controls button {
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-size: 1.2rem;
        }

        .quantity-controls span {
          min-width: 30px;
          text-align: center;
          font-weight: var(--font-weight-semibold);
        }

        .remove-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          opacity: 0.6;
        }

        .remove-btn:hover {
          opacity: 1;
        }

        .cart-summary {
          background: white;
          border-radius: var(--border-radius-xl);
          padding: var(--spacing-xl);
        }

        .cart-summary h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-lg);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          color: var(--text-secondary);
        }

        .summary-row.total {
          border-top: 2px solid var(--border-color);
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .checkout-btn {
          width: 100%;
          padding: 16px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          margin-top: var(--spacing-lg);
        }

        .checkout-btn:hover {
          background: var(--primary-orange-dark);
        }
      `}</style>
    </div>
  );
};
