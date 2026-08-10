import axiosInstance from '../../../shared/api/axios';

export const dashboardApi = {
  getDashboard: async (params = {}) => {
    return await axiosInstance.get('/admin/dashboard', {
      params
    });
  }
};