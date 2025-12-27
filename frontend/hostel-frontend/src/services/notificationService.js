import apiClient from './apiClient';

export const notificationService = {
  // Get user notifications
  getNotifications: (userId) =>
    apiClient.get(`/notifications/user/${userId}`),

  // Get unread notifications count
  getUnreadCount: (userId) =>
    apiClient.get(`/notifications/user/${userId}/unread-count`),

  // Mark notification as read
  markAsRead: (notificationId) =>
    apiClient.patch(`/notifications/${notificationId}/read`),

  // Mark all as read
  markAllAsRead: (userId) =>
    apiClient.patch(`/notifications/user/${userId}/mark-all-read`),

  // Delete notification
  deleteNotification: (notificationId) =>
    apiClient.delete(`/notifications/${notificationId}`),
};
