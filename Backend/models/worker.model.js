const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true }, // Cleaner, Plumber, etc.
    phone: { type: String, required: true },
    dutyStartTime: { type: String, required: true }, // "08:00"
    dutyEndTime: { type: String, required: true },   // "16:00"
    active: { type: Boolean, default: true },
     passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Worker', workerSchema);
