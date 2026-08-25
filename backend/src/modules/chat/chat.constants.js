const CHAT_CONSTANTS = {
  CONVERSATION_STATUS: {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED'
  },

  MESSAGE_TYPE: {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    FILE: 'FILE'
  },

  MESSAGE_STATUS: {
    SENT: 'SENT',
    DELIVERED: 'DELIVERED',
    READ: 'READ',
    FAILED: 'FAILED'
  },

  SOCKET_EVENTS: {
    CONVERSATION_JOIN: 'conversation:join',
    CONVERSATION_LEAVE: 'conversation:leave',

    MESSAGE_SEND: 'message:send',
    MESSAGE_NEW: 'message:new',
    MESSAGE_DELIVERED: 'message:delivered',
    MESSAGE_READ: 'message:read',

    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline',

    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop'
  },

  MESSAGES: {
    INVALID_CONVERSATION_ID:
      'Mã cuộc trò chuyện (ID) phải là định dạng UUID hợp lệ!',

    INVALID_MESSAGE_ID:
      'Mã tin nhắn (ID) phải là định dạng UUID hợp lệ!',

    CONVERSATION_NOT_FOUND:
      'Cuộc trò chuyện không tồn tại!',

    MESSAGE_NOT_FOUND:
      'Tin nhắn không tồn tại!',

    CONVERSATION_CLOSED:
      'Cuộc trò chuyện đã được đóng và không thể thực hiện thao tác này!',

    NOT_CONVERSATION_PARTICIPANT:
      'Bạn không có quyền truy cập cuộc trò chuyện này!',

    CUSTOMER_REQUIRED:
      'Khách hàng là bắt buộc!',

    CONTENT_REQUIRED:
      'Nội dung tin nhắn là bắt buộc và không được để trống!',

    INVALID_MESSAGE_TYPE:
      'Loại tin nhắn không hợp lệ!',

    INVALID_MESSAGE_STATUS:
      'Trạng thái tin nhắn không hợp lệ!',

    ATTACHMENT_REQUIRED:
      'Tin nhắn loại này yêu cầu file đính kèm!',

    CONVERSATION_ALREADY_CLOSED:
      'Cuộc trò chuyện đã được đóng trước đó!',

    CONVERSATION_NOT_CLOSED:
      'Cuộc trò chuyện chưa được đóng!',

    CREATE_CONVERSATION_SUCCESS:
      'Tạo cuộc trò chuyện thành công!',

    GET_CONVERSATION_SUCCESS:
      'Lấy cuộc trò chuyện thành công!',

    GET_CONVERSATIONS_SUCCESS:
      'Lấy danh sách cuộc trò chuyện thành công!',

    SEND_MESSAGE_SUCCESS:
      'Gửi tin nhắn thành công!',

    GET_MESSAGES_SUCCESS:
      'Lấy danh sách tin nhắn thành công!',

    MARK_READ_SUCCESS:
      'Đánh dấu đã đọc thành công!',

    CLOSE_CONVERSATION_SUCCESS:
      'Đóng cuộc trò chuyện thành công!'
  }
};

module.exports = CHAT_CONSTANTS;