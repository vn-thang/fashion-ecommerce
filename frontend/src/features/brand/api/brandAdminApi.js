import axiosInstance from '../../../shared/api/axios';

export const brandAdminApi = {
  getAll: async (params = {}) => {
    return await axiosInstance.get('/admin/brands', { params });
  },

  create: async (formData) => {
    return await axiosInstance.post('/admin/brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  update: async (id, formData) => {
    return await axiosInstance.put(`/admin/brands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deactivate: async (id) => {
    return await axiosInstance.patch(`/admin/brands/${id}/deactivate`);
  },

  activate: async (id) => {
    return await axiosInstance.patch(`/admin/brands/${id}/activate`);
  }
};