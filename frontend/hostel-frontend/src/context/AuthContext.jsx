import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { token: null, role: null, id: null };
  });

  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const login = (data) => setAuth(data);   // { token, role, id }
  const logout = () => setAuth({ token: null, role: null, id: null });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
