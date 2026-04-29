import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FaArrowLeft, FaCreditCard, FaMoneyBillWave, FaWallet, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        restaurantId: '1', // From cart context
        items: [
          { menuItemId: '1', quantity: 2 },
          { menuItemId: '3', quantity: 1 }
        ],
        deliveryAddress: {
          street: '123 Main St',
          city: 'Naperville',
          state: 'IL',
          zipCode: '60540'
        },
        paymentMethod,
        deliveryInstructions,
        totalAmount: 54.97
      };
      
      const response = await orderAPI.create(orderData);
      navigate(`/order-confirmation?orderId=${response.data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      // Still navigate for demo purposes
      navigate('/order-confirmation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          {/* Delivery Address */}
          <div className="checkout-section">
            <h2>Delivery Address</h2>
            <div className="address-card-checkout">
              <div className="address-info-checkout">
                <FaMapMarkerAlt />
                <div>
                  <strong>Home</strong>
                  <p>123 Main St, Naperville, IL 60540</p>
                </div>
              </div>
              <button className="change-btn">Change</button>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="checkout-section">
            <h2>Delivery Instructions</h2>
            <textarea
              className="instructions-input"
              placeholder="Add delivery instructions (optional)"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              rows={3}
            />
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <div
                className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <FaCreditCard size={24} />
                <span>Credit/Debit Card</span>
                {paymentMethod === 'card' && <span className="checkmark"><FaCheck /></span>}
              </div>
              <div
                className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <FaMoneyBillWave size={24} />
                <span>Cash on Delivery</span>
                {paymentMethod === 'cash' && <span className="checkmark"><FaCheck /></span>}
              </div>
              <div
                className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <FaWallet size={24} />
                <span>Digital Wallet</span>
                {paymentMethod === 'wallet' && <span className="checkmark"><FaCheck /></span>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-section">
            <h2>Order Summary</h2>
            <div className="order-summary-checkout">
              <div className="summary-row-checkout">
                <span>Subtotal</span>
                <span>$54.97</span>
              </div>
              <div className="summary-row-checkout">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
              <div className="summary-row-checkout">
                <span>Tax</span>
                <span>$4.40</span>
              </div>
              <div className="summary-row-checkout total-row">
                <span>Total</span>
                <span>$62.36</span>
              </div>
            </div>
          </div>

          <button 
            className="place-order-btn" 
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order - $62.36'}
          </button>
        </div>
      </div>

      <style>{`
        .checkout-page {
          min-height: 100vh;
          background: var(--bg-gray);
          padding: var(--spacing-xl);
        }

        .checkout-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .checkout-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .checkout-header h1 {
          font-size: 2rem;
        }

        .checkout-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .checkout-section {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-xl);
        }

        .checkout-section h2 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-lg);
        }

        .address-card-checkout {
          display: flex;
          justify-content: space-between;
          align-items: start;
          padding: var(--spacing-md);
          background: var(--bg-gray);
          border-radius: var(--border-radius-md);
        }

        .address-info-checkout strong {
          display: block;
          margin-bottom: 4px;
        }

        .address-info-checkout p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .change-btn {
          background: none;
          border: 1px solid var(--primary-orange);
          color: var(--primary-orange);
          padding: 8px 16px;
          border-radius: var(--border-radius-md);
          cursor: pointer;
          font-weight: var(--font-weight-medium);
        }

        .instructions-input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          font-family: inherit;
          font-size: var(--font-size-base);
          resize: vertical;
        }

        .instructions-input:focus {
          outline: none;
          border-color: var(--primary-orange);
        }

        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .payment-option:hover {
          border-color: var(--primary-orange);
          background: var(--lighter-gray);
        }

        .payment-option.selected {
          border-color: var(--primary-orange);
          background: rgba(255, 87, 34, 0.05);
        }

        .payment-option span:first-child {
          font-size: 1.5rem;
        }

        .payment-option span:nth-child(2) {
          flex: 1;
          font-weight: var(--font-weight-medium);
        }

        .checkmark {
          color: var(--primary-orange);
          font-weight: bold;
          font-size: 1.2rem;
        }

        .order-summary-checkout {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .summary-row-checkout {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          color: var(--text-secondary);
        }

        .summary-row-checkout.total-row {
          border-top: 2px solid var(--border-color);
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-md);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .place-order-btn {
          width: 100%;
          padding: 18px;
          background: var(--primary-orange);
          color: white;
          border: none;
          border-radius: var(--border-radius-xl);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-base);
        }

        .place-order-btn:hover {
          background: var(--primary-orange-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }
      `}</style>
    </div>
  );
};
