import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============== REQUEST INTERCEPTOR ===============
apiClient.interceptors.request.use(
  (config) => {
    // Add token to every request
    const authData = localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'auth');
    
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error parsing auth data:', err);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============== RESPONSE INTERCEPTOR ===============
apiClient.interceptors.response.use(
  (response) => {
    // Success response - return data directly
    return response.data;
  },
  (error) => {
    // Handle different error types
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'auth');
      window.location.href = '/login';
      return Promise.reject({
        status: 401,
        message: 'Session expired. Please login again.',
      });
    }
    
    if (error.response?.status === 403) {
      return Promise.reject({
        status: 403,
        message: error.response.data?.message || 'Access denied',
      });
    }
    
    if (error.response?.status === 404) {
      return Promise.reject({
        status: 404,
        message: error.response.data?.message || 'Resource not found',
      });
    }
    
    if (error.response?.status === 400) {
      return Promise.reject({
        status: 400,
        message: error.response.data?.message || 'Invalid request',
        errors: error.response.data?.errors,
      });
    }
    
    if (error.response?.status >= 500) {
      return Promise.reject({
        status: error.response.status,
        message: 'Server error. Please try again later.',
      });
    }
    
    // Network error or other issues
    return Promise.reject({
      status: error.response?.status || 'NETWORK_ERROR',
      message: error.message || 'Network error. Please check your connection.',
    });
  }
);

export default apiClient;
