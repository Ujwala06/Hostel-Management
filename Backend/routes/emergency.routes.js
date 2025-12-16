const express = require('express');
const Emergency = require('../models/emergency.model');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /api/emergencies
 * Raise emergency (Student)
 * Body: { description, roomNo }
 */
router.post('/', auth(['STUDENT']), async (req, res) => {
  try {
    const { description, roomNo } = req.body;

    if (!description || !roomNo) {
      return res.status(400).json({ message: 'description and roomNo are required' });
    }

    const emergency = await Emergency.create({
      student: req.user.id,        // from JWT
      description,
      roomNo,
      status: 'Reported',
      reportedAt: new Date(),
    });

    return res.status(201).json(emergency);
  } catch (err) {
    console.error('Create emergency error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/emergencies?status=Reported
 * View emergencies (Admin/Warden) filtered by status
 */
router.get('/', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status; // Reported / Responded / Resolved
    }

    const emergencies = await Emergency.find(filter)
      .sort({ reportedAt: -1 })
      .populate('student', 'name roomNo');

    return res.json(emergencies);
  } catch (err) {
    console.error('Get emergencies error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PATCH /api/emergencies/:id/status
 * Update emergency status (Admin/Warden)
 * Body: { status }  // 'Responded' or 'Resolved'
 */
router.patch('/:id/status', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Responded', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const emergency = await Emergency.findById(id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    emergency.status = status;

    if (status === 'Responded') {
      emergency.respondedAt = new Date();
      emergency.respondedBy = req.user.id; // admin/warden ID
    }

    if (status === 'Resolved') {
      // if first time resolving, set both responded/resolved if needed
      if (!emergency.respondedAt) {
        emergency.respondedAt = new Date();
      }
      emergency.resolvedAt = new Date();
      emergency.respondedBy = emergency.respondedBy || req.user.id;
    }

    await emergency.save();

    return res.json(emergency);
  } catch (err) {
    console.error('Update emergency status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
