import axiosInstance from '../../../shared/api/axios';

export const chatApi = {
  getConversation: async () => {
    return await axiosInstance.get('/conversations/me');
  },

  getMessages: async (conversationId, params = {}) => {
    return await axiosInstance.get(
      `/conversations/${conversationId}/messages`,
      { params }
    );
  },

  sendMessage: async (conversationId, data) => {
    return await axiosInstance.post(
      `/conversations/${conversationId}/messages`,
      data
    );
  },

   uploadAttachment: async file => {
    const formData = new FormData();
    formData.append('file', file);

    return await axiosInstance.post('/conversations/upload',
      formData
    );
  },

  markAsRead: async conversationId => {
    return await axiosInstance.patch(
      `/conversations/${conversationId}/read`
    );
  },

  closeConversation: async conversationId => {
    return await axiosInstance.patch(
      `/conversations/${conversationId}/close`
    );
  }
};