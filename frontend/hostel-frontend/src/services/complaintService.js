import apiClient from './apiClient';

export const complaintService = {
  // Get all complaints for student
  getStudentComplaints: (studentId) =>
    apiClient.get(`/complaints/student/${studentId}`),

  // Get all complaints (for admin/worker)
  getAllComplaints: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiClient.get(`/complaints?${params.toString()}`);
  },

  // Get single complaint details
  getComplaintDetails: (complaintId) =>
    apiClient.get(`/complaints/${complaintId}`),

  // Create new complaint
  createComplaint: (complaintData) =>
    apiClient.post('/complaints', complaintData),

  // Update complaint status
  updateComplaintStatus: (complaintId, status) =>
    apiClient.patch(`/complaints/${complaintId}`, { status }),

  // Assign complaint to worker
  assignComplaint: (complaintId, workerId) =>
    apiClient.patch(`/complaints/${complaintId}/assign`, { assignedWorker: workerId }),

  // Delete complaint
  deleteComplaint: (complaintId) =>
    apiClient.delete(`/complaints/${complaintId}`),

  // Add comment to complaint
  addComment: (complaintId, comment) =>
    apiClient.post(`/complaints/${complaintId}/comments`, { comment }),
};
