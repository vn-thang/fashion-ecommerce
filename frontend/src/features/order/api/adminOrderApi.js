import axiosInstance from '../../../shared/api/axios';

export const adminOrderApi = {

  getAll: async (params) => {
    return await axiosInstance.get('/admin/orders', { params });
  },

  getById: async (id) => {
    return await axiosInstance.get(`/admin/orders/${id}`);
  },

  updateStatus: async (id, status) => {
    return await axiosInstance.patch(`/admin/orders/${id}/status`, { status });
  },

  cancelOrder: async (id, cancelReason) => {
  return await axiosInstance.patch(
    `/admin/orders/${id}/cancel`,
    { cancelReason }
  );
}
};