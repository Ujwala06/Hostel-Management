import apiClient from './apiClient';

export const workerService = {
  // Get worker profile
  getProfile: (workerId) =>
    apiClient.get(`/workers/${workerId}`),

  // Update worker profile
  updateProfile: (workerId, profileData) =>
    apiClient.patch(`/workers/${workerId}`, profileData),

  // Get assigned complaints
  getAssignedComplaints: (workerId, status = null) => {
    const url = status 
      ? `/workers/${workerId}/complaints?status=${status}`
      : `/workers/${workerId}/complaints`;
    return apiClient.get(url);
  },

  // Get all workers (admin only)
  getAllWorkers: () =>
    apiClient.get('/workers'),

  // Update complaint status (worker perspective)
  updateComplaintProgress: (complaintId, updateData) =>
    apiClient.patch(`/complaints/${complaintId}`, updateData),
};
