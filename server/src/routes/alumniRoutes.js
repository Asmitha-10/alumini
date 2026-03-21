const express = require('express');
const { getAlumni, getAlumniById, getAlumniDashboard } = require('../controllers/alumniController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAlumni);
router.get('/dashboard', protect, authorize('alumni'), getAlumniDashboard);
router.get('/:id', protect, getAlumniById);

module.exports = router;
