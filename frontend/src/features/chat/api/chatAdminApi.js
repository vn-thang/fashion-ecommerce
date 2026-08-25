import axiosInstance from '../../../shared/api/axios';

export const chatAdminApi = {
  getAllConversations: async (params = {}) => {
    return await axiosInstance.get('/admin/conversations', {
      params
    });
  },

  getConversation: async conversationId => {
    return await axiosInstance.get(
      `/admin/conversations/${conversationId}`
    );
  },

  getMessages: async (conversationId, params = {}) => {
    return await axiosInstance.get(
      `/admin/conversations/${conversationId}/messages`,
      { params }
    );
  },

  sendMessage: async (conversationId, data) => {
    return await axiosInstance.post(
      `/admin/conversations/${conversationId}/messages`,
      data
    );
  },

   uploadAttachment: async file => {
    const formData = new FormData();
    formData.append('file', file);

    return await axiosInstance.post('/admin/conversations/upload', formData );
  },

  markAsRead: async conversationId => {
    return await axiosInstance.patch(
      `/admin/conversations/${conversationId}/read`
    );
  },

  closeConversation: async conversationId => {
    return await axiosInstance.patch(
      `/admin/conversations/${conversationId}/close`
    );
  }
};