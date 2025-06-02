const express = require('express');
const router = express.Router();
const {
  createOrder,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/create-order').post(protect, createOrder);

module.exports = router;