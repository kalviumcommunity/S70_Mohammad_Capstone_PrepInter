const express = require('express');
const router = express.Router();
const {
  startInterview,
  deleteInterview,
} = require('../controllers/interviewController')

const { protect, paidUser } = require('../middleware/authMiddleware');

router.route('/start').post(protect, startInterview);
router.route('/:id')
  .delete(protect, deleteInterview);

module.exports = router;