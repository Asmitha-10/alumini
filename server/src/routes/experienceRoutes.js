const express = require('express');
const { createExperience, getExperiences, getExperienceById } = require('../controllers/experienceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getExperiences);
router.get('/:id', protect, getExperienceById);
router.post('/', protect, authorize('alumni'), createExperience);

module.exports = router;
