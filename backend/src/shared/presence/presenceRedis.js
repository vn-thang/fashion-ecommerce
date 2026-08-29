const redisClient = require('../../config/redis');

const PRESENCE_TTL = 60;

const getPresenceKey = userId =>
  `presence:user:${userId}`;

const getSocketKey = socketId =>
  `presence:socket:${socketId}`;

const presenceRedis = {
  addConnection: async (userId, socketId) => {
    const userKey = getPresenceKey(userId);
    const socketKey = getSocketKey(socketId);

    await redisClient.sAdd(userKey, socketId);
    await redisClient.set(
      socketKey,
      userId,
      {
        EX: PRESENCE_TTL
      }
    );

    const socketCount =
      await redisClient.sCard(userKey);

    console.log('[PRESENCE REDIS] ADD:', {
      userId,
      socketId,
      socketCount
    });

    return {
      added: true,
      socketCount
    };
  },

  removeConnection: async (userId, socketId) => {
    const userKey = getPresenceKey(userId);
    const socketKey = getSocketKey(socketId);

    const removed = await redisClient.sRem(
      userKey,
      socketId
    );

    await redisClient.del(socketKey);

    const socketCount =
      await redisClient.sCard(userKey);

    if (socketCount === 0) {
      await redisClient.del(userKey);
    }

    console.log('[PRESENCE REDIS] REMOVE:', {
      userId,
      socketId,
      removed: removed === 1,
      socketCount
    });

    return {
      removed: removed === 1,
      isOnline: socketCount > 0,
      socketCount
    };
  },

  refreshConnection: async socketId => {
    const socketKey = getSocketKey(socketId);

    await redisClient.expire(
      socketKey,
      PRESENCE_TTL
    );
  },

  isOnline: async userId => {
    const key = getPresenceKey(userId);

    const socketIds =
      await redisClient.sMembers(key);

    if (!socketIds.length) {
      await redisClient.del(key);
      return false;
    }

    let validCount = 0;

    for (const socketId of socketIds) {
      const exists =
        await redisClient.exists(
          getSocketKey(socketId)
        );

      if (exists) {
        validCount++;
      } else {
        await redisClient.sRem(
          key,
          socketId
        );
      }
    }

    if (validCount === 0) {
      await redisClient.del(key);
      return false;
    }

    return true;
  },

  getUserSockets: async userId => {
    const key = getPresenceKey(userId);

    return await redisClient.sMembers(key);
  },

  getOnlineUserIds: async () => {
    const userIds = [];

    for await (const key of redisClient.scanIterator({
      MATCH: 'presence:user:*',
      COUNT: 100
    })) {
      const userId =
        key.replace('presence:user:', '');

      const online =
        await presenceRedis.isOnline(userId);

      if (online) {
        userIds.push(userId);
      }
    }

    return userIds;
  },

  clearUser: async userId => {
    const key = getPresenceKey(userId);

    const socketIds =
      await redisClient.sMembers(key);

    for (const socketId of socketIds) {
      await redisClient.del(
        getSocketKey(socketId)
      );
    }

    await redisClient.del(key);
  }
};

module.exports = presenceRedis;