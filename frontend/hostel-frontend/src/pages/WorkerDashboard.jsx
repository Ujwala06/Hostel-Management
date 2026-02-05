import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const WorkerDashboard = () => {
  const { auth, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchAttendance();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/workers/${auth.id}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`/api/workers/${auth.id}/attendance`);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (complaintId, status) => {
    try {
      await axios.patch(`/api/complaints/${complaintId}/status`, { status });
      fetchTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const clockIn = async () => {
    try {
      await axios.post(`/api/workers/${auth.id}/attendance`, { action: 'clock_in' });
      fetchAttendance();
    } catch (err) {
      alert('Failed to clock in');
    }
  };

  const clockOut = async () => {
    try {
      await axios.post(`/api/workers/${auth.id}/attendance`, { action: 'clock_out' });
      fetchAttendance();
    } catch (err) {
      alert('Failed to clock out');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Worker Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <div style={{ marginTop: '20px' }}>
        <h2>Attendance</h2>
        <button onClick={clockIn}>Clock In</button>
        <button onClick={clockOut}>Clock Out</button>
        <ul>
          {attendance.map(a => (
            <li key={a.attendance_id}>{a.date} - {a.status}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Assigned Tasks</h2>
        <ul>
          {tasks.map(t => (
            <li key={t.complaint_id}>
              {t.category}: {t.description} - {t.status}
              {t.status === 'Assigned' && (
                <button onClick={() => updateTaskStatus(t.complaint_id, 'InProgress')}>Start</button>
              )}
              {t.status === 'InProgress' && (
                <button onClick={() => updateTaskStatus(t.complaint_id, 'Completed')}>Complete</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkerDashboard;