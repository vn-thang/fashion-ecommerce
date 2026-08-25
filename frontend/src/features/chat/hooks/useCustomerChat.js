import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { chatApi } from '../api/chatApi';
import { useChatSocket } from './useChatSocket';

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 20
};

const TYPING_DELAY = 1500;

export const useCustomerChat = ({ currentUserId, isOpen = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminPresence, setAdminPresence] = useState({
    isOnline: false,
    lastSeenAt: null
  });
  const [isAdminTyping, setIsAdminTyping] = useState(false);

  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const notificationConversationId =
    searchParams.get('conversationId');

  useEffect(() => {
    if (!notificationConversationId) return;
    setSearchParams(
      prev => {
        prev.delete('conversationId');
        prev.delete('messageId');
        return prev;
      },
      { replace: true }
    );
  }, [
    notificationConversationId,
    setSearchParams
  ]);

  const markAsDeliveredRef = useRef(null);

const handleNewMessage = useCallback(
  message => {
    if (!message?.id || !message?.conversationId) {
      return;
    }

    const isMine =
      message.senderId === currentUserId;

    setMessages(prev =>
      prev.some(item => item.id === message.id)
        ? prev
        : [...prev, message]
    );

if (!isMine) {
  if (!isOpen) {
    setUnreadCount(prev => prev + 1);
  }

  setIsAdminTyping(false);

  markAsDeliveredRef.current?.(
    message.id,
    message.conversationId,
    response => {
      if (!response?.success) {
        console.error(
          '[CustomerChat] Mark delivered failed:',
          response?.message
        );
      }
    }
  );
}
  },
  [currentUserId, isOpen]
);

  const handleRead = useCallback(
    data => {
      if (data?.conversationId !== conversation?.id) return;

      if (data?.userId === currentUserId) {
        setUnreadCount(0);
      }
    },
    [conversation?.id, currentUserId]
  );
  
  const handleMessageStatus = useCallback(data => {
  if (!data?.conversationId || !data?.messageId || !data?.status) {
    return;
  }

  if (data.conversationId !== conversation?.id) {
    return;
  }

  setMessages(prev =>
    prev.map(message =>
      message.id === data.messageId
        ? {
            ...message,
            status: data.status
          }
        : message
    )
  );
}, [conversation?.id]);

  const handleUserOnline = useCallback(
    data => {
      if (
        !data?.userId ||
        data.userId === currentUserId ||
        !conversation?.participants
      ) {
        return;
      }

      const isParticipant =
        conversation.participants.some(
          participant =>
            participant.userId === data.userId
        );

      if (!isParticipant) return;

      setAdminPresence({
        isOnline: true,
        lastSeenAt: null
      });
    },
    [conversation?.participants, currentUserId]
  );

  const handleUserOffline = useCallback(
    data => {
      if (
        !data?.userId ||
        data.userId === currentUserId ||
        !conversation?.participants
      ) {
        return;
      }

      const isParticipant =
        conversation.participants.some(
          participant =>
            participant.userId === data.userId
        );

      if (!isParticipant) return;

      setAdminPresence({
        isOnline: false,
        lastSeenAt: data.lastSeenAt || null
      });

      setIsAdminTyping(false);
    },
    [conversation?.participants, currentUserId]
  );

  const handleTypingStart = useCallback(
    data => {
      if (data?.conversationId !== conversation?.id) return;
      if (data?.userId === currentUserId) return;

      setIsAdminTyping(true);
    },
    [conversation?.id, currentUserId]
  );

  const handleTypingStop = useCallback(
    data => {
      if (data?.conversationId !== conversation?.id) return;
      if (data?.userId === currentUserId) return;

      setIsAdminTyping(false);
    },
    [conversation?.id, currentUserId]
  );

const {
  joinConversation,
  leaveConversation,
  sendMessage: socketSendMessage,
  markAsDelivered,
  markAsRead,
  startTyping,
  stopTyping,
  isConnected
} = useChatSocket({
  onNewMessage: handleNewMessage,
  onRead: handleRead,
  onMessageStatus: handleMessageStatus,
  onUserOnline: handleUserOnline,
  onUserOffline: handleUserOffline,
  onTypingStart: handleTypingStart,
  onTypingStop: handleTypingStop
});

useEffect(() => {
  markAsDeliveredRef.current = markAsDelivered;
}, [markAsDelivered]);

  const loadConversation = useCallback(
    async () => {
      try {
        setLoading(true);

        const res = await chatApi.getConversation();

        if (!res.success) return;

        setConversation(res.data);

        const admin =
          res.data?.participants?.find(
            participant =>
              participant.userId !== currentUserId
          );

        if (admin) {
          setAdminPresence({
            isOnline:
              admin.user?.isOnline ??
              admin.isOnline ??
              false,
            lastSeenAt:
              admin.user?.lastSeenAt ??
              admin.lastSeenAt ??
              null
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Không tải được cuộc trò chuyện.'
        );
      } finally {
        setLoading(false);
      }
    },
    [currentUserId]
  );

  const loadMessages = useCallback(
    async conversationId => {
      try {
        setLoading(true);

        const res =
          await chatApi.getMessages(
            conversationId,
            {
              page: 1,
              limit: 20
            }
          );

        if (!res.success) return;

const loadedMessages =
  res.data.messages || [];

setMessages(loadedMessages);

setPagination(
  res.data.pagination ||
    DEFAULT_PAGINATION
);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Không tải được tin nhắn.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    if (conversation?.id) {
      loadMessages(conversation.id);
    }
  }, [conversation?.id, loadMessages]);

  useEffect(() => {
    if (!conversation?.id || !isConnected) return;

    joinConversation(conversation.id);

    return () => {
      clearTimeout(typingTimerRef.current);
      isTypingRef.current = false;

      stopTyping(conversation.id);
      leaveConversation(conversation.id);
    };
  }, [
    conversation?.id,
    isConnected,
    joinConversation,
    leaveConversation,
    stopTyping
  ]);

  useEffect(() => {
  if (
    !conversation?.id ||
    !isConnected ||
    !messages.length
  ) {
    return;
  }

  const undeliveredMessages = messages.filter(
    message =>
      message.senderId !== currentUserId &&
      message.status === 'SENT'
  );

  undeliveredMessages.forEach(message => {
    markAsDelivered(
      message.id,
      conversation.id,
      response => {
        if (!response?.success) {
          console.error(
            '[CustomerChat] Mark delivered failed:',
            response?.message
          );
        }
      }
    );
  });
}, [
  conversation?.id,
  isConnected,
  messages,
  currentUserId,
  markAsDelivered
]);

  const readConversation = useCallback(() => {
    if (!conversation?.id || !isConnected) return;

    markAsRead(
      conversation.id,
      response => {
        if (!response?.success) {
          console.error(
            'Mark read failed:',
            response?.message
          );
          return;
        }

        setUnreadCount(0);
      }
    );
  }, [
    conversation?.id,
    isConnected,
    markAsRead
  ]);

  useEffect(() => {
    if (isOpen) {
      readConversation();
    }
  }, [isOpen, readConversation]);

  const handleTypingStartInput = useCallback(() => {
    if (!conversation?.id || !isConnected) return;

    clearTimeout(typingTimerRef.current);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      startTyping(conversation.id);
    }

    typingTimerRef.current =
      setTimeout(() => {
        isTypingRef.current = false;
        stopTyping(conversation.id);
      }, TYPING_DELAY);
  }, [
    conversation?.id,
    isConnected,
    startTyping,
    stopTyping
  ]);

  const handleTypingStopInput = useCallback(() => {
    if (!conversation?.id || !isConnected) return;

    clearTimeout(typingTimerRef.current);

    if (!isTypingRef.current) return;

    isTypingRef.current = false;
    stopTyping(conversation.id);
  }, [
    conversation?.id,
    isConnected,
    stopTyping
  ]);

  const sendMessage = useCallback(
    content => {
      return new Promise(resolve => {
        if (
          !conversation?.id ||
          !content?.trim()
        ) {
          resolve(false);
          return;
        }

        handleTypingStopInput();
        setSending(true);

        socketSendMessage(
          {
            conversationId: conversation.id,
            type: 'TEXT',
            content: content.trim()
          },
          response => {
            setSending(false);

            if (!response?.success) {
              toast.error(
                response?.message ||
                  'Gửi tin nhắn thất bại.'
              );
              resolve(false);
              return;
            }

            resolve(true);
          }
        );
      });
    },
    [
      conversation?.id,
      socketSendMessage,
      handleTypingStopInput
    ]
  );

  const sendAttachment = useCallback(
    async file => {
      if (!conversation?.id || !file) {
        return false;
      }

      try {
        handleTypingStopInput();
        setSending(true);

        const uploadResponse =
          await chatApi.uploadAttachment(file);

        if (!uploadResponse?.success) {
          toast.error(
            uploadResponse?.message ||
              'Tải tập tin thất bại.'
          );
          return false;
        }

        const attachment =
          uploadResponse.data;

        return await new Promise(resolve => {
          socketSendMessage(
            {
              conversationId:
                conversation.id,
              type: attachment.type,
              content: null,
              attachmentUrl:
                attachment.attachmentUrl,
              attachmentName:
                attachment.attachmentName
            },
            response => {
              if (!response?.success) {
                toast.error(
                  response?.message ||
                    'Gửi tập tin thất bại.'
                );
                resolve(false);
                return;
              }

              resolve(true);
            }
          );
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Tải tập tin thất bại.'
        );
        return false;
      } finally {
        setSending(false);
      }
    },
    [
      conversation?.id,
      socketSendMessage,
      handleTypingStopInput
    ]
  );

  useEffect(() => {
    return () => {
      clearTimeout(typingTimerRef.current);
    };
  }, []);

  return {
    conversation,
    messages,
    pagination,
    loading,
    sending,
    unreadCount,
    isConnected,
    adminPresence,
    isAdminTyping,
    sendMessage,
    sendAttachment,
    readConversation,
    loadMessages,
    handleTypingStart:
      handleTypingStartInput,
    handleTypingStop:
      handleTypingStopInput
  };
};