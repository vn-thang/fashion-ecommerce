import axiosInstance from '../../../shared/api/axios';

export const auditLogAdminApi = {
  getAll: async (params = {}) => {
    return await axiosInstance.get('/admin/auditLog', { params });
  },

  getById: async id => {
    return await axiosInstance.get(`/admin/auditLog/${id}`);
  }
};