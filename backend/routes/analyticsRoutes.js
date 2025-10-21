const express = require('express');
const router = express.Router();
const {
  getUserProgress,
  getInterviewHistory,
  getPerformanceInsights
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.route('/progress').get(protect, getUserProgress);
router.route('/history').get(protect, getInterviewHistory);
router.route('/insights').get(protect, getPerformanceInsights);
router.route('/latest').get(protect, require('../controllers/analyticsController').getLatestInterview);
router.route('/recommendations').get(protect, require('../controllers/analyticsController').getRecommendations);

module.exports = router;

