import axiosInstance from '../../../shared/api/axios';

export const brandApi = {
  getAll: async (params = {}) => {
    return await axiosInstance.get('/brands', { params });
  }
};