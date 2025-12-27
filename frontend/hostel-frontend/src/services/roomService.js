import apiClient from './apiClient';

export const roomService = {
  // Get all rooms
  getAllRooms: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiClient.get(`/rooms?${params.toString()}`);
  },

  // Get room details
  getRoomDetails: (roomId) =>
    apiClient.get(`/rooms/${roomId}`),

  // Get available rooms
  getAvailableRooms: () =>
    apiClient.get('/rooms/available'),

  // Create room (admin only)
  createRoom: (roomData) =>
    apiClient.post('/rooms', roomData),

  // Update room details (admin only)
  updateRoom: (roomId, roomData) =>
    apiClient.patch(`/rooms/${roomId}`, roomData),

  // Allocate student to room (admin only)
  allocateStudent: (roomId, studentId) =>
    apiClient.post(`/rooms/${roomId}/allocate`, { student: studentId }),

  // Get room occupancy
  getRoomOccupancy: (roomId) =>
    apiClient.get(`/rooms/${roomId}/occupancy`),
};
