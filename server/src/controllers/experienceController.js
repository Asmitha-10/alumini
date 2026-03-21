const Experience = require('../models/Experience');
const asyncHandler = require('../utils/asyncHandler');

const createExperience = asyncHandler(async (req, res) => {
  const { company, role, branch, graduationYear, examType, interviewExperience, preparationTips } = req.body;

  if (!company || !role || !interviewExperience || !preparationTips) {
    res.status(400);
    throw new Error('Company, role, interview experience and preparation tips are required');
  }

  const experience = await Experience.create({
    alumni: req.user._id,
    company,
    role,
    branch,
    graduationYear,
    examType,
    interviewExperience,
    preparationTips,
  });

  res.status(201).json({ success: true, message: 'Experience submitted for admin review', experience });
});

const getExperiences = asyncHandler(async (req, res) => {
  const { company, role, branch, graduationYear, examType, status } = req.query;
  const filter = {};

  if (req.user.role !== 'admin') {
    filter.status = 'approved';
  } else if (status) {
    filter.status = status;
  }

  if (company) {
    filter.company = { $regex: company, $options: 'i' };
  }
  if (role) {
    filter.role = { $regex: role, $options: 'i' };
  }
  if (branch) {
    filter.branch = { $regex: branch, $options: 'i' };
  }
  if (graduationYear) {
    filter.graduationYear = Number(graduationYear);
  }
  if (examType) {
    filter.examType = { $regex: examType, $options: 'i' };
  }

  const experiences = await Experience.find(filter)
    .populate('alumni', 'name company currentRole branch graduationYear')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: experiences.length, experiences });
});

const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id).populate(
    'alumni',
    'name email company currentRole branch graduationYear bio skills'
  );

  if (!experience) {
    res.status(404);
    throw new Error('Experience not found');
  }

  if (req.user.role !== 'admin' && experience.status !== 'approved') {
    res.status(403);
    throw new Error('You are not authorized to view this experience yet');
  }

  res.status(200).json({ success: true, experience });
});

module.exports = { createExperience, getExperiences, getExperienceById };
