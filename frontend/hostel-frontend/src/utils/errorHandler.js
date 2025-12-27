import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(
      import.meta.env.VITE_JWT_STORAGE_KEY || 'auth'
    );
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { token: null, role: null, id: null, name: null };
      }
    }
    return { token: null, role: null, id: null, name: null };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============ LOGIN FUNCTION ============
  const login = async (email, password, userType = 'student') => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (userType === 'student') {
        response = await authService.loginStudent(email, password);
      } else if (userType === 'admin' || userType === 'warden') {
        response = await authService.loginAdmin(email, password);
      } else if (userType === 'worker') {
        response = await authService.loginWorker(email, password);
      }

      const authData = {
        token: response.token,
        role: response.role,
        id: response.id,
        name: response.name,
      };

      setAuth(authData);
      localStorage.setItem(
        import.meta.env.VITE_JWT_STORAGE_KEY || 'auth',
        JSON.stringify(authData)
      );

      return authData;
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============ LOGOUT FUNCTION ============
  const logout = () => {
    setAuth({ token: null, role: null, id: null, name: null });
    localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'auth');
    setError(null);
  };

  // ============ REGISTER FUNCTION ============
  const register = async (userData, userType = 'student') => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (userType === 'student') {
        response = await authService.registerStudent(userData);
      } else if (userType === 'worker') {
        response = await authService.registerWorker(userData);
      }

      // Auto-login after registration
      const authData = {
        token: response.token,
        role: response.role,
        id: response.id,
        name: response.name,
      };

      setAuth(authData);
      localStorage.setItem(
        import.meta.env.VITE_JWT_STORAGE_KEY || 'auth',
        JSON.stringify(authData)
      );

      return authData;
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============ UTILITY FUNCTIONS ============
  const isAuthenticated = () => !!auth.token;

  const hasRole = (roles) => {
    if (typeof roles === 'string') {
      return auth.role === roles;
    }
    return roles.includes(auth.role);
  };

  const clearError = () => setError(null);

  // Auto-logout on token expiry check
  useEffect(() => {
    if (auth.token) {
      try {
        const payload = JSON.parse(
          atob(auth.token.split('.')[1])
        );
        const expiresIn = payload.exp * 1000 - Date.now();

        if (expiresIn <= 0) {
          logout();
          return;
        }

        // Set timeout to logout before token actually expires
        const timeoutId = setTimeout(() => {
          logout();
        }, expiresIn - 60000); // Logout 1 min before expiry

        return () => clearTimeout(timeoutId);
      } catch (err) {
        console.error('Error parsing token:', err);
        logout();
      }
    }
  }, [auth.token]);

  const value = {
    auth,
    login,
    logout,
    register,
    isAuthenticated,
    hasRole,
    isLoading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
