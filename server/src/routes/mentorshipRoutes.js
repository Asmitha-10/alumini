const express = require('express');
const {
  createMentorshipRequest,
  getMyMentorshipRequests,
  respondMentorshipRequest,
} = require('../controllers/mentorshipController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyMentorshipRequests);
router.post('/', protect, authorize('student'), createMentorshipRequest);
router.patch('/:id/respond', protect, authorize('alumni'), respondMentorshipRequest);

module.exports = router;
