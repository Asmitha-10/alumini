const dotenv = require('dotenv');
const { connectDB, stopInMemoryDB } = require('./config/db');
const app = require('./app');
const User = require('./models/User');

dotenv.config();

const PORT = process.env.PORT || 5000;

const bootstrapAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    await User.create({
      name: 'Portal Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });
    console.log('Default admin account created from environment variables');
  }
};

const start = async () => {
  await connectDB();
  await bootstrapAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const shutdown = async () => {
  await stopInMemoryDB();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
