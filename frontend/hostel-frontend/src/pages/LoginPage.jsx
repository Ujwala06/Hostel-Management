import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [roleType, setRoleType] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url =
        roleType === 'student'
          ? '/api/auth/login/student'
          : roleType === 'admin'
          ? '/api/auth/login/admin'
          : '/api/auth/login/worker';

      const payload =
        roleType === 'worker'
          ? { phone: identifier, password }
          : { email: identifier, password };

      const res = await axios.post(url, payload);
      const { token, role, id, name } = res.data;

      login({ token, role, id, name });

      if (role === 'ADMIN' || role === 'WARDEN') navigate('/admin');
      else if (role === 'STUDENT') navigate('/student');
      else if (role === 'WORKER') navigate('/worker');
      else navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const identifierLabel = roleType === 'worker' ? 'Phone' : 'Email';

  return (
    <div className="page page--center">
      <div className="card card--auth">
        <h1>Hostel Management Login</h1>
        <p className="text-muted">Sign in as student, admin/warden, or worker.</p>

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
            className={
              roleType === 'admin'
                ? 'role-switch__btn role-switch__btn--active'
                : 'role-switch__btn'
            }
            onClick={() => setRoleType('admin')}
          >
            Admin / Warden
          </button>
          <button
            type="button"
            className={
              roleType === 'worker'
                ? 'role-switch__btn role-switch__btn--active'
                : 'role-switch__btn'
            }
            onClick={() => setRoleType('worker')}
          >
            Worker
          </button>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form__group">
            <label htmlFor="identifier">{identifierLabel}</label>
            <input
              id="identifier"
              type={roleType === 'worker' ? 'tel' : 'email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
