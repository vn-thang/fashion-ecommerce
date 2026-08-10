import axiosInstance from '../../../shared/api/axios';

export const inventoryApi = {
  getTransactions: async params => {
    return await axiosInstance.get('/admin/inventory', {
      params
    });
  },

  getTransactionDetail: async id => {
    return await axiosInstance.get(`/admin/inventory/${id}`);
  },

  getVariants: async keyword => {
    return await axiosInstance.get('/admin/inventory/variants', {
      params: {
        keyword
      }
    });
  },

  importStock: async data => {
    return await axiosInstance.post('/admin/inventory/import', data);
  },

  adjustStock: async data => {
    return await axiosInstance.post('/admin/inventory/adjust', data);
  }
};