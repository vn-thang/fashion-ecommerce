const conversationRepository = require('./conversation.repository');
const messageRepository = require('./message.repository');
const notificationRepository = require('../notification/notification.repository');
const {TYPE, CHAT} = require('../notification/notification.constants');
const fcmService = require('../notification/fcm.service');

const { MESSAGES, MESSAGE_TYPE, MESSAGE_STATUS} = require('./chat.constants');

const { getPagination, getPaginationMetadata } = require('../../utils/pagination');

const DEFAULT_LIMIT = 20;

const messageService = {
sendMessage: async ({
  conversationId,
  senderId,
  role,
  type = MESSAGE_TYPE.TEXT,
  content,
  attachmentUrl = null,
  attachmentName = null
}) => {
  const conversation =
    await conversationRepository.findById(conversationId);

  if (!conversation) {
    throw new Error(MESSAGES.CONVERSATION_NOT_FOUND);
  }

  const normalizedRole = role?.toUpperCase();
  const isAdmin = normalizedRole === 'ADMIN';
  const isCustomer = conversation.customerId === senderId;

  const participant =
    await conversationRepository.findParticipant({
      conversationId,
      userId: senderId
    });

  if (!isAdmin && !isCustomer && !participant) {
    throw new Error(MESSAGES.NOT_CONVERSATION_PARTICIPANT);
  }

  if (!Object.values(MESSAGE_TYPE).includes(type)) {
    throw new Error(MESSAGES.INVALID_MESSAGE_TYPE);
  }

  if (
    type === MESSAGE_TYPE.TEXT &&
    (!content || content.trim() === '')
  ) {
    throw new Error(MESSAGES.CONTENT_REQUIRED);
  }

  if (
    (type === MESSAGE_TYPE.IMAGE ||
      type === MESSAGE_TYPE.FILE) &&
    !attachmentUrl
  ) {
    throw new Error(MESSAGES.ATTACHMENT_REQUIRED);
  }

  if (
    (type === MESSAGE_TYPE.IMAGE ||
      type === MESSAGE_TYPE.FILE) &&
    !attachmentName
  ) {
    throw new Error(MESSAGES.ATTACHMENT_REQUIRED);
  }

  const message =
    await messageRepository.createWithConversationUpdate({
      conversationId,
      senderId,
      type,
      content:
        typeof content === 'string'
          ? content.trim()
          : null,
      status: MESSAGE_STATUS.SENT,
      attachmentUrl,
      attachmentName
    });

  let receiverId = null;
  let senderName = 'Người dùng';

if (isAdmin) {
  receiverId = conversation.customerId;

  senderName =
    conversation.store?.storeName || 'FashionHub';
} else {
    const adminParticipant =
      conversation.participants?.find(
        participant =>
          participant.user?.role?.toUpperCase() === 'ADMIN' &&
          participant.userId !== senderId &&
          participant.isActive
      );

    receiverId = adminParticipant?.userId || null;
    senderName = conversation.customer?.fullName || 'Khách hàng';
  }

if (receiverId) {
  let notificationContent;

  switch (type) {
    case MESSAGE_TYPE.IMAGE:
      notificationContent = CHAT.IMAGE_CONTENT;
      break;

    case MESSAGE_TYPE.FILE:
      notificationContent = CHAT.FILE_CONTENT;
      break;

    default:
      notificationContent = CHAT.MESSAGE_CONTENT(
        message.content
      );
  }

  try {
    const devices =
      await notificationRepository.findDevicesByUserId(
        receiverId
      );

    await Promise.allSettled(
      devices.map(async device => {
        try {
          await fcmService.sendToToken({
            token: device.token,
            title: CHAT.MESSAGE_TITLE(senderName),
            body: notificationContent,
            data: {
              conversationId,
              messageId: message.id,
              senderId,
              senderName
            }
          });
        } catch (error) {
          console.error(
            `Chat FCM failed for device ${device.id}:`,
            error.message
          );
        }
      })
    );
  } catch (error) {
    console.error(
      'Chat push notification failed:',
      error.message
    );
  }
}

  return message;
},

markAsDelivered: async ({
  messageId,
  userId,
  role
}) => {
  const message =
    await messageRepository.findById(messageId);

  if (!message) {
    throw new Error(MESSAGES.MESSAGE_NOT_FOUND);
  }
  if (message.senderId === userId) {
    return {
      message,
      changed: false
    };
  }
  if (
    message.status === MESSAGE_STATUS.READ
  ) {
    return {
      message,
      changed: false
    };
  }
  if (
    message.status === MESSAGE_STATUS.DELIVERED
  ) {
    return {
      message,
      changed: false
    };
  }

  const updatedMessage =
    await messageRepository.updateStatus({
      messageId,
      status: MESSAGE_STATUS.DELIVERED
    });

  return {
    message: updatedMessage,
    changed: true
  };
},

  getMessages: async ({
    conversationId,
    userId,
    role,
    queryParams = {}
  }) => {
    const conversation =
      await conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error(MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const normalizedRole = role?.toUpperCase();

    if (normalizedRole !== 'ADMIN') {
      const isCustomer = conversation.customerId === userId;

      const participant =
        await conversationRepository.findParticipant({
          conversationId,
          userId
        });

      if (!isCustomer && !participant) {
        throw new Error(MESSAGES.NOT_CONVERSATION_PARTICIPANT);
      }
    }

    const {
      page: rawPage,
      limit: rawLimit
    } = queryParams;

    const { page, limit, skip } = getPagination(
      rawPage,
      rawLimit,
      DEFAULT_LIMIT
    );

    const { messages, totalItems } =
      await messageRepository.findByConversationId({
        conversationId,
        skip,
        take: limit
      });

    return {
      messages: messages.reverse(),
      pagination: getPaginationMetadata(
        totalItems,
        page,
        limit
      )
    };
  },

  getUnreadCount: async ({
    conversationId,
    userId,
    role
  }) => {
    const conversation =
      await conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error(MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const normalizedRole = role?.toUpperCase();

    if (normalizedRole !== 'ADMIN') {
      const isCustomer = conversation.customerId === userId;

      if (!isCustomer) {
        const participant =
          await conversationRepository.findParticipant({
            conversationId,
            userId
          });

        if (!participant || !participant.isActive) {
          throw new Error(MESSAGES.NOT_CONVERSATION_PARTICIPANT);
        }
      }
    }

    const participant =
      await conversationRepository.findParticipant({
        conversationId,
        userId
      });

    if (!participant) {
      return 0;
    }

    return await messageRepository.countUnread({
      conversationId,
      userId,
      lastReadAt: participant.lastReadAt
    });
  },

  deleteMessage: async ({
    messageId,
    userId,
    role
  }) => {
    const message =
      await messageRepository.findById(messageId);

    if (!message) {
      throw new Error(MESSAGES.MESSAGE_NOT_FOUND);
    }

    if (message.isDeleted) {
      throw new Error(MESSAGES.MESSAGE_NOT_FOUND);
    }

    const normalizedRole = role?.toUpperCase();

    if (
      normalizedRole !== 'ADMIN' &&
      message.senderId !== userId
    ) {
      throw new Error(MESSAGES.NOT_CONVERSATION_PARTICIPANT);
    }

    return await messageRepository.softDelete(messageId);
  }
};

module.exports = messageService;