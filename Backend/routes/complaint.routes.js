const express = require('express');
const Complaint = require('../models/complaint.model');
const ComplaintHistory = require('../models/complainHIstory.model');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/complaints – student creates complaint
router.post('/', auth(['STUDENT']), async (req, res) => {
  try {
    const { category, description, priority } = req.body;
    const complaint = await Complaint.create({
      student: req.user.id,
      category,
      description,
      priority: priority || 'Medium',
    });

    await ComplaintHistory.create({
      complaint: complaint._id,
      oldStatus: 'Pending',
      newStatus: 'Pending',
      changedBy: req.user.id,
      changedByType: 'Student',
      notes: 'Complaint created',
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/complaints/student/:student_id
router.get('/student/:studentId', auth(['STUDENT', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const complaints = await Complaint.find({ student: studentId }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/complaints?status=&category=
router.get('/', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/complaints/:id/assign
router.patch('/:id/assign', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { workerId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedWorker: workerId, assignedBy: req.user.id, status: 'Assigned' },
      { new: true }
    );

    await ComplaintHistory.create({
      complaint: complaint._id,
      oldStatus: 'Pending',
      newStatus: 'Assigned',
      changedBy: req.user.id,
      changedByType: req.user.role === 'ADMIN' ? 'Admin' : 'Warden',
      notes: 'Worker assigned',
    });

    res.json(complaint);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/complaints/:id/status
router.patch('/:id/status', auth(['ADMIN', 'WARDEN', 'WORKER']), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });

    const oldStatus = complaint.status;
    complaint.status = status;
    if (status === 'Completed') {
      complaint.completedAt = new Date();
    }
    await complaint.save();

    await ComplaintHistory.create({
      complaint: complaint._id,
      oldStatus,
      newStatus: status,
      changedBy: req.user.id,
      changedByType: req.user.role,
      notes: notes || '',
    });

    res.json(complaint);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/complaints/:id/escalate
router.patch('/:id/escalate', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });

    const oldStatus = complaint.status;
    complaint.status = 'Escalated';
    await complaint.save();

    await ComplaintHistory.create({
      complaint: complaint._id,
      oldStatus,
      newStatus: 'Escalated',
      changedBy: req.user.id,
      changedByType: req.user.role,
      notes: 'Manually escalated',
    });

    res.json(complaint);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
