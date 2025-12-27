import apiClient from './apiClient';

export const adminService = {
  // Get dashboard stats
  getDashboardStats: () =>
    apiClient.get('/admin/stats'),

  // Get all complaints for admin view
  getAllComplaints: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiClient.get(`/admin/complaints?${params.toString()}`);
  },

  // Get occupancy report
  getOccupancyReport: () =>
    apiClient.get('/admin/reports/occupancy'),

  // Get complaint analytics
  getComplaintAnalytics: (dateRange = {}) => {
    const params = new URLSearchParams(dateRange);
    return apiClient.get(`/admin/reports/complaints?${params.toString()}`);
  },

  // Get maintenance report
  getMaintenanceReport: () =>
    apiClient.get('/admin/reports/maintenance'),
};
