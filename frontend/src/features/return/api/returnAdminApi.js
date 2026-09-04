import axiosInstance from '../../../shared/api/axios';

export const returnAdminApi = {
  getAll: async (params = {}) => {
    return await axiosInstance.get('/admin/returns', { params });
  },

  getById: async id => {
    return await axiosInstance.get(`/admin/returns/${id}`);
  },

  approve: async id => {
    return await axiosInstance.patch(
      `/admin/returns/${id}/approve`
    );
  },

  reject: async (id, data) => {
    return await axiosInstance.patch(
      `/admin/returns/${id}/reject`,
      data
    );
  },

  received: async id => {
    return await axiosInstance.patch(
      `/admin/returns/${id}/received`
    );
  },

  complete: async id => {
    return await axiosInstance.patch(
      `/admin/returns/${id}/complete`
    );
  }
};