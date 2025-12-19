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
    <form onSubmit={handleSubmit}>
      {/* simple fields here */}
    </form>
  );
};

export default LoginPage;
