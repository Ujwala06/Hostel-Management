import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const RegisterPage = () => {
  const [roleType, setRoleType] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (roleType !== 'student') {
      setError('Registration for this role is handled by the hostel administration.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name,
        email,
        phone,
        roomNo: roomNo ? Number(roomNo) : undefined,
        emergencyContact,
        password,
      };

      const res = await axios.post('/api/auth/register/student', payload);
      const { token, role, id, name: displayName } = res.data;

      login({ token, role, id, name: displayName });
      navigate('/student');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page page--center">
        <div className="card card--auth">
          <h1>Register for Hostel Access</h1>
          <p className="text-muted">Create your student account to access the hostel portal.</p>

          <div className="role-switch">
            <button
              type="button"
              className={
                roleType === 'student'
                  ? 'role-switch__btn role-switch__btn--active'
                  : 'role-switch__btn'
              }
              onClick={() => setRoleType('student')}
            >
              Student
            </button>
            <button
              type="button"
              className="role-switch__btn"
              onClick={() => setRoleType('admin')}
            >
              Admin / Warden
            </button>
            <button
              type="button"
              className="role-switch__btn"
              onClick={() => setRoleType('worker')}
            >
              Worker
            </button>
          </div>

          {roleType !== 'student' && (
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Registration for Admin / Warden and Worker roles is managed by the hostel
              administration. Please contact the warden or admin to create these accounts.
            </p>
          )}

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="form__group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="roomNo">Room Number (optional)</label>
              <input
                id="roomNo"
                type="number"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                min={1}
              />
            </div>

            <div className="form__group">
              <label htmlFor="emergencyContact">Emergency Contact</label>
              <input
                id="emergencyContact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={submitting}
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default RegisterPage;
