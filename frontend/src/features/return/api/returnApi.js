import axiosInstance from '../../../shared/api/axios';

export const returnApi = {
  create: async data => {
    return await axiosInstance.post('/returns', data);
  },

  getAll: async (params = {}) => {
    return await axiosInstance.get('/returns', { params });
  },

  getById: async id => {
    return await axiosInstance.get(`/returns/${id}`);
  },

  getByOrderId: async orderId => {
    return await axiosInstance.get(`/returns/order/${orderId}`);
  },

  markShipping: async id => {
    return await axiosInstance.patch(`/returns/${id}/shipping`);
  },
   cancel: async id => {
    return await axiosInstance.patch(`/returns/${id}/cancel`);
  }
};