const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, branch, graduationYear, company, currentRole, bio, skills } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  if (role && !['student', 'alumni'].includes(role)) {
    res.status(400);
    throw new Error('Role must be student or alumni');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already in use');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    branch,
    graduationYear,
    company,
    currentRole,
    bio,
    skills: Array.isArray(skills) ? skills : [],
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      graduationYear: user.graduationYear,
      company: user.company,
      currentRole: user.currentRole,
      bio: user.bio,
      skills: user.skills,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      graduationYear: user.graduationYear,
      company: user.company,
      currentRole: user.currentRole,
      bio: user.bio,
      skills: user.skills,
      isActive: user.isActive,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = { register, login, getMe };
