//  import axiosInstance from '../../../shared/api/axios';

// export const paymentApi = { 
//   createPaymentUrl: data => axiosInstance.post('/payments/vnpay/create', data),

// verifyPayment: params =>
//   axiosInstance.get('/payments/vnpay/verify', { params })
// };

import axiosInstance from '../../../shared/api/axios';

export const paymentApi = {
  createPaymentUrl: async data => {
    console.log('[VNPAY] before request', {
      url: '/payments/vnpay/create',
      data
    });

    try {
      const response = await axiosInstance.post(
        '/payments/vnpay/create',
        data
      );

      console.log('[VNPAY] response', {
        status: response.status,
        data: response.data
      });

      return response;
    }catch (error) {
  console.error('[VNPAY] error', {
    status: error.response?.status,
    data: JSON.stringify(error.response?.data, null, 2),
    message: error.message,
    url: error.config?.url
  });

  throw error;
}
  },

  verifyPayment: async params => {
    console.log('[VNPAY VERIFY] before request', params);

    try {
      const response = await axiosInstance.get(
        '/payments/vnpay/verify',
        { params }
      );

      console.log('[VNPAY VERIFY] response', {
        status: response.status,
        data: response.data
      });

      return response;
    } catch (error) {
  console.error('[VNPAY] error', {
    status: error.response?.status,
    data: JSON.stringify(error.response?.data, null, 2),
    message: error.message,
    url: error.config?.url
  });

  throw error;
}
  }
};