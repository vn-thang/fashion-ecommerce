import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../../features/auth/store/authContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const useChatSocket = ({ 
  onNewMessage, 
  onRead,
  onMessageStatus,
  onUserOnline, 
  onUserOffline, 
  onTypingStart, 
  onTypingStop 
}) => {
  const { token } = useAuth();
  const socketRef = useRef(null);
const callbacksRef = useRef({ 
  onNewMessage, 
  onRead,
  onMessageStatus,
  onUserOnline, 
  onUserOffline, 
  onTypingStart, 
  onTypingStop 
});
  const [isConnected, setIsConnected] = useState(false);

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
  if (!token) {

    if (socketRef.current) {
    
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    return;
  }

  const socket = io(SOCKET_URL, {
    auth: {
      token
    },
    withCredentials: true,
    transports: ['websocket', 'polling']
  });

  socketRef.current = socket;

  socket.on('connect', () => {
   
    setIsConnected(true);
  });

  socket.on('disconnect', reason => {
   
    setIsConnected(false);
  });

  socket.on('connect_error', error => {
    console.error(
      '[CHAT SOCKET] CONNECT ERROR:',
      error.message
    );

    setIsConnected(false);
  });

  socket.on('message:new', message => {
    callbacksRef.current.onNewMessage?.(message);
  });

  socket.on('message:read', data => {
    callbacksRef.current.onRead?.(data);
  });

  socket.on('message:status', data => {
    callbacksRef.current.onMessageStatus?.(data);
  });

  socket.on('user:online', data => {
    callbacksRef.current.onUserOnline?.(data);
  });

  socket.on('user:offline', data => {
    callbacksRef.current.onUserOffline?.(data);
  });

  socket.on('typing:start', data => {
    callbacksRef.current.onTypingStart?.(data);
  });

  socket.on('typing:stop', data => {
    callbacksRef.current.onTypingStop?.(data);
  });

  return () => {
    socket.disconnect();

    if (socketRef.current === socket) {
      socketRef.current = null;
    }

    setIsConnected(false);
  };
}, [token]);

  const joinConversation = useCallback((conversationId, callback) => {
    const socket = socketRef.current;

    if (!socket?.connected) {
      callback?.({ success: false, message: 'Socket chưa kết nối!' });
      return;
    }

    socket.emit('conversation:join', { conversationId }, response => {
      if (!response?.success) {
        console.error('Join conversation failed:', response?.message);
      }
      callback?.(response);
    });
  }, []);

  const leaveConversation = useCallback((conversationId, callback) => {
    const socket = socketRef.current;

    if (!socket?.connected) {
      callback?.({ success: false, message: 'Socket chưa kết nối!' });
      return;
    }

    socket.emit('conversation:leave', { conversationId }, response => {
      if (!response?.success) {
        console.error('Leave conversation failed:', response?.message);
      }
      callback?.(response);
    });
  }, []);

  const sendMessage = useCallback((data, callback) => {
    const socket = socketRef.current;

    if (!socket?.connected) {
      callback?.({ success: false, message: 'Socket chưa kết nối!' });
      return;
    }

    socket.emit('message:send', data, callback);
  }, []);

  const markAsRead = useCallback((conversationId, callback) => {
    const socket = socketRef.current;

    if (!socket?.connected) {
      callback?.({ success: false, message: 'Socket chưa kết nối!' });
      return;
    }

    socket.emit('message:read', { conversationId }, callback);
  }, []);

  const markAsDelivered = useCallback(
  (messageId, conversationId, callback) => {
    const socket = socketRef.current;

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
  []
);

  const startTyping = useCallback(conversationId => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversationId) return;

    socket.emit('typing:start', { conversationId });
  }, []);

  const stopTyping = useCallback(conversationId => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversationId) return;

    socket.emit('typing:stop', { conversationId });
  }, []);

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