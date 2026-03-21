const User = require('../models/User');
const Experience = require('../models/Experience');
const MentorshipRequest = require('../models/MentorshipRequest');
const asyncHandler = require('../utils/asyncHandler');

const getAlumni = asyncHandler(async (req, res) => {
  const { company, role, branch, graduationYear, q } = req.query;

  const filter = { role: 'alumni', isActive: true };

  if (company) {
    filter.company = { $regex: company, $options: 'i' };
  }
  if (role) {
    filter.currentRole = { $regex: role, $options: 'i' };
  }
  if (branch) {
    filter.branch = { $regex: branch, $options: 'i' };
  }
  if (graduationYear) {
    filter.graduationYear = Number(graduationYear);
  }
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
      { currentRole: { $regex: q, $options: 'i' } },
    ];
  }

  const alumni = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: alumni.length, alumni });
});

const getAlumniById = asyncHandler(async (req, res) => {
  const alumni = await User.findOne({ _id: req.params.id, role: 'alumni' }).select('-password');
  if (!alumni) {
    res.status(404);
    throw new Error('Alumni not found');
  }

  const experiences = await Experience.find({ alumni: alumni._id, status: 'approved' }).sort({ createdAt: -1 });
  const mentorshipStats = await MentorshipRequest.aggregate([
    { $match: { alumni: alumni._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({ success: true, alumni, experiences, mentorshipStats });
});

const getAlumniDashboard = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({ alumni: req.user._id }).sort({ createdAt: -1 });
  const requests = await MentorshipRequest.find({ alumni: req.user._id })
    .populate('student', 'name email branch graduationYear')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    summary: {
      totalExperiences: experiences.length,
      approvedExperiences: experiences.filter((item) => item.status === 'approved').length,
      pendingRequests: requests.filter((item) => item.status === 'pending').length,
    },
    experiences,
    mentorshipRequests: requests,
  });
});

module.exports = { getAlumni, getAlumniById, getAlumniDashboard };
