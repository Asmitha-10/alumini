const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const createMentorshipRequest = asyncHandler(async (req, res) => {
  const { alumniId, message } = req.body;

  if (!alumniId || !message) {
    res.status(400);
    throw new Error('alumniId and message are required');
  }

  const alumni = await User.findOne({ _id: alumniId, role: 'alumni' });
  if (!alumni) {
    res.status(404);
    throw new Error('Target alumni not found');
  }

  const existingPending = await MentorshipRequest.findOne({
    student: req.user._id,
    alumni: alumniId,
    status: 'pending',
  });

  if (existingPending) {
    res.status(400);
    throw new Error('You already have a pending request with this alumni');
  }

  const request = await MentorshipRequest.create({
    student: req.user._id,
    alumni: alumniId,
    message,
  });

  res.status(201).json({ success: true, request });
});

const getMyMentorshipRequests = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'student' ? { student: req.user._id } : { alumni: req.user._id };

  const requests = await MentorshipRequest.find(filter)
    .populate('student', 'name email branch graduationYear')
    .populate('alumni', 'name email company currentRole branch graduationYear')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: requests.length, requests });
});

const respondMentorshipRequest = asyncHandler(async (req, res) => {
  const { status, responseMessage } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be accepted or rejected');
  }

  const request = await MentorshipRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.alumni.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the target alumni can respond to this request');
  }

  request.status = status;
  request.responseMessage = responseMessage || '';
  await request.save();

  res.status(200).json({ success: true, request });
});

module.exports = {
  createMentorshipRequest,
  getMyMentorshipRequests,
  respondMentorshipRequest,
};
