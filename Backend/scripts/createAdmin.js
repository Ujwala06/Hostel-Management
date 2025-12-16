require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin.model');

const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const password = 'Admin@123'; // login password you will use
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      phone: '9999999999',
      role: 'ADMIN',
      passwordHash,
    });

    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
