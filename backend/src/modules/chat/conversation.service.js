const conversationRepository = require('./conversation.repository');
const { MESSAGES, MESSAGE_TYPE, MESSAGE_STATUS, CONVERSATION_STATUS } = require('./chat.constants');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');
const messageRepository = require('./message.repository');

const DEFAULT_LIMIT = 10;

const conversationService = {
  getOrCreateConversation: async customerId => {
    const existing = await conversationRepository.findByCustomerId(customerId);

    if (existing) {
      return await conversationRepository.findById(existing.id);
    }

    const conversation = await conversationRepository.create({
      customerId,
      status: CONVERSATION_STATUS.OPEN
    });

    await conversationRepository.addParticipant({
      conversationId: conversation.id,
      userId: customerId
    });

    return await conversationRepository.findById(conversation.id);
  },

  getConversationByCustomerId: async customerId => {
    const conversation =
      await conversationRepository.findByCustomerId(customerId);

    if (!conversation) {
      return null;
    }

    return await conversationRepository.findById(conversation.id);
  },

  getConversationById: async ({
  conversationId,
  userId,
  role
}) => {
  const conversation =
    await conversationRepository.findById(
      conversationId
    );

  if (!conversation) {
    throw new Error(
      MESSAGES.CONVERSATION_NOT_FOUND
    );
  }

  const normalizedRole =
    role?.toUpperCase();

  if (normalizedRole !== 'ADMIN') {
    const isCustomer =
      conversation.customerId === userId;

    const isParticipant =
      conversation.participants.some(
        participant =>
          participant.userId === userId &&
          participant.isActive
      );

    if (!isCustomer && !isParticipant) {
      throw new Error(
        MESSAGES.NOT_CONVERSATION_PARTICIPANT
      );
    }
  }

  return conversation;
},

getAdminConversations: async (queryParams = {}) => {
  const {
    search,
    status,
    adminId,
    page: rawPage,
    limit: rawLimit
  } = queryParams;

  const { page, limit, skip } = getPagination(
    rawPage,
    rawLimit,
    DEFAULT_LIMIT
  );

  const { conversations, totalItems } =
    await conversationRepository.findAllPaginated({
      search,
      status,
      adminId,
      skip,
      take: limit
    });

  return {
    conversations,
    pagination: getPaginationMetadata(
      totalItems,
      page,
      limit
    )
  };
},

  addParticipant: async ({ conversationId, userId }) => {
    const conversation =
      await conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error(MESSAGES.CONVERSATION_NOT_FOUND);
    }

    return await conversationRepository.addParticipant({
      conversationId,
      userId
    });
  },

markAsRead: async ({
  conversationId,
  userId,
  role
}) => {
  const conversation =
    await conversationRepository.findById(
      conversationId
    );

  if (!conversation) {
    throw new Error(
      MESSAGES.CONVERSATION_NOT_FOUND
    );
  }

  const normalizedRole = role?.toUpperCase();
  if (normalizedRole !== 'ADMIN') {
    const isCustomer =
      conversation.customerId === userId;

    if (!isCustomer) {
      const participant =
        await conversationRepository.findParticipant({
          conversationId,
          userId
        });

      if (
        !participant ||
        !participant.isActive
      ) {
        throw new Error(
          MESSAGES.NOT_CONVERSATION_PARTICIPANT
        );
      }
    }
  }
  let participant =
    await conversationRepository.findParticipant({
      conversationId,
      userId
    });

  if (
    !participant &&
    normalizedRole === 'ADMIN'
  ) {
    participant =
      await conversationRepository.addParticipant({
        conversationId,
        userId
      });
  }

  if (
    !participant &&
    normalizedRole !== 'ADMIN'
  ) {
    throw new Error(
      MESSAGES.NOT_CONVERSATION_PARTICIPANT
    );
  }

  const lastReadAt = new Date();

  await conversationRepository.updateLastReadAt({
    conversationId,
    userId,
    lastReadAt
  });

  const result =
    await messageRepository.updateStatusByConversation({
      conversationId,
      userId,
      status: MESSAGE_STATUS.READ
    });

  return {
    conversationId,
    userId,
    lastReadAt,
    updatedCount: result.count
  };
},

  closeConversation: async ({ conversationId, userId, role }) => {
    const conversation =
      await conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error(MESSAGES.CONVERSATION_NOT_FOUND);
    }

    if (conversation.status === CONVERSATION_STATUS.CLOSED) {
      throw new Error(MESSAGES.CONVERSATION_ALREADY_CLOSED);
    }

    const normalizedRole = role?.toUpperCase();

    if (
      normalizedRole !== 'ADMIN' &&
      conversation.customerId !== userId
    ) {
      throw new Error(MESSAGES.NOT_CONVERSATION_PARTICIPANT);
    }

    return await conversationRepository.close(conversationId);
  }
};

module.exports = conversationService;