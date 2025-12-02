const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/student.model');
const Worker = require('./models/worker.model');
const Admin = require('./models/admin.model');
const Room = require('./models/room.model');
const Complaint = require('./models/complaint.model');
const Emergency = require('./models/emergency.model');
const Notification = require('./models/notification.model');
const Attendance = require('./models/attendance.model');
const ComplaintHistory = require('./models/complaintHistory.model');

// ... existing requires
const authRoutes = require('./routes/auth.routes');
const complaintRoutes = require('./routes/complaint.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const studentRoutes = require('./routes/student.routes');
const workerRoutes = require('./routes/worker.routes');
const roomRoutes = require('./routes/room.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hostel backend running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/notifications', notificationRoutes);

// Connect to DB
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });
