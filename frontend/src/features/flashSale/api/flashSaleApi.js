import axiosInstance from '../../../shared/api/axios';

export const flashSaleApi = {
  getAll: (params) => {
    return axiosInstance.get('/flashSales', { params });
  },

  getById: (id) => {
    return axiosInstance.get(`/flashSales/${id}`);
  },
   getActive: () => {
    return axiosInstance.get('/flashSales/active');
  },
  getCustomerFlashSale: (params) => {
    return axiosInstance.get('/flashSales/customer', {
      params
    });
  },

  create: (data) => {
    return axiosInstance.post('/flashSales', data);
  },

  update: (id, data) => {
    return axiosInstance.put(`/flashSales/${id}`, data);
  },

  disable: (id) => {
    return axiosInstance.delete(`/flashSales/${id}`);
  }
};