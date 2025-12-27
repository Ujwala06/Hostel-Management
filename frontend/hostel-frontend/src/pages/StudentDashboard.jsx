import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import TopBar from '../components/TopBar.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const StudentDashboard = () => {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [complaintForm, setComplaintForm] = useState({
    category: 'General',
    description: '',
    priority: 'Medium',
  });
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);

  const [emergencyForm, setEmergencyForm] = useState({
    roomNo: '',
    description: '',
  });
  const [emergencySubmitting, setEmergencySubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!auth?.id) return;
      setLoading(true);
      setError('');

      try {
        const [profileRes, complaintsRes] = await Promise.all([
          axios.get(`/api/students/${auth.id}`),
          axios.get(`/api/complaints/student/${auth.id}`),
        ]);

        setProfile(profileRes.data);
        setComplaints(complaintsRes.data);
      } catch (err) {
        setError('Failed to load your data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth?.id]);

  const handleError = (error) => {
  if (error.response?.status === 400) {
    setError(error.response.data.message || 'Invalid request');
  } else if (error.response?.status === 403) {
    setError('You do not have permission for this action');
  } else if (error.response?.status === 404) {
    setError('Resource not found');
  } else if (error.response?.status === 500) {
    setError('Server error - please try again later');
  } else {
    setError(error.message || 'Network error');
  }
};


  const handleComplaintChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setComplaintSubmitting(true);
    setError('');

    try {
      const res = await axios.post('/api/complaints', complaintForm);
      setComplaints((prev) => [res.data, ...prev]);
      setComplaintForm({ category: 'General', description: '', priority: 'Medium' });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit complaint.';
      setError(message);
      // eslint-disable-next-line no-console
      console.error('Submit complaint error:', err);
    } finally {
      setComplaintSubmitting(false);
    }
  };

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;
    setEmergencyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    setEmergencySubmitting(true);
    setError('');

    try {
      await axios.post('/api/emergencies', emergencyForm);
      setEmergencyForm({ roomNo: '', description: '' });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to raise emergency.';
      setError(message);
      // eslint-disable-next-line no-console
      console.error('Raise emergency error:', err);
    } finally {
      setEmergencySubmitting(false);
    }
  };

  return (
    <div>
      <TopBar />
      <main className="page">
        <h1>Student Dashboard</h1>
        {error && <div className="alert alert--error">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid--two-cols">
            <section className="card">
              <h2>Your Profile</h2>
              {profile ? (
                <ul className="list">
                  <li>
                    <strong>Name:</strong> {profile.name}
                  </li>
                  <li>
                    <strong>Email:</strong> {profile.email}
                  </li>
                  <li>
                    <strong>Phone:</strong> {profile.phone}
                  </li>
                  <li>
                    <strong>Room:</strong> {profile.roomNo}
                  </li>
                </ul>
              ) : (
                <p>No profile data.</p>
              )}

              <h3>Raise Emergency</h3>
              <form onSubmit={handleEmergencySubmit} className="form">
                <div className="form__group">
                  <label htmlFor="emergency-room">Room Number</label>
                  <input
                    id="emergency-room"
                    name="roomNo"
                    value={emergencyForm.roomNo}
                    onChange={handleEmergencyChange}
                    required
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="emergency-description">Description</label>
                  <textarea
                    id="emergency-description"
                    name="description"
                    value={emergencyForm.description}
                    onChange={handleEmergencyChange}
                    rows={3}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn--secondary btn--block"
                  disabled={emergencySubmitting}
                >
                  {emergencySubmitting ? 'Sending...' : 'Raise Emergency'}
                </button>
              </form>
            </section>

            <section className="card">
              <h2>Your Complaints</h2>

              <form onSubmit={handleComplaintSubmit} className="form form--inline">
                <div className="form__group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={complaintForm.category}
                    onChange={handleComplaintChange}
                  >
                    <option>Cleaning</option>
                    <option>Electrical</option>
                    <option>Water</option>
                    <option>Laundry</option>
                    <option>General</option>
                  </select>
                </div>

                <div className="form__group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={complaintForm.priority}
                    onChange={handleComplaintChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="form__group form__group--full">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={complaintForm.description}
                    onChange={handleComplaintChange}
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--block"
                  disabled={complaintSubmitting}
                >
                  {complaintSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>

              <ul className="list list--spaced">
                {complaints.length === 0 && <li>No complaints yet.</li>}
                {complaints.map((complaint) => (
                  <li key={complaint._id} className="list__item">
                    <div className="list__item-header">
                      <span className="badge">{complaint.category}</span>
                      <span className="badge badge--muted">{complaint.status}</span>
                      <span className="badge badge--priority">{complaint.priority}</span>
                    </div>
                    <p>{complaint.description}</p>
                    <small>
                      Created at:{' '}
                      {complaint.createdAt
                        ? new Date(complaint.createdAt).toLocaleString()
                        : 'N/A'}
                    </small>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default StudentDashboard;
