import axiosInstance from '../../../shared/api/axios';

export const categoryAdminApi = {
  getAll: async (params = {}) => {
    return await axiosInstance.get('/admin/categories', {
      params
    });
  },

  create: async payload => {
    return await axiosInstance.post(
      '/admin/categories',
      payload
    );
  },

  update: async (id, payload) => {
    return await axiosInstance.put(
      `/admin/categories/${id}`,
      payload
    );
  },

  deactivate: async id => {
    return await axiosInstance.patch(
      `/admin/categories/${id}/deactivate`
    );
  },

  activate: async id => {
    return await axiosInstance.patch(
      `/admin/categories/${id}/activate`
    );
  }
};