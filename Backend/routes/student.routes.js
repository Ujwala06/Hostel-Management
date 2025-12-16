const express = require('express');
const Student = require('../models/student.model');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/students/:id – Get student profile
router.get('/:id', auth(['STUDENT', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {

    if (req.user.role === 'STUDENT' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const student = await Student.findById(req.params.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/students/:id – Update student profile
router.patch('/:id', auth(['STUDENT', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {

    if (req.user.role === 'STUDENT' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { phone, emergencyContact } = req.body;
    const updates = {};
    if (phone) updates.phone = phone;
    if (emergencyContact) updates.emergencyContact = emergencyContact;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-passwordHash');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/students – Create new student (Admin only)
router.post('/', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { name, email, phone, roomNo, password, emergencyContact } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      phone,
      roomNo,
      passwordHash,
      emergencyContact,
    });

    res.status(201).json({
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      roomNo: student.roomNo,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/students – List all students (Admin/Warden only)
router.get('/', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const students = await Student.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
