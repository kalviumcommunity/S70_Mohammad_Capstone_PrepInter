const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); 
    throw new Error('Please add all fields'); }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');  }

  const user = await User.create({ name, email, password, });

  if (user) {
    res.status(201).json({ _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id), });
  } else {
    res.status(400);
    throw new Error('Invalid user data');}
});
// login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({_id: user.id,name: user.name,email: user.email,role: user.role,avatar: user.avatar,
      interviewsTaken: user.interviewsTaken, token: generateToken(user._id), });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');}
});
//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');}

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS,},
    });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'PrepInter - Password Reset OTP', text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
    html: `<h1>PrepInter - Password Reset</h1><p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,};

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
      res.status(500);
      throw new Error('Error sending email');
    } else {
      res.status(200).json({ message: 'OTP sent to email' });
    }
  });
});
// verify otp
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, resetPasswordOTP: otp, resetPasswordOTPExpire: { $gt: Date.now() },});

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP');}
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpire = undefined;
  await user.save();
  res.json({ resetToken });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const user = await User.findOne({resetPasswordToken,resetPasswordExpire: { $gt: Date.now() }, });
  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
});
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
module.exports = { registerUser, loginUser, forgotPassword, verifyOTP, resetPassword }