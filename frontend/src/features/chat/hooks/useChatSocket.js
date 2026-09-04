import { useCallback, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export const useChatSocket = ({
  onNewMessage,
  onRead,
  onMessageStatus,
  onUserOnline,
  onUserOffline,
  onTypingStart,
  onTypingStop
}) => {
  const {
    socket,
    isConnected
  } = useSocket();

  const callbacksRef = useRef({
    onNewMessage,
    onRead,
    onMessageStatus,
    onUserOnline,
    onUserOffline,
    onTypingStart,
    onTypingStop
  });

  useEffect(() => {
    callbacksRef.current = {
      onNewMessage,
      onRead,
      onMessageStatus,
      onUserOnline,
      onUserOffline,
      onTypingStart,
      onTypingStop
    };
  }, [
    onNewMessage,
    onRead,
    onMessageStatus,
    onUserOnline,
    onUserOffline,
    onTypingStart,
    onTypingStop
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = message => {
      callbacksRef.current.onNewMessage?.(message);
    };

    const handleRead = data => {
      callbacksRef.current.onRead?.(data);
    };

    const handleMessageStatus = data => {
      callbacksRef.current.onMessageStatus?.(data);
    };

    const handleUserOnline = data => {
      callbacksRef.current.onUserOnline?.(data);
    };

    const handleUserOffline = data => {
      callbacksRef.current.onUserOffline?.(data);
    };

    const handleTypingStart = data => {
      callbacksRef.current.onTypingStart?.(data);
    };

    const handleTypingStop = data => {
      callbacksRef.current.onTypingStop?.(data);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('message:read', handleRead);
    socket.on(
      'message:status',
      handleMessageStatus
    );
    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);
    socket.on(
      'typing:start',
      handleTypingStart
    );
    socket.on(
      'typing:stop',
      handleTypingStop
    );

    return () => {
      socket.off(
        'message:new',
        handleNewMessage
      );
      socket.off(
        'message:read',
        handleRead
      );
      socket.off(
        'message:status',
        handleMessageStatus
      );
      socket.off(
        'user:online',
        handleUserOnline
      );
      socket.off(
        'user:offline',
        handleUserOffline
      );
      socket.off(
        'typing:start',
        handleTypingStart
      );
      socket.off(
        'typing:stop',
        handleTypingStop
      );
    };
  }, [socket]);

  const joinConversation = useCallback(
    (conversationId, callback) => {
      if (!socket?.connected) {
        callback?.({
          success: false,
          message: 'Socket chưa kết nối!'
        });
        return;
      }

      socket.emit(
        'conversation:join',
        { conversationId },
        callback
      );
    },
    [socket]
  );

  const leaveConversation = useCallback(
    (conversationId, callback) => {
      if (!socket?.connected) {
        callback?.({
          success: false,
          message: 'Socket chưa kết nối!'
        });
        return;
      }

      socket.emit(
        'conversation:leave',
        { conversationId },
        callback
      );
    },
    [socket]
  );

  const sendMessage = useCallback(
    (data, callback) => {
      if (!socket?.connected) {
        callback?.({
          success: false,
          message: 'Socket chưa kết nối!'
        });
        return;
      }

      socket.emit(
        'message:send',
        data,
        callback
      );
    },
    [socket]
  );

  const markAsRead = useCallback(
    (conversationId, callback) => {
      if (!socket?.connected) {
        callback?.({
          success: false,
          message: 'Socket chưa kết nối!'
        });
        return;
      }

      socket.emit(
        'message:read',
        { conversationId },
        callback
      );
    },
    [socket]
  );

  const markAsDelivered = useCallback(
    (
      messageId,
      conversationId,
      callback
    ) => {
      if (!socket?.connected) {
        callback?.({
          success: false,
          message: 'Socket chưa kết nối!'
        });
        return;
      }

      socket.emit(
        'message:delivered',
        {
          messageId,
          conversationId
        },
        callback
      );
    },
    [socket]
  );

  const startTyping = useCallback(
    conversationId => {
      if (
        !socket?.connected ||
        !conversationId
      ) {
        return;
      }

      socket.emit('typing:start', {
        conversationId
      });
    },
    [socket]
  );

  const stopTyping = useCallback(
    conversationId => {
      if (
        !socket?.connected ||
        !conversationId
      ) {
        return;
      }

      socket.emit('typing:stop', {
        conversationId
      });
    },
    [socket]
  );

  return {
    joinConversation,
    leaveConversation,
    sendMessage,
    markAsDelivered,
    markAsRead,
    startTyping,
    stopTyping,
    isConnected
  };
};