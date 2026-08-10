import axiosInstance from '../../../shared/api/axios';

export const bannerApi = {
  getAll: async () => {
    return await axiosInstance.get('/banners');
  },

  getActive: async () => {
    return await axiosInstance.get('/banners/active');
  },

  create: async (formData) => {
    return await axiosInstance.post('/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  update: async (id, formData) => {
    return await axiosInstance.put(`/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  delete: async (id) => {
    return await axiosInstance.delete(`/banners/${id}`);
  }
};