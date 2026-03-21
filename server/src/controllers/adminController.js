const User = require('../models/User');
const Experience = require('../models/Experience');
const MentorshipRequest = require('../models/MentorshipRequest');
const asyncHandler = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: users.length, users });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Admin users cannot be deactivated');
  }

  user.isActive = Boolean(isActive);
  await user.save();

  res.status(200).json({ success: true, user });
});

const reviewExperience = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be approved or rejected');
  }

  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    res.status(404);
    throw new Error('Experience not found');
  }

  experience.status = status;
  experience.reviewedBy = req.user._id;
  experience.reviewedAt = new Date();
  await experience.save();

  res.status(200).json({ success: true, experience });
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [usersCount, studentsCount, alumniCount, pendingExperiences, pendingMentorships] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'alumni' }),
    Experience.countDocuments({ status: 'pending' }),
    MentorshipRequest.countDocuments({ status: 'pending' }),
  ]);

  res.status(200).json({
    success: true,
    summary: {
      usersCount,
      studentsCount,
      alumniCount,
      pendingExperiences,
      pendingMentorships,
    },
  });
});

module.exports = { getUsers, updateUserStatus, reviewExperience, getAdminDashboard };
