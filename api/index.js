const dotenv = require('dotenv');
const path = require('path');

const app = require('../server/src/app');
const { connectDB } = require('../server/src/config/db');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

let dbConnectPromise = null;

const ensureDbConnection = async () => {
  if (!dbConnectPromise) {
    dbConnectPromise = connectDB();
  }

  return dbConnectPromise;
};

module.exports = async (req, res) => {
  try {
    await ensureDbConnection();
    return app(req, res);
  } catch (error) {
    console.error('API bootstrap error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server initialization failed',
    });
  }
};
