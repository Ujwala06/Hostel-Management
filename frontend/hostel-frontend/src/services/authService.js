import apiClient from './apiClient';

export const authService = {
  // Student login
  loginStudent: (email, password) => 
    apiClient.post('/auth/login/student', { email, password }),

  // Admin/Warden login
  loginAdmin: (email, password) => 
    apiClient.post('/auth/login/admin', { email, password }),

  // Worker login
  loginWorker: (phone, password) => 
    apiClient.post('/auth/login/worker', { phone, password }),

  // Register new student
  registerStudent: (userData) =>
    apiClient.post('/auth/register/student', userData),

  // Register new worker
  registerWorker: (workerData) =>
    apiClient.post('/auth/register/worker', workerData),

  // Logout (if backend has this)
  logout: () =>
    apiClient.post('/auth/logout'),

  // Refresh token (if backend has this)
  refreshToken: () =>
    apiClient.post('/auth/refresh'),
};
