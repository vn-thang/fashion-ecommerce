import axiosInstance from '../../../shared/api/axios';

export const notificationApi = {
  getAll: async params => {
    return await axiosInstance.get('/notifications', {
      params
    });
  },

  getUnreadCount: async () => {
    return await axiosInstance.get('/notifications/unread-count');
  },

  markAsRead: async id => {
    return await axiosInstance.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return await axiosInstance.patch('/notifications/read-all');
  },

 registerDeviceToken: async data => {
    return await axiosInstance.post('/notifications/device-token', data);
  },

  removeDeviceToken: async token => {
    return await axiosInstance.delete('/notifications/device-token', {
      data: { token }
    });
  }
};