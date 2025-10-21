import React, { useState } from 'react';
import { paymentAPI } from '../services/api';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Create order for premium subscription
      const response = await paymentAPI.createOrder({
        amount: 999, // ₹9.99 in paise
        currency: 'INR'
      });

      // In a real implementation, you would integrate with Razorpay SDK
      // For now, we'll simulate a successful payment
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
        <p className="text-gray-600 mb-6">
          Get unlimited interviews, advanced analytics, and priority support.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Premium Plan</span>
            <span className="text-2xl font-bold">₹9.99/month</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ Unlimited mock interviews</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Priority support</li>
            <li>✓ All interview categories</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay ₹9.99'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

