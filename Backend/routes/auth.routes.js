const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student.model');
const Admin = require('../models/admin.model');
const Worker = require('../models/worker.model');

const router = express.Router();

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Student login
router.post('/login/student', async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(student._id, 'STUDENT');
    res.json({ token, role: 'STUDENT', id: student._id, name: student.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin/Warden login
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(admin._id, admin.role); // ADMIN or WARDEN
    res.json({ token, role: admin.role, id: admin._id, name: admin.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Worker login
router.post('/login/worker', async (req, res) => {
  const { phone, password } = req.body; // you can also use email later
  try {
    const worker = await Worker.findOne({ phone });
    if (!worker) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, worker.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(worker._id, 'WORKER');
    res.json({ token, role: 'WORKER', id: worker._id, name: worker.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
