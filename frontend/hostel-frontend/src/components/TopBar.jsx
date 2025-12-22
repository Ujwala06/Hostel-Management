import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationsBell from './NotificationsBell.jsx';

const TopBar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar__brand">Hostel Management</div>
      <div className="topbar__right">
        <NotificationsBell userId={auth?.id} role={auth?.role} />
        {auth?.name && <span className="topbar__user">{auth.name}</span>}
        {auth?.role && <span className="topbar__role">{auth.role.toLowerCase()}</span>}
        <button type="button" className="btn btn--secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
