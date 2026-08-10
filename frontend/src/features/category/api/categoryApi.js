import axiosInstance from '../../../shared/api/axios';

export const categoryApi = {
  getAll: async (params = {}) => {
    return await axiosInstance.get('/categories', {
      params
    });
  }
};