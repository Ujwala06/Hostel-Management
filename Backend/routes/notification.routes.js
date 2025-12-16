const express = require('express');
const Notification = require('../models/notification.model');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/notifications/:recipientId – Get notifications for a user
router.get('/:recipientId', auth(['STUDENT', 'WORKER', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { type, isRead } = req.query;
    const filter = { recipientId: req.params.recipientId };
    
    if (type) filter.recipientType = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notifications – Create notification (System/Admin use)
router.post('/', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { recipientId, recipientType, message, relatedComplaint, relatedEmergency } = req.body;

    const notification = await Notification.create({
      recipientId,
      recipientType,
      message,
      relatedComplaint: relatedComplaint || null,
      relatedEmergency: relatedEmergency || null,
      isRead: false,
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/notifications/:id/read – Mark notification as read
router.patch('/:id/read', auth(['STUDENT', 'WORKER', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/notifications/:recipientId/read-all – Mark all as read
router.patch('/:recipientId/read-all', auth(['STUDENT', 'WORKER', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.params.recipientId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notifications/:recipientId/unread-count – Get count of unread notifications
router.get('/:recipientId/unread-count', auth(['STUDENT', 'WORKER', 'ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.params.recipientId,
      isRead: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
