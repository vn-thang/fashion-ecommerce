const userService = require('../user/user.service');
const onlineUsers = new Map();

const presenceService = {
  addConnection: async (userId, socketId) => {
    if (!userId || !socketId) {
      return {
        isFirstConnection: false,
        isOnline: false
      };
    }

    let sockets = onlineUsers.get(userId);

    if (!sockets) {
      sockets = new Set();
      onlineUsers.set(userId, sockets);
    }

    const wasOffline = sockets.size === 0;

    sockets.add(socketId);
    if (wasOffline) {
      const user = await userService.setOnline(userId);

      return {
        isFirstConnection: true,
        isOnline: true,
        user
      };
    }

    return {
      isFirstConnection: false,
      isOnline: true,
      userId
    };
  },

  removeConnection: async (userId, socketId) => {
    if (!userId || !socketId) {
      return {
        isLastConnection: false,
        isOnline: false
      };
    }

    const sockets = onlineUsers.get(userId);

    if (!sockets) {
      return {
        isLastConnection: false,
        isOnline: false
      };
    }

    sockets.delete(socketId);
    if (sockets.size > 0) {
      return {
        isLastConnection: false,
        isOnline: true,
        userId
      };
    }
    onlineUsers.delete(userId);

    const user = await userService.setOffline(userId);

    return {
      isLastConnection: true,
      isOnline: false,
      user
    };
  },

  isOnline: userId => {
    const sockets = onlineUsers.get(userId);

    return !!sockets && sockets.size > 0;
  },

  getOnlineUserIds: () => {
    return Array.from(onlineUsers.keys());
  }
};

module.exports = presenceService;