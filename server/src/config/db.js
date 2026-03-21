const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const allowFallback =
      process.env.NODE_ENV !== 'production' && process.env.ENABLE_IN_MEMORY_DB !== 'false';

    if (!allowFallback) {
      console.error(`MongoDB connection error: ${error.message}`);
      process.exit(1);
    }

    console.warn(
      `MongoDB unavailable (${error.message}). Falling back to in-memory MongoDB for development.`
    );

    memoryServer = await MongoMemoryServer.create({
      binary: {
        version: process.env.MEMORY_MONGO_VERSION || '7.0.14',
      },
    });

    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`In-memory MongoDB connected: ${conn.connection.host}`);
    return conn;
  }
};

const stopInMemoryDB = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = { connectDB, stopInMemoryDB };
