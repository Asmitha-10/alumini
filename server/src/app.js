const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const studentRoutes = require('./routes/studentRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const clientBuildPath = path.join(__dirname, '../../client/build');
const hasClientBuild = fs.existsSync(path.join(clientBuildPath, 'index.html'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

if (hasClientBuild) {
  app.use(express.static(clientBuildPath));
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Alumni-Student Portal API is running' });
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/mentorships', mentorshipRoutes);
app.use('/api/admin', adminRoutes);

if (hasClientBuild) {
  // Return the React app for all non-API routes (supports client-side routing).
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
  app.use('/api', notFound);
} else {
  app.use(notFound);
}

app.use(errorHandler);

module.exports = app;
