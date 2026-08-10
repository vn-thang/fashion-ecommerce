import axiosInstance from '../../../shared/api/axios';

export const orderApi = {
  previewCheckout: (data) => {
    return axiosInstance.post('/order/preview', data);
  },
  createOrder: (data) => {
    return axiosInstance.post('/order/create', data);
  },
  getMyOrders: (params) => {
    return axiosInstance.get('/order', { params });
  },
  getOrderDetails: (id) => {
    return axiosInstance.get(`/order/${id}`);
  },
cancelOrder: (id, reason) => {
  return axiosInstance.patch(`/order/${id}/cancel`, {
    cancelReason: reason
  });
}
};