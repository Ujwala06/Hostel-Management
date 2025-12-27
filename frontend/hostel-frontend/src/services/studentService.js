import apiClient from './apiClient';

export const studentService = {
  // Get student profile
  getProfile: (studentId) =>
    apiClient.get(`/students/${studentId}`),

  // Update student profile
  updateProfile: (studentId, profileData) =>
    apiClient.patch(`/students/${studentId}`, profileData),

  // Get student room info
  getRoomInfo: (studentId) =>
    apiClient.get(`/students/${studentId}/room`),

  // Request room change
  requestRoomChange: (studentId, preferredRoomId) =>
    apiClient.post(`/students/${studentId}/room-request`, { 
      preferredRoom: preferredRoomId 
    }),

  // Get all students (for admin)
  getAllStudents: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiClient.get(`/students?${params.toString()}`);
  },

  // Get student dues/payments
  getDues: (studentId) =>
    apiClient.get(`/students/${studentId}/dues`),
};
