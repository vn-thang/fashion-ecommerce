import axiosInstance from '../../../shared/api/axios';

export const storeSettingApi = {
  get: async () => {
    return await axiosInstance.get('/storeSetting');
  },

  update: async (formData) => {
    return await axiosInstance.put('/storeSetting', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};