const express = require('express');
const {
  getUsers,
  updateUserStatus,
  reviewExperience,
  getAdminDashboard,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/experiences/:id/review', reviewExperience);

module.exports = router;
