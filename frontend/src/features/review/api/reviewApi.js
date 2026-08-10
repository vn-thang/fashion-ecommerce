import axiosInstance from '../../../shared/api/axios';

export const reviewApi = {
  getProductReviews: (productId, params = {}) => {
    return axiosInstance.get(
      `/review/product/${productId}`,
      { params }
    );
  },

  createReview: data => {
    return axiosInstance.post(
      '/review/create',
      data
    );
  },

  getAdminReviews: (params = {}) => {
    return axiosInstance.get(
      '/admin/review',
      { params }
    );
  },

  replyReview: (id, payload) => {
    return axiosInstance.post(
      `/admin/review/${id}/reply`,
      payload
    );
  },

  hideReview: id => {
    return axiosInstance.patch(
      `/admin/review/${id}/hide`
    );
  },

  restoreReview: id => {
    return axiosInstance.patch(
      `/admin/review/${id}/restore`
    );
  }
};