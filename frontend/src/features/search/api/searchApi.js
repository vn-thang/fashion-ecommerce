import axiosInstance from '../../../shared/api/axios';

export const searchApi = {
  getSuggestions: async keyword => {
    return axiosInstance.get(
      '/products/search-suggestions',
      {
        params: {
          search: keyword
        }
      }
    );
  }
};