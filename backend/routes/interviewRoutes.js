const express = require('express');
const router = express.Router();
const {
  startInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} = require('../controllers/interviewController');
const { protect, paidUser } = require('../middleware/authMiddleware');

// All routes are protected
router.route('/start').post(protect, startInterview);
router.route('/').get(protect, getInterviews);
router.route('/:id')
  .get(protect, getInterviewById)
  .put(protect, updateInterview)
  .delete(protect, deleteInterview);

module.exports = router;