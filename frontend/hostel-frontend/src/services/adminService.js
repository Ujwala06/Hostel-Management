// src/services/adminService.js - Replace entire file
import apiClient from './apiClient';
import { toast } from 'react-hot-toast';

export const adminService = {
  // Fetch all students with pagination/filtering
  getStudents: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/admin/students?${params}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch students');
      throw error;
    }
  },

  // Fetch complaints with status/category filters
  getComplaints: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/admin/complaints?${params}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch complaints');
      throw error;
    }
  },

  // Get all workers
  getWorkers: async () => {
    try {
      const response = await apiClient.get('/admin/workers');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch workers');
      throw error;
    }
  },

  // Update complaint status
  updateComplaintStatus: async (complaintId, status) => {
    try {
      const response = await apiClient.patch(`/admin/complaints/${complaintId}/status`, { status });
      toast.success('Complaint status updated');
      return response.data;
    } catch (error) {
      toast.error('Failed to update complaint status');
      throw error;
    }
  },

  // Assign room to student
  assignRoom: async (studentId, roomNo) => {
    try {
      const response = await apiClient.post('/admin/assign-room', { studentId, roomNo });
      toast.success('Room assigned successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to assign room');
      throw error;
    }
  }
};
