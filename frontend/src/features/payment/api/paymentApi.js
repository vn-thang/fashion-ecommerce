import axiosInstance from '../../../shared/api/axios';

export const paymentApi = {
  createPaymentUrl: async data => {

    try {
      const response = await axiosInstance.post(
        '/payments/vnpay/create',
        data
      );

      return response;
    }catch (error) {
  throw error;
}
},

  verifyPayment: async params => {
    try {
      const response = await axiosInstance.get(
        '/payments/vnpay/verify',
        { params }
      );

      return response;
    } catch (error) {
    throw error;
    }
  }
};