const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    }, // FK → students.student_id
    category: { type: String, required: true }, // Cleaning, Electrical, etc.
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'InProgress', 'Completed', 'Escalated'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      default: null, // nullable
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null, // nullable
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports =mongoose.models.Complaint ||  mongoose.model('Complaint', complaintSchema);
