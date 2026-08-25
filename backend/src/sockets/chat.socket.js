const conversationService = require('../modules/chat/conversation.service');
const messageService = require('../modules/chat/message.service');
const notificationService = require('../modules/notification/notification.service');
const { TYPE, CHAT } = require('../modules/notification/notification.constants');
const { MESSAGE_TYPE, MESSAGE_STATUS, SOCKET_EVENTS } = require('../modules/chat/chat.constants');
const presenceService = require('../modules/chat/presence.service');

const getRoomName = conversationId => `conversation:${conversationId}`;

const isValidUUID = id => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const registerChatSocket = (io, socket) => { 
  const userId = socket.user.userId;

  presenceService
    .addConnection(userId, socket.id)
    .then(result => {
      if (result.isFirstConnection) {
        io.emit('user:online', {
          userId,
          isOnline: true
        });
      }
    })
    .catch(error => {
      console.error(`Failed to set user ${userId} online:`, error.message);
    });

  socket.on(
    SOCKET_EVENTS.CONVERSATION_JOIN,
    async ({ conversationId }, callback) => {
      try {
        if (!isValidUUID(conversationId)) {
          throw new Error('Mã cuộc trò chuyện không hợp lệ!');
        }

        await conversationService.getConversationById({
          conversationId,
          userId,
          role: socket.user.role
        });

        const room = getRoomName(conversationId);
        socket.join(room);

        callback?.({
          success: true,
          conversationId
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message
        });
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.CONVERSATION_LEAVE,
    ({ conversationId }, callback) => {
      try {
        if (!isValidUUID(conversationId)) {
          throw new Error('Mã cuộc trò chuyện không hợp lệ!');
        }

        const room = getRoomName(conversationId);
        socket.leave(room);

        callback?.({
          success: true,
          conversationId
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message
        });
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.TYPING_START,
    async ({ conversationId }, callback) => {
      try {

        const userId = socket.user.userId;
        if (!isValidUUID(conversationId)) {
          throw new Error('Mã cuộc trò chuyện không hợp lệ!');
        }

        await conversationService.getConversationById({
          conversationId,
          userId,
          role: socket.user.role
        });

        socket.to(getRoomName(conversationId)).emit(
          SOCKET_EVENTS.TYPING_START,
          {
            conversationId,
            userId
          }
        );

        callback?.({ success: true });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message
        });
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.TYPING_STOP,
    async ({ conversationId }, callback) => {
      try {
        if (!isValidUUID(conversationId)) {
          throw new Error('Mã cuộc trò chuyện không hợp lệ!');
        }

        await conversationService.getConversationById({
          conversationId,
          userId,
          role: socket.user.role
        });

        socket.to(getRoomName(conversationId)).emit(
          SOCKET_EVENTS.TYPING_STOP,
          {
            conversationId,
            userId
          }
        );

        callback?.({ success: true });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message
        });
      }
    }
  );

socket.on(
  SOCKET_EVENTS.MESSAGE_SEND,
  async (
    {
      conversationId,
      type = MESSAGE_TYPE.TEXT,
      content,
      attachmentUrl = null,
      attachmentName = null
    },
    callback
  ) => {
    try {
      if (!isValidUUID(conversationId)) {
        throw new Error('Mã cuộc trò chuyện không hợp lệ!');
      }
        await conversationService.getConversationById({
          conversationId,
          userId,
          role: socket.user.role
        });

      const message = await messageService.sendMessage({
        conversationId,
        senderId: userId,
        role: socket.user.role,
        type,
        content,
        attachmentUrl,
        attachmentName
      });

      const room = getRoomName(conversationId);
      io.to(room).emit(
        SOCKET_EVENTS.MESSAGE_NEW,
        message
      );
      callback?.({
        success: true,
        message
      });
    } catch (error) {
      callback?.({
        success: false,
        message: error.message
      });
    }
  }
);

socket.on(
  SOCKET_EVENTS.MESSAGE_DELIVERED,
  async ({ messageId, conversationId }, callback) => {
    try {
      if (!isValidUUID(messageId)) {
        throw new Error('Mã tin nhắn không hợp lệ!');
      }

      if (!isValidUUID(conversationId)) {
        throw new Error(
          'Mã cuộc trò chuyện không hợp lệ!'
        );
      }

      await conversationService.getConversationById({
        conversationId,
        userId,
        role: socket.user.role
      });

      const result =
        await messageService.markAsDelivered({
          messageId,
          userId,
          role: socket.user.role
        });

      if (result.changed) {
        io.to(getRoomName(conversationId)).emit(
          SOCKET_EVENTS.MESSAGE_STATUS,
          {
            conversationId,
            messageId,
            status: MESSAGE_STATUS.DELIVERED
          }
        );
      }

      callback?.({
        success: true
      });
    } catch (error) {
      callback?.({
        success: false,
        message: error.message
      });
    }
  }
);

socket.on(
  SOCKET_EVENTS.MESSAGE_READ,
  async ({ conversationId }, callback) => {
    try {
      if (!isValidUUID(conversationId)) {
        throw new Error(
          'Mã cuộc trò chuyện không hợp lệ!'
        );
      }

      const result =
        await conversationService.markAsRead({
          conversationId,
          userId,
          role: socket.user.role
        });

      io.to(getRoomName(conversationId)).emit(
        SOCKET_EVENTS.MESSAGE_READ,
        {
          conversationId,
          userId,
          lastReadAt: result.lastReadAt,
          updatedCount: result.updatedCount
        }
      );

      callback?.({
        success: true,
        data: result
      });
    } catch (error) {
      callback?.({
        success: false,
        message: error.message
      });
    }
  }
);

  socket.on('disconnect', reason => {
    presenceService
      .removeConnection(userId, socket.id)
      .then(result => {
        if (result.isLastConnection) {
          io.emit('user:offline', {
            userId,
            isOnline: false,
            lastSeenAt: result.user.lastSeenAt
          });
        }
      })
      .catch(error => {
        console.error(
          `Failed to set user ${userId} offline:`,
          error.message
        );
      });

    console.log(
      `User ${userId} disconnected: ${reason}`
    );
  });
};

module.exports = registerChatSocket;