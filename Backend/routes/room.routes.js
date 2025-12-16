const express = require('express');
const Room = require('../models/room.model');
const Student = require('../models/student.model');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/rooms – List all rooms
router.get('/', auth(['ADMIN', 'WARDEN', 'STUDENT']), async (req, res) => {
  try {
    const { floor, available } = req.query;
    const filter = {};
    if (floor) filter.floor = parseInt(floor);
    if (available === 'true') {
      filter.$expr = { $lt: ['$currentOccupancy', '$capacity'] };
    }

    const rooms = await Room.find(filter).sort({ roomNo: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/rooms/:roomNo – Get room details
router.get('/:roomNo', auth(['ADMIN', 'WARDEN', 'STUDENT']), async (req, res) => {
  try {
    const room = await Room.findOne({ roomNo: parseInt(req.params.roomNo) });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Get students in this room
    const students = await Student.find({ roomNo: parseInt(req.params.roomNo) })
      .select('-passwordHash');
    
    res.json({ ...room.toObject(), students });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/rooms – Create new room (Admin only)
router.post('/', auth(['ADMIN']), async (req, res) => {
  try {
    const { roomNo, floor, capacity, roomType } = req.body;

    const existingRoom = await Room.findOne({ roomNo });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await Room.create({
      roomNo,
      floor,
      capacity,
      roomType,
      currentOccupancy: 0,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/rooms/:roomNo – Update room details
router.patch('/:roomNo', auth(['ADMIN', 'WARDEN']), async (req, res) => {
  try {
    const { floor, capacity, roomType } = req.body;
    const updates = {};
    if (floor !== undefined) updates.floor = floor;
    if (capacity !== undefined) updates.capacity = capacity;
    if (roomType) updates.roomType = roomType;

    const room = await Room.findOneAndUpdate(
      { roomNo: parseInt(req.params.roomNo) },
      updates,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/rooms/:roomNo – Delete room
router.delete('/:roomNo', auth(['ADMIN']), async (req, res) => {
  try {
    const roomNo = parseInt(req.params.roomNo);
    
    // Check if any students are assigned to this room
    const studentsInRoom = await Student.countDocuments({ roomNo });
    if (studentsInRoom > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete room with assigned students' 
      });
    }

    const room = await Room.findOneAndDelete({ roomNo });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
