const express = require('express');
const Worker = require('../models/worker.model');
const Complaint = require('../models/complaint.model');
const Attendance = require('../models/attendance.model');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/workers – List all workers
router.get('/', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { role, active } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (active !== undefined) filter.active = active === 'true';

    const workers = await Worker.find(filter).select('-passwordHash').sort({ name: 1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workers/:id – Get worker details
router.get('/:id', auth(['ADMIN', 'WARDEN', 'WORKER']), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-passwordHash');
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workers – Add new worker (Admin only)
router.post('/', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { name, role, phone, dutyStartTime, dutyEndTime, password } = req.body;

    const existingWorker = await Worker.findOne({ phone });
    if (existingWorker) {
      return res.status(400).json({ message: 'Worker with this phone already exists' });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      name,
      role,
      phone,
      dutyStartTime,
      dutyEndTime,
      passwordHash,
      active: true,
    });

    res.status(201).json({
      id: worker._id,
      name: worker.name,
      role: worker.role,
      phone: worker.phone,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workers/:id/tasks – Get assigned tasks for a worker
router.get('/:id/tasks', auth(['WORKER', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedWorker: req.params.id })
      .populate('student', 'name roomNo phone')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workers/:id/attendance – Clock in/out
router.post('/:id/attendance', auth(['WORKER', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { type } = req.body; // 'clockIn' or 'clockOut'
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      worker: req.params.id,
      date: { $gte: today },
    });

    if (!attendance) {
      attendance = await Attendance.create({
        worker: req.params.id,
        date: new Date(),
      });
    }

    if (type === 'clockIn') {
      attendance.clockIn = new Date();
      attendance.status = 'Present';
    } else if (type === 'clockOut') {
      attendance.clockOut = new Date();
    }

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/workers/:id – Update worker details
router.patch('/:id', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { name, role, phone, dutyStartTime, dutyEndTime, active } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (phone) updates.phone = phone;
    if (dutyStartTime) updates.dutyStartTime = dutyStartTime;
    if (dutyEndTime) updates.dutyEndTime = dutyEndTime;
    if (active !== undefined) updates.active = active;

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-passwordHash');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
