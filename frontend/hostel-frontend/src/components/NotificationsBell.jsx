import { useEffect, useState } from 'react';
import axios from 'axios';

// Maps frontend role (stored in auth.role) to backend recipientType if needed.
// Adjust this mapping if your backend expects different casing/values.
const mapRoleToRecipientType = (role) => {
  if (!role) return undefined;
  const normalized = role.toUpperCase();
  switch (normalized) {
    case 'STUDENT':
      return 'Student';
    case 'WORKER':
      return 'Worker';
    case 'ADMIN':
      return 'Admin';
    case 'WARDEN':
      return 'Warden';
    default:
      return undefined;
  }
};

const NotificationsBell = ({ userId, role }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recipientType = mapRoleToRecipientType(role);

  const fetchUnreadCount = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/api/notifications/${userId}/unread-count`);
      setUnreadCount(res.data.count ?? 0);
    } catch (err) {
      // Silent failure for count; avoid noisy UI.
    }
  };

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/notifications/${userId}`, {
        params: recipientType ? { type: recipientType } : {},
      });
      setNotifications(res.data || []);
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOpen = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      await fetchNotifications();
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await axios.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? res.data : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Optional: show toast/alert.
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await axios.patch(`/api/notifications/${userId}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      // Optional: show toast/alert.
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="notifications">
      <button
        type="button"
        className="notifications__bell btn btn--icon"
        onClick={handleToggleOpen}
        aria-label="Notifications"
      >
        <span role="img" aria-hidden="true">
          🔔
        </span>
        {unreadCount > 0 && (
          <span className="notifications__badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notifications__dropdown card">
          <div className="notifications__header">
            <span>Notifications</span>
            {notifications.some((n) => !n.isRead) && (
              <button
                type="button"
                className="btn btn--link"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading && <p className="notifications__status">Loading...</p>}
          {error && <p className="notifications__error">{error}</p>}
          {!loading && !error && notifications.length === 0 && (
            <p className="notifications__status">No notifications.</p>
          )}

          {!loading && !error && notifications.length > 0 && (
            <ul className="notifications__list">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`notifications__item ${
                    n.isRead ? 'notifications__item--read' : 'notifications__item--unread'
                  }`}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                >
                  <div className="notifications__message">{n.message}</div>
                  <small className="notifications__meta">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
