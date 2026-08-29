const userService = require('../user/user.service');
const presenceRedis = require('../../shared/presence/presenceRedis');

const presenceService = {
  addConnection: async (userId, socketId) => {
    if (!userId || !socketId) {
      return {
        isFirstConnection: false,
        isOnline: false
      };
    }

    const wasOnline =
      await presenceRedis.isOnline(userId);

    const result =
      await presenceRedis.addConnection(
        userId,
        socketId
      );

    if (!wasOnline) {
      const user =
        await userService.setOnline(userId);

      return {
        isFirstConnection: true,
        isOnline: true,
        user
      };
    }

    return {
      isFirstConnection: false,
      isOnline: true,
      userId,
      socketCount: result.socketCount
    };
  },

removeConnection: async (userId, socketId) => {
  if (!userId || !socketId) {
    return {
      isLastConnection: false,
      isOnline: false
    };
  }

  const result = await presenceRedis.removeConnection(
    userId,
    socketId
  );
  if (!result.removed) {

    return {
      isLastConnection: false,
      isOnline: result.isOnline,
      userId,
      socketCount: result.socketCount
    };
  }

  if (result.isOnline) {
    return {
      isLastConnection: false,
      isOnline: true,
      userId,
      socketCount: result.socketCount
    };
  }

  const user = await userService.setOffline(userId);

  return {
    isLastConnection: true,
    isOnline: false,
    user
  };
},

  isOnline: async userId => {
    return await presenceRedis.isOnline(
      userId
    );
  },

  getOnlineUserIds: async () => {
    return await presenceRedis.getOnlineUserIds();
  }
};

module.exports = presenceService;