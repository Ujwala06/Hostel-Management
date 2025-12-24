import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [selectedWorkerTasks, setSelectedWorkerTasks] = useState([]);
  const [workerTasksLoading, setWorkerTasksLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const studentsRequest = axios.get('/api/students');
      const complaintsRequest = axios.get('/api/complaints', {
        params: {
          status: filterStatus || undefined,
          category: filterCategory || undefined,
        },
      });
      const workersRequest = axios.get('/api/workers');

      const [studentsRes, complaintsRes, workersRes] = await Promise.all([
        studentsRequest,
        complaintsRequest,
        workersRequest,
      ]);

      setStudents(studentsRes.data);
      setComplaints(complaintsRes.data);
      setWorkers(workersRes.data);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterCategory]);

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const res = await axios.patch(`/api/complaints/${complaintId}/status`, { status });
      setComplaints((prev) => prev.map((c) => (c._id === complaintId ? res.data : c)));
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Failed to update status');
    }
  };

  const handleEscalate = async (complaintId) => {
    try {
      const res = await axios.patch(`/api/complaints/${complaintId}/escalate`);
      setComplaints((prev) => prev.map((c) => (c._id === complaintId ? res.data : c)));
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Failed to escalate complaint');
    }
  };

  const handleSelectWorker = async (workerId) => {
    setSelectedWorkerId(workerId);
    setSelectedWorkerTasks([]);
    if (!workerId) return;
    setWorkerTasksLoading(true);
    try {
      const res = await axios.get(`/api/workers/${workerId}/tasks`);
      setSelectedWorkerTasks(res.data);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Failed to load worker tasks');
    } finally {
      setWorkerTasksLoading(false);
    }
  };

  return (
    <div>
      <TopBar />
      <main className="page">
        <h1>Admin / Warden Dashboard</h1>
        {error && <div className="alert alert--error">{error}</div>}

        <div className="actions" style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate('/admin/rooms')}
          >
            Manage Rooms
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid--two-cols">
            <section className="card">
              <h2>Students ({students.length})</h2>
              <ul className="list list--compact">
                {students.length === 0 && <li>No students found.</li>}
                {students.map((student) => (
                  <li key={student._id} className="list__item">
                    <strong>{student.name}</strong> – {student.email} (Room {student.roomNo})
                  </li>
                ))}
              </ul>

              <h3>Workers ({workers.length})</h3>
              <ul className="list list--compact">
                {workers.length === 0 && <li>No workers found.</li>}
                {workers.map((worker) => (
                  <li key={worker._id} className="list__item">
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleSelectWorker(worker._id)}
                    >
                      {worker.name} – {worker.role}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card">
              <div className="card__header">
                <h2>Complaints ({complaints.length})</h2>
                <div className="filters">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water">Water</option>
                    <option value="Laundry">Laundry</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <ul className="list list--spaced">
                {complaints.length === 0 && <li>No complaints found.</li>}
                {complaints.map((complaint) => (
                  <li key={complaint._id} className="list__item">
                    <div className="list__item-header">
                      <span className="badge">{complaint.category}</span>
                      <span className="badge badge--muted">{complaint.status}</span>
                      <span className="badge badge--priority">{complaint.priority}</span>
                    </div>
                    <p>{complaint.description}</p>
                    <small>
                      Student ID: {complaint.student?.toString?.() || complaint.student}
                      {' | '}Created:{' '}
                      {complaint.createdAt
                        ? new Date(complaint.createdAt).toLocaleString()
                        : 'N/A'}
                    </small>
                    <div className="actions">
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleStatusUpdate(complaint._id, 'InProgress')}
                      >
                        Mark In Progress
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleStatusUpdate(complaint._id, 'Completed')}
                      >
                        Mark Completed
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => handleEscalate(complaint._id)}
                      >
                        Escalate
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <h3>Selected Worker Tasks</h3>
              {!selectedWorkerId && <p>Select a worker from the left to view tasks.</p>}
              {selectedWorkerId && workerTasksLoading && <p>Loading tasks...</p>}
              {selectedWorkerId && !workerTasksLoading && (
                <ul className="list list--spaced">
                  {selectedWorkerTasks.length === 0 && <li>No tasks for this worker.</li>}
                  {selectedWorkerTasks.map((task) => (
                    <li key={task._id} className="list__item">
                      <div className="list__item-header">
                        <span className="badge">{task.category}</span>
                        <span className="badge badge--muted">{task.status}</span>
                        <span className="badge badge--priority">{task.priority}</span>
                      </div>
                      <p>{task.description}</p>
                      <small>
                        Student: {task.student?.name || 'Unknown'} (Room {task.student?.roomNo || 'N/A'})
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
