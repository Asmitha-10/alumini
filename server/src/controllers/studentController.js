const User = require('../models/User');
const Experience = require('../models/Experience');
const MentorshipRequest = require('../models/MentorshipRequest');
const asyncHandler = require('../utils/asyncHandler');

const getStudentDashboard = asyncHandler(async (req, res) => {
  const [alumniCount, experiences, mentorshipRequests] = await Promise.all([
    User.countDocuments({ role: 'alumni', isActive: true }),
    Experience.find({ status: 'approved' })
      .populate('alumni', 'name company currentRole branch graduationYear')
      .sort({ createdAt: -1 })
      .limit(6),
    MentorshipRequest.find({ student: req.user._id })
      .populate('alumni', 'name email company currentRole branch graduationYear')
      .sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    success: true,
    summary: {
      alumniCount,
      totalRequests: mentorshipRequests.length,
      pendingRequests: mentorshipRequests.filter((item) => item.status === 'pending').length,
    },
    recentExperiences: experiences,
    mentorshipRequests,
  });
});

module.exports = { getStudentDashboard };
