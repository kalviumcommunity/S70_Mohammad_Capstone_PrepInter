const express = require('express');
const router = express.Router();
const {
  startInterview,
} = require('../controllers/interviewController')

const { protect, paidUser } = require('../middleware/authMiddleware');

router.route('/start').post(protect, startInterview);

module.exports = router;