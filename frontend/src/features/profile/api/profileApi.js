import axiosInstance from '../../../shared/api/axios';

export const profileApi = {
  getProfile: () => {
    return axiosInstance.get('/users/profile');
  },

  updateProfile: (data) => {
    return axiosInstance.put('/users/profile', data);
  },

  uploadAvatar: (formData) => {
    return axiosInstance.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};