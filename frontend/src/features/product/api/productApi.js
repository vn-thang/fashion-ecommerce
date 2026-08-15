import axiosInstance from '../../../shared/api/axios';

export const productApi = {
  getAll: async params => {
    return axiosInstance.get('/products', { params });
  },

  getBestSellingProducts: async () => {
    return axiosInstance.get('/products/best-selling');
  },

  getNewestProducts: async () => {
    return axiosInstance.get('/products/newest');
  },

   getHighestRatedProducts: async () => {
    return axiosInstance.get('/products/highest-rated');
  },

  getById: async id => {
    return axiosInstance.get(`/products/${id}`);
  },

  getBySlug: async slug => {
    return axiosInstance.get(`/products/detail/${slug}`);
  },

  getRelatedProducts: async productId => {
    return axiosInstance.get(`/products/${productId}/related`);
  }
};