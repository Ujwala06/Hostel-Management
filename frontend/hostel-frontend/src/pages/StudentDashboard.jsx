import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const StudentDashboard = () => {
  const { auth, logout } = useAuth();
  const [profile, setProfile] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
    fetchComplaints();
    fetchEmergencies();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/students/${auth.id}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`/api/complaints/student/${auth.id}`);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmergencies = async () => {
    try {
      const res = await axios.get(`/api/emergencies/student/${auth.id}`);
      setEmergencies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications/${auth.id}?type=STUDENT`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const raiseComplaint = async (category, description) => {
    try {
      await axios.post('/api/complaints', { category, description });
      fetchComplaints();
    } catch (err) {
      alert('Failed to raise complaint');
    }
  };

  const raiseEmergency = async (description) => {
    try {
      await axios.post('/api/emergencies', { description });
      fetchEmergencies();
    } catch (err) {
      alert('Failed to raise emergency');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setActiveTab('profile')}>Profile</button>
        <button onClick={() => setActiveTab('complaints')}>Complaints</button>
        <button onClick={() => setActiveTab('emergencies')}>Emergencies</button>
        <button onClick={() => setActiveTab('notifications')}>Notifications</button>
      </div>
      {activeTab === 'profile' && (
        <div>
          <h2>Profile</h2>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone}</p>
          <p>Room: {profile.room_no}</p>
          <p>Emergency Contact: {profile.emergency_contact}</p>
        </div>
      )}
      {activeTab === 'complaints' && (
        <div>
          <h2>Complaints</h2>
          <button onClick={() => raiseComplaint('Cleaning', 'Room needs cleaning')}>Raise Cleaning Complaint</button>
          {/* Add more buttons or form */}
          <ul>
            {complaints.map(c => (
              <li key={c.complaint_id}>{c.category}: {c.description} - {c.status}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'emergencies' && (
        <div>
          <h2>Emergencies</h2>
          <button onClick={() => raiseEmergency('Medical emergency')}>Raise Emergency</button>
          <ul>
            {emergencies.map(e => (
              <li key={e.emergency_id}>{e.description} - {e.status}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'notifications' && (
        <div>
          <h2>Notifications</h2>
          <ul>
            {notifications.map(n => (
              <li key={n.notification_id}>{n.message} - {n.is_read ? 'Read' : 'Unread'}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;