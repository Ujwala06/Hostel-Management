import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    fetchStudents();
    fetchWorkers();
    fetchRooms();
    fetchComplaints();
    fetchEmergencies();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('/api/workers');
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmergencies = async () => {
    try {
      const res = await axios.get('/api/emergencies');
      setEmergencies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const assignWorker = async (complaintId, workerId) => {
    try {
      await axios.patch(`/api/complaints/${complaintId}/assign`, { worker_id: workerId });
      fetchComplaints();
    } catch (err) {
      alert('Failed to assign worker');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin/Warden Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setActiveTab('students')}>Students</button>
        <button onClick={() => setActiveTab('workers')}>Workers</button>
        <button onClick={() => setActiveTab('rooms')}>Rooms</button>
        <button onClick={() => setActiveTab('complaints')}>Complaints</button>
        <button onClick={() => setActiveTab('emergencies')}>Emergencies</button>
      </div>
      {activeTab === 'students' && (
        <div>
          <h2>Students</h2>
          <ul>
            {students.map(s => (
              <li key={s.student_id}>{s.name} - Room {s.room_no}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'workers' && (
        <div>
          <h2>Workers</h2>
          <ul>
            {workers.map(w => (
              <li key={w.worker_id}>{w.name} - {w.role}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'rooms' && (
        <div>
          <h2>Rooms</h2>
          <ul>
            {rooms.map(r => (
              <li key={r.room_no}>Room {r.room_no} - Floor {r.floor} - Occupancy {r.current_occupancy}/{r.capacity}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'complaints' && (
        <div>
          <h2>Complaints</h2>
          <ul>
            {complaints.map(c => (
              <li key={c.complaint_id}>
                {c.category}: {c.description} - {c.status}
                {c.status === 'Pending' && (
                  <select onChange={(e) => assignWorker(c.complaint_id, e.target.value)}>
                    <option>Select Worker</option>
                    {workers.map(w => <option key={w.worker_id} value={w.worker_id}>{w.name}</option>)}
                  </select>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'emergencies' && (
        <div>
          <h2>Emergencies</h2>
          <ul>
            {emergencies.map(e => (
              <li key={e.emergency_id}>{e.description} - {e.status}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;