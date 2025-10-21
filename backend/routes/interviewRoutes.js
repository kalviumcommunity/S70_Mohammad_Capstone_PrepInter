const express = require('express');
const router = express.Router();

const {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  startInterview,
} = require('../controllers/interviewController');

const { protect } = require('../middleware/authMiddleware');
const { skipQuestion, completeInterview } = require('../controllers/interviewSessionController');

router.post('/', protect, createInterview);
router.post('/start', protect, startInterview);
router.post('/skip', protect, skipQuestion);
router.get('/', protect, getInterviews);
router.route('/:id')
  .get(protect, getInterviewById)
  .put(protect, updateInterview)
  .delete(protect, deleteInterview);
router.put('/:id/complete', protect, completeInterview);

module.exports = router;
