import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [roleType, setRoleType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        roleType === 'student'
          ? '/api/auth/login/student'
          : roleType === 'admin'
          ? '/api/auth/login/admin'
          : '/api/auth/login/worker';

      const res = await axios.post(url, { email, password });
      const { token, role, id } = res.data;
      login({ token, role, id });

      if (role === 'ADMIN' || role === 'WARDEN') navigate('/admin');
      else if (role === 'STUDENT') navigate('/student');
      else navigate('/'); // worker dashboard later
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select value={roleType} onChange={(e) => setRoleType(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="student">Student</option>
            <option value="admin">Admin/Warden</option>
            <option value="worker">Worker</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
