const prisma = require('../../config/database');
const { MESSAGE_STATUS } = require('./chat.constants');

const senderSelect = {
  id: true,
  fullName: true,
  avatarUrl: true,
  role: true
};

const messageRepository = {
  createWithConversationUpdate: async ({
    conversationId,
    senderId,
    type,
    content,
    status,
    attachmentUrl,
    attachmentName
  }) => {
    const now = new Date();

    return await prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId,
          type,
          content,
          status,
          attachmentUrl,
          attachmentName
        },
        include: {
          sender: {
            select: senderSelect
          }
        }
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          status: 'OPEN',
          closedAt: null,
          lastMessageAt: now
        }
      });

      return message;
    });
  },

  findById: async (id) => {
    return await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: senderSelect
        }
      }
    });
  },

  findByConversationId: async ({ conversationId, skip, take }) => {
    const where = {
      conversationId,
      isDeleted: false
    };

    const [messages, totalItems] = await prisma.$transaction([
      prisma.message.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: senderSelect
          }
        }
      }),
      prisma.message.count({ where })
    ]);

    return {
      messages,
      totalItems
    };
  },

  findLatest: async (conversationId) => {
    return await prisma.message.findFirst({
      where: {
        conversationId,
        isDeleted: false
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: senderSelect
        }
      }
    });
  },

  countUnread: async ({ conversationId, userId, lastReadAt }) => {
    return await prisma.message.count({
      where: {
        conversationId,
        isDeleted: false,
        senderId: { not: userId },
        ...(lastReadAt
          ? { createdAt: { gt: lastReadAt } }
          : {})
      }
    });
  },

  softDelete: async (id) => {
    return await prisma.message.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        content: null,
        attachmentUrl: null,
        attachmentName: null
      }
    });
  },
  updateStatus: async ({ messageId, status }) => {
  return await prisma.message.update({
    where: { id: messageId },
    data: {
      status
    },
    include: {
      sender: {
        select: senderSelect
      }
    }
  });
},

updateStatusByIds: async ({
  messageIds,
  status
}) => {
  return await prisma.message.updateMany({
    where: {
      id: {
        in: messageIds
      },
      isDeleted: false
    },
    data: {
      status
    }
  });
},

updateStatusByConversation: async ({
  conversationId,
  userId,
  status
}) => {
  return await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: {
        not: userId
      },
      isDeleted: false,
      status: {
        in: [
          MESSAGE_STATUS.SENT,
          MESSAGE_STATUS.DELIVERED
        ]
      }
    },
    data: {
      status
    }
  });
},
};

module.exports = messageRepository;