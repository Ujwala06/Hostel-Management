import apiClient from './apiClient';

export const emergencyService = {
  // Create emergency request
  createEmergency: (emergencyData) =>
    apiClient.post('/emergencies', emergencyData),

  // Get user's emergencies
  getEmergencies: (userId) =>
    apiClient.get(`/emergencies/user/${userId}`),

  // Get all emergencies (admin)
  getAllEmergencies: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiClient.get(`/emergencies?${params.toString()}`);
  },

  // Update emergency status
  updateEmergencyStatus: (emergencyId, status) =>
    apiClient.patch(`/emergencies/${emergencyId}`, { status }),

  // Resolve emergency
  resolveEmergency: (emergencyId, resolution) =>
apiClient.patch(`/emergencies/${emergencyId}/resolve`, { resolution }),
};
