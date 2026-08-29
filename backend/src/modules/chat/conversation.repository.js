const prisma = require('../../config/database');

const conversationRepository = {
  create: async (data) => {
    return await prisma.conversation.create({
      data
    });
  },

findById: async id => {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
          phoneNumber: true,
          isOnline: true,
          lastSeenAt: true
        }
      },
      participants: {
        where: {
          isActive: true
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              role: true,
              isOnline: true,
              lastSeenAt: true
            }
          }
        }
      },
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  if (!conversation) {
    return null;
  }

  const store = await prisma.storeSetting.findFirst({
    select: {
      id: true,
      storeName: true,
      logoUrl: true,
      hotline: true,
      email: true,
      address: true,
      description: true,
      openingHours: true
    }
  });

  return {
    ...conversation,
    store
  };
},

  findByCustomerId: async (customerId) => {
    return await prisma.conversation.findUnique({
      where: { customerId }
    });
  },
findAllPaginated: async ({
  search,
  status,
  adminId,
  skip,
  take
}) => {
  const where = {
    ...(status ? { status } : {}),

    ...(search
      ? {
          customer: {
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ]
          }
        }
      : {}),
    ...(adminId
      ? {
          customerId: {
            not: adminId
          }
        }
      : {})
  };

  const [conversations, totalItems] =
    await prisma.$transaction([
      prisma.conversation.findMany({
        where,
        skip,
        take,
        orderBy: [
          { lastMessageAt: 'desc' },
          { createdAt: 'desc' }
        ],

        include: {
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              isOnline: true,
              lastSeenAt: true
            }
          },

          participants: {
            where: {
              isActive: true
            },
            select: {
              id: true,
              userId: true,
              lastReadAt: true,

              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                  role: true
                }
              }
            }
          },

          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc'
            },
            select: {
              id: true,
              content: true,
              type: true,
              status: true,
              senderId: true,
              createdAt: true
            }
          }
        }
      }),

      prisma.conversation.count({
        where
      })
    ]);
  if (!adminId) {
    return {
      conversations,
      totalItems
    };
  }

  const conversationIds = conversations.map(
    conversation => conversation.id
  );

  const adminParticipants =
    await prisma.conversationParticipant.findMany({
      where: {
        userId: adminId,
        conversationId: {
          in: conversationIds
        }
      },
      select: {
        conversationId: true,
        lastReadAt: true
      }
    });

  const participantMap = new Map(
    adminParticipants.map(participant => [
      participant.conversationId,
      participant.lastReadAt
    ])
  );

  const unreadCounts = await Promise.all(
    conversations.map(async conversation => {
      const lastReadAt = participantMap.get(
        conversation.id
      );

      const unreadCount =
        await prisma.message.count({
          where: {
            conversationId: conversation.id,
            senderId: {
              not: adminId
            },

            isDeleted: false,

            ...(lastReadAt
              ? {
                  createdAt: {
                    gt: lastReadAt
                  }
                }
              : {})
          }
        });

      return {
        conversationId: conversation.id,
        unreadCount
      };
    })
  );

  const unreadMap = new Map(
    unreadCounts.map(item => [
      item.conversationId,
      item.unreadCount
    ])
  );

  const conversationsWithUnreadCount =
    conversations.map(conversation => ({
      ...conversation,

      unreadCount:
        unreadMap.get(conversation.id) || 0
    }));

  return {
    conversations: conversationsWithUnreadCount,
    totalItems
  };
},

  addParticipant: async ({ conversationId, userId }) => {
    return await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId,
          userId
        }
      },
      update: {
        isActive: true
      },
      create: {
        conversationId,
        userId
      }
    });
  },

  findParticipant: async ({ conversationId, userId }) => {
    return await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId
        }
      }
    });
  },

  updateLastReadAt: async ({ conversationId, userId, lastReadAt }) => {
    return await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId
        }
      },
      data: {
        lastReadAt
      }
    });
  },

  close: async (id) => {
    return await prisma.conversation.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date()
      }
    });
  },

  reopen: async (id) => {
    return await prisma.conversation.update({
      where: { id },
      data: {
        status: 'OPEN',
        closedAt: null
      }
    });
  },

  updateLastMessageAt: async (id, lastMessageAt) => {
    return await prisma.conversation.update({
      where: { id },
      data: {
        lastMessageAt
      }
    });
  }
};

module.exports = conversationRepository;