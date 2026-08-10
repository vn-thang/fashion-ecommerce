import axiosInstance from '../../../shared/api/axios';

export const addressApi = {
  getAddresses: () => axiosInstance.get('/users/addresses'),
  
  createAddress: (data) => axiosInstance.post('/users/addresses', data),
  
  updateAddress: (id, data) => axiosInstance.put(`/users/addresses/${id}`, data),
  
  deleteAddress: (id) => axiosInstance.delete(`/users/addresses/${id}`),
  
  setDefault: (id) => axiosInstance.patch(`/users/addresses/${id}/default`)
};