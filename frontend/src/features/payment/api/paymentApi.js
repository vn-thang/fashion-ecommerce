 import axiosInstance from '../../../shared/api/axios';

export const paymentApi = {
  createPaymentUrl: data => axiosInstance.post('/payments/vnpay/create', data),

verifyPayment: params =>
  axiosInstance.get('/payments/vnpay/verify', { params })
};