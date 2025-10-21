const express = require('express');
const router = express.Router();
const {
  getNextQuestion,
  submitAnswer
} = require('../controllers/interviewSessionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.route('/question').get(protect, getNextQuestion);
router.route('/answer').post(protect, submitAnswer);

module.exports = router;