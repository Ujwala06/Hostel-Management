const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }, // points to Student / Worker / Admin
        recipientType: {
            type: String,
            enum: ['Student', 'Worker', 'Admin', 'Warden'],
            required: true,
        },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        relatedComplaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint',
            default: null,
        },
        relatedEmergency: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Emergency',
            default: null,
        },
    },
    { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Notification', notificationSchema);