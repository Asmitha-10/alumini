const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const app = require('./app');
const { connectDB } = require('./config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

let dbConnectPromise = null;

const ensureDbConnection = async () => {
  if (!dbConnectPromise) {
    dbConnectPromise = connectDB();
  }

  return dbConnectPromise;
};

const serverlessApp = express();

serverlessApp.use(async (req, res, next) => {
  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    next(error);
  }
});

serverlessApp.use(app);

module.exports = serverlessApp;
