import axiosInstance from '../../../shared/api/axios';

export const couponApi = {
  getAll: async params => {
    return await axiosInstance.get('/admin/coupons', { params });
  },

  getOne: async id => {
    return await axiosInstance.get(`/admin/coupons/${id}`);
  },

  create: async payload => {
    return await axiosInstance.post('/admin/coupons', payload);
  },

  update: async (id, payload) => {
    return await axiosInstance.put(`/admin/coupons/${id}`, payload);
  },

  delete: async id => {
    return await axiosInstance.delete(`/admin/coupons/${id}`);
  },
    getAllClient: async params => {
    return await axiosInstance.get('/coupons/client', { params });
  },
};