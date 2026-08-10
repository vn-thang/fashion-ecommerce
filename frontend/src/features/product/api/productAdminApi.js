import axiosInstance from '../../../shared/api/axios';

export const productAdminApi = {
  getAll: async params => {
    return axiosInstance.get('/admin/products', { params });
  },

  getById: async id => {
    return axiosInstance.get(`/admin/products/${id}`);
  },

  create: async payload => {
    return axiosInstance.post('/admin/products', payload);
  },

  update: async (id, payload) => {
    return axiosInstance.put(`/admin/products/${id}`, payload);
  },

  deactivateProduct: async id => {
    return axiosInstance.delete(`/admin/products/${id}`);
  },

  uploadImages: async (productId, formData) => {
    return axiosInstance.post(
      `/admin/products/${productId}/images`,
      formData
    );
  },

  deleteImage: async (productId, imageId) => {
    return axiosInstance.delete(
      `/admin/products/${productId}/images/${imageId}`
    );
  },

  createVariant: async (productId, payload) => {
    return axiosInstance.post(
      `/admin/products/${productId}/variants`,
      payload
    );
  },

  updateVariant: async (variantId, payload) => {
    return axiosInstance.put(
      `/admin/products/variants/${variantId}`,
      payload
    );
  },

  deactivateVariant: async variantId => {
    return axiosInstance.delete(
      `/admin/products/variants/${variantId}`
    );
  },

  activateVariant: async variantId => {
  return axiosInstance.patch(
    `/admin/products/variants/${variantId}/activate`
  );
}
};