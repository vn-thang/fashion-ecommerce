import axiosInstance from '../../../shared/api/axios';

export const adminPaymentApi = {
  getAll: (params) =>
    axiosInstance.get('/admin/payments', { params }),

  getById: (id) =>
    axiosInstance.get(`/admin/payments/${id}`)
};