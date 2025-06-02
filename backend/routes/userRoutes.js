const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {registerUser, loginUser, forgotPassword, verifyOTP, resetPassword,
     getUserById, getUserProfile, getUsers, updateUserProfile, updateUser} = require('../controllers/userController')

     
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp', verifyOTP);
router.post('/resetpassword', resetPassword);

//protected routes updated
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

//admin routes updated
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

module.exports = router;