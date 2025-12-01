const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            required: true,
        },
        date: { type: Date, required: true },
        clockIn: { type: Date, default: null },
        clockOut: { type: Date, default: null },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            default: 'Present',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);