import axiosInstance from '../../../shared/api/axios';

export const flashSaleVariantApi = {
  getAll: (flashSaleId, params) => {
    return axiosInstance.get(
      `/flashSales/${flashSaleId}/variants`,
      { params }
    );
  },

  getById: (id) => {
    return axiosInstance.get(`/flashSales/variants/${id}`);
  },

  getAvailableVariants: (flashSaleId, params) => {
    return axiosInstance.get(
      `/flashSales/${flashSaleId}/variants/available`,
      { params }
    );
  },

  addVariants: (flashSaleId, data) => {
    return axiosInstance.post(
      `/flashSales/${flashSaleId}/variants`,
      data
    );
  },

  update: (id, data) => {
    return axiosInstance.put(
      `/flashSales/variants/${id}`,
      data
    );
  },

  remove: (id) => {
    return axiosInstance.delete(
      `/flashSales/variants/${id}`
    );
  }
};