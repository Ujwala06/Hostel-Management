const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNo: { type: Number, required: true, unique: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    roomType: { type: String, required: true }, // Single, Double, etc.
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Room', roomSchema);
