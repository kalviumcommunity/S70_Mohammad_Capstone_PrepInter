const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error('Please provide an amount');
  }
  const orderId = `order_${Date.now()}_${req.user._id}`;


  // Create order in Razorpay
  const options = {
    amount: amount * 100, 
    currency,
    receipt: orderId,
    payment_capture: 1, 
  };

  try {
    const response = await razorpay.orders.create(options);
    // Save order details in database
    const payment = await Payment.create({
      userId: req.user._id,
      orderId,
      razorpayOrderId: response.id,
      amount,
      currency,
      status: 'created',
    });

    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      orderId: payment.orderId,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500);
    throw new Error('Error creating payment order');
  }
});

module.exports = { createOrder }