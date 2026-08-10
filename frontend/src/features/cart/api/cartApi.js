import axiosInstance from '../../../shared/api/axios';

export const cartApi = {
  getCart: () => {
    return axiosInstance.get('/cart');
  },

  addToCart: (data) => {
    return axiosInstance.post('/cart/add', data);
  },

  updateQuantity: (itemId, quantity) => {
    return axiosInstance.put(`/cart/item/${itemId}`, { quantity });
  },

  removeItem: (itemId) => {
    return axiosInstance.delete(`/cart/item/${itemId}`);
  },

  clearCart: () => {
    return axiosInstance.delete('/cart/clear');
  }
};