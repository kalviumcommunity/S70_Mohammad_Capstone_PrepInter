const express = require('express');
const router = express.Router();

const { registerUser, loginUser, forgotPassword, verifyOTP, resetPassword } = require('../controllers/userController')
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp', verifyOTP);
router.post('/resetpassword', resetPassword);

module.exports = router;