import axiosInstance from '../../../shared/api/axios';

export const adminUserApi = {
  getAll: params => {
    return axiosInstance.get('/admin/users', {
      params
    });
  },

  getById: userId => {
    return axiosInstance.get(`/admin/users/${userId}`);
  },

  updateStatus: (userId, isActive) => {
    return axiosInstance.patch(
      `/admin/users/${userId}/status`,
      { isActive }
    );
  }
};