const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    roomNo: {
      type: Number, // references rooms.room_no
      required: false,
    },
    passwordHash: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    emergencyContact: { type: String, required: true },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model('Student', studentSchema);
