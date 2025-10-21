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

// @desc    Create a new order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error('Please provide an amount');
  }

  // Create unique order ID
  const orderId = `order_${Date.now()}_${req.user._id}`;

  // Create order in Razorpay
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    receipt: orderId,
    payment_capture: 1, // Auto-capture payment
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

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400);
    throw new Error('Missing payment verification details');
  }

  // Find the payment in our database
  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    // Update payment status to failed
    payment.status = 'failed';
    await payment.save();

    res.status(400);
    throw new Error('Invalid payment signature');
  }

  // Update payment details
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'paid';
  await payment.save();

  // Upgrade user to paid
  await User.findByIdAndUpdate(req.user._id, { role: 'paid' });

  res.json({
    success: true,
    message: 'Payment verified successfully',
    payment,
  });
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(payments);
});
// @desc    Get subscription status
// @route   GET /api/payments/subscription
// @access  Private
const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const isPaid = user.role === 'paid';
  const subscriptionEnd = user.subscriptionEnd || null;
  const isActive = isPaid && subscriptionEnd && new Date(subscriptionEnd) > new Date();
  
  res.status(200).json({
    isPaid,
    isActive,
    subscriptionEnd,
    daysRemaining: isActive ? Math.ceil((new Date(subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24)) : 0
  });
});
module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getSubscriptionStatus,
};