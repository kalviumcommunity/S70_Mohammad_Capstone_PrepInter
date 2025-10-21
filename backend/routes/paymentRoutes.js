const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getSubscriptionStatus,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.route('/create-order').post(protect, createOrder);
router.route('/verify').post(protect, verifyPayment);
router.route('/history').get(protect, getPaymentHistory);
router.get('/subscription', protect, getSubscriptionStatus);

module.exports = router;