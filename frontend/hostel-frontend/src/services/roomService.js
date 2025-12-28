// src/services/roomService.js - Create this file
import apiClient from './apiClient';
import { toast } from 'react-hot-toast';

export const roomService = {
  getAllRooms: async () => {
    try {
      const response = await apiClient.get('/rooms');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch rooms');
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await apiClient.post('/rooms', roomData);
      toast.success('Room created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room');
      throw error;
    }
  },

  updateRoom: async (roomNo, roomData) => {
    try {
      const response = await apiClient.put(`/rooms/${roomNo}`, roomData);
      toast.success('Room updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update room');
      throw error;
    }
  },

  deleteRoom: async (roomNo) => {
    try {
      await apiClient.delete(`/rooms/${roomNo}`);
      toast.success('Room deleted successfully');
    } catch (error) {
      toast.error('Failed to delete room');
      throw error;
    }
  },

  getAvailableRooms: async () => {
    try {
      const response = await apiClient.get('/rooms/available');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch available rooms');
      throw error;
    }
  }
};
