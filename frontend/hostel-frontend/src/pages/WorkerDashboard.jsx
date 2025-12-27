import { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const WorkerDashboard = () => {
  const { auth } = useAuth();
  const [worker, setWorker] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attSubmitting, setAttSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!auth?.id) return;
      setLoading(true);
      setError('');

      try {
        const [workerRes, tasksRes, attendanceRes] = await Promise.all([
          axios.get(`/api/workers/${auth.id}`),
          axios.get(`/api/workers/${auth.id}/tasks`),
          axios.get(`/api/workers/${auth.id}/attendance`, { params: { limit: 14 } }),
        ]);

        setWorker(workerRes.data);
        setTasks(tasksRes.data);
        setAttendanceHistory(attendanceRes.data);
        setAttendanceToday(attendanceRes.data[0] || null);
      } catch (err) {
        setError('Failed to load worker data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth?.id]);

  const handleStatusUpdate = async (taskId, newStatus) => {
  if (!auth?.id) return;
  try {
    const res = await axios.patch(`/api/workers/${auth.id}/tasks/${taskId}`, {
      status: newStatus,
    });
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  } catch (err) {
    setError('Failed to update task status.');
  }
};


  const handleAttendance = async (type) => {
    if (!auth?.id) return;
    setAttSubmitting(true);
    setError('');

    try {
      const res = await axios.post(`/api/workers/${auth.id}/attendance`, { type });
      setAttendanceToday(res.data);
      setAttendanceHistory((prev) => {
        const others = prev.filter((r) => r._id !== res.data._id);
        return [res.data, ...others];
      });
    } catch (err) {
      setError('Failed to update attendance.');
    } finally {
      setAttSubmitting(false);
    }
  };

  const lastAttendanceInfo = attendanceToday
    ? `Clock-in: ${
        attendanceToday.clockIn ? new Date(attendanceToday.clockIn).toLocaleTimeString() : '—'
      } | Clock-out: ${
        attendanceToday.clockOut ? new Date(attendanceToday.clockOut).toLocaleTimeString() : '—'
      }`
    : 'No attendance recorded for today yet.';

  return (
    <div>
      <TopBar />
      <main className="page">
        <h1>Worker Dashboard</h1>
        {error && <div className="alert alert--error">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid--two-cols">
            <section className="card">
              <h2>Your Info & Attendance</h2>
              {worker ? (
                <ul className="list">
                  <li>
                    <strong>Name:</strong> {worker.name}
                  </li>
                  <li>
                    <strong>Role:</strong> {worker.role}
                  </li>
                  <li>
                    <strong>Phone:</strong> {worker.phone}
                  </li>
                  <li>
                    <strong>Duty:</strong> {worker.dutyStartTime} - {worker.dutyEndTime}
                  </li>
                </ul>
              ) : (
                <p>No worker info found.</p>
              )}

              <h3>Today&apos;s Attendance</h3>
              <p>{lastAttendanceInfo}</p>
              <div className="actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => handleAttendance('clockIn')}
                  disabled={attSubmitting}
                >
                  Clock In
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => handleAttendance('clockOut')}
                  disabled={attSubmitting}
                >
                  Clock Out
                </button>
              </div>

              <h3>Recent Attendance</h3>
              {attendanceHistory.length === 0 ? (
                <p>No recent records.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceHistory.map((record) => (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
                            {record.clockIn
                              ? new Date(record.clockIn).toLocaleTimeString()
                              : '—'}
                          </td>
                          <td>
                            {record.clockOut
                              ? new Date(record.clockOut).toLocaleTimeString()
                              : '—'}
                          </td>
                          <td>{record.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="card">
              <h2>Assigned Tasks ({tasks.length})</h2>
              <ul className="list list--spaced">
                {tasks.length === 0 && <li>No tasks assigned yet.</li>}
                {tasks.map((task) => (
                  <li key={task._id} className="list__item">
                    <div className="list__item-header">
                      <span className="badge">{task.category}</span>
                      <span className="badge badge--muted">{task.status}</span>
                      <span className="badge badge--priority">{task.priority}</span>
                    </div>
                    <p>{task.description}</p>
                    <small>
                      Student: {task.student?.name || 'Unknown'} (Room {task.student?.roomNo || 'N/A'}, Phone{' '}
                      {task.student?.phone || 'N/A'})
                    </small>
                    <br />
                    <small>
                      Created at:{' '}
                      {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
                    </small>
                    <div className="actions">
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleStatusUpdate(task._id, 'InProgress')}
                      >
                        Mark In Progress
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => handleStatusUpdate(task._id, 'Completed')}
                      >
                        Mark Completed
                      </button>
                    </div>
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

export default WorkerDashboard;
