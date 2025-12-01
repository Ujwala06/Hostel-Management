const mongoose = require('mongoose');

const complaintHistorySchema = new mongoose.Schema(
    {
        complaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint',
            required: true,
        },
        oldStatus: {
            type: String,
            enum: ['Pending', 'Assigned', 'InProgress', 'Completed', 'Escalated'],
            required: true,
        },
        newStatus: {
            type: String,
            enum: ['Pending', 'Assigned', 'InProgress', 'Completed', 'Escalated'],
            required: true,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // user id (Admin/Warden/Worker)
        },
        changedByType: {
            type: String,
            enum: ['Admin', 'Warden', 'Worker'],
            required: true,
        },
        notes: { type: String, default: '' },
    },
    { timestamps: { createdAt: 'changedAt', updatedAt: true } }
);

module.exports = mongoose.model('ComplaintHistory', complaintHistorySchema);