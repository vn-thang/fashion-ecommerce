import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { chatAdminApi } from '../api/chatAdminApi';
import { useChatSocket } from './useChatSocket';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_PAGINATION = { currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 };
const TYPING_DELAY = 1500;

export const useAdminChat = currentUserId => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [messagePagination, setMessagePagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const currentConversationIdRef = useRef(null);
  const markAsReadRef = useRef(null);
  const markAsDeliveredRef = useRef(null);
  const typingTimersRef = useRef({});

useEffect(() => {
  const notificationConversationId =
    searchParams.get('conversationId');

  if (!notificationConversationId) return;

  const targetConversation =
    conversations.find(
      item => item.id === notificationConversationId
    );

  if (targetConversation) {
    setConversation(targetConversation);

    setSearchParams(
      prev => {
        prev.delete('conversationId');
        prev.delete('messageId');

        return prev;
      },
      { replace: true }
    );
  }
}, [
  searchParams,
  conversations,
  setSearchParams
]);

  useEffect(() => {
    currentConversationIdRef.current = conversation?.id || null;
  }, [conversation?.id]);

  const updateUserPresence = useCallback((data, isOnline) => {
    if (!data?.userId) return;

    const presence = {
      isOnline,
      lastSeenAt: isOnline ? null : data.lastSeenAt || new Date().toISOString()
    };

    setConversations(prev =>
      prev.map(item =>
        item.customer?.id === data.userId
          ? { ...item, customer: { ...item.customer, ...presence } }
          : item
      )
    );

    setConversation(prev =>
      prev?.customer?.id === data.userId
        ? { ...prev, customer: { ...prev.customer, ...presence } }
        : prev
    );
  }, []);

  const handleUserOnline = useCallback(data => updateUserPresence(data, true), [updateUserPresence]);
  const handleUserOffline = useCallback(data => updateUserPresence(data, false), [updateUserPresence]);

const handleRead = useCallback(data => {
  if (!data?.conversationId) return;
  if (
    currentConversationIdRef.current ===
    data.conversationId
  ) {
    setMessages(prev =>
      prev.map(message => {
        if (
          message.senderId !== data.userId &&
          message.status !== 'READ'
        ) {
          return {
            ...message,
            status: 'READ'
          };
        }

        return message;
      })
    );
  }

  setConversations(prev =>
    prev.map(item =>
      item.id === data.conversationId
        ? {
            ...item,
            unreadCount: 0,
            participants:
              item.participants?.map(participant =>
                participant.userId === data.userId
                  ? {
                      ...participant,
                      lastReadAt: data.lastReadAt
                    }
                  : participant
              )
          }
        : item
    )
  );

  setConversation(prev =>
    prev?.id === data.conversationId
      ? {
          ...prev,
          unreadCount: 0
        }
      : prev
  );
}, []);

  const handleMessageStatus = useCallback(data => {
  if (!data?.conversationId || !data?.messageId || !data?.status) {
    return;
  }
  if (currentConversationIdRef.current !== data.conversationId) {
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
}, []);

const handleTypingStartEvent = useCallback(
  data => {
    if (!data?.conversationId || !data?.userId) return;
    if (data.userId === currentUserId) return;

    setTypingUsers(prev => ({
      ...prev,
      [data.userId]: {
        userId: data.userId,
        conversationId: data.conversationId
      }
    }));

    clearTimeout(typingTimersRef.current[data.userId]);

    typingTimersRef.current[data.userId] = setTimeout(() => {
      setTypingUsers(prev => {
        const next = { ...prev };
        delete next[data.userId];
        return next;
      });
    }, TYPING_DELAY);
  },
  [currentUserId]
);

const handleTypingStopEvent = useCallback(data => {
  if (!data?.userId) return;
  if (data.userId === currentUserId) return;

  clearTimeout(typingTimersRef.current[data.userId]);

  setTypingUsers(prev => {
    const next = { ...prev };
    delete next[data.userId];
    return next;
  });
}, [currentUserId]);

const handleNewMessage = useCallback(message => {
  if (!message?.id || !message?.conversationId) return;

  const currentConversationId =
    currentConversationIdRef.current;

  const isCurrentConversation =
    currentConversationId === message.conversationId;

  const isMine =
    message.senderId === currentUserId;
  if (
    !isMine &&
    isCurrentConversation &&
    markAsDeliveredRef.current
  ) {
    markAsDeliveredRef.current(
      message.id,
      message.conversationId,
      response => {
        if (!response?.success) {
          console.error(
            'Mark delivered failed:',
            response?.message
          );
        }
      }
    );
  }
  if (isCurrentConversation) {
    setMessages(prev =>
      prev.some(item => item.id === message.id)
        ? prev
        : [...prev, message]
    );
  }

  setTypingUsers(prev => {
    const next = { ...prev };
    delete next[message.senderId];
    return next;
  });

  setConversations(prev =>
    prev.map(item => {
      if (item.id !== message.conversationId) {
        return item;
      }

      const currentUnreadCount =
        Number(item.unreadCount) || 0;

      let unreadCount = currentUnreadCount;

      if (!isMine && !isCurrentConversation) {
        unreadCount += 1;
      }

      if (isCurrentConversation) {
        unreadCount = 0;
      }
      return {
        ...item,
        lastMessageAt: message.createdAt,
        messages: [
          {
            id: message.id,
            content: message.content,
            type: message.type,
            status: message.status,
            senderId: message.senderId,
            attachmentUrl: message.attachmentUrl,
            attachmentName: message.attachmentName,
            createdAt: message.createdAt
          }
        ],
        unreadCount
      };
    })
  );
  if (
    isCurrentConversation &&
    !isMine &&
    markAsReadRef.current
  ) {
    markAsReadRef.current(
      message.conversationId,
      response => {
        if (!response?.success) {
          console.error(
            'Auto mark read failed:',
            response?.message
          );
        }
      }
    );
  }
}, [currentUserId]);

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
    onTypingStart: handleTypingStartEvent,
    onTypingStop: handleTypingStopEvent
  });

  useEffect(() => {
    markAsReadRef.current = markAsRead;
  }, [markAsRead]);

  useEffect(() => {
  markAsDeliveredRef.current = markAsDelivered;
}, [markAsDelivered]);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      const res = await chatAdminApi.getAllConversations(filters);
      if (!res.success) return;

      setConversations(res.data.conversations || []);
      setPagination(res.data.pagination || DEFAULT_PAGINATION);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không tải được danh sách cuộc trò chuyện.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMessages = useCallback(async (conversationId, page = 1) => {
    try {
      setLoading(true);

      const res = await chatAdminApi.getMessages(conversationId, { page, limit: 20 });
      if (!res.success) return;

      setMessages(res.data.messages || []);
      setMessagePagination(res.data.pagination || DEFAULT_PAGINATION);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không tải được tin nhắn.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

useEffect(() => {
  if (!conversation?.id || !isConnected) return;

  console.log(
    '[AdminChat] Joining conversation:',
    conversation.id
  );

  setMessages([]);
  loadMessages(conversation.id);

  joinConversation(conversation.id);

  return () => {
    console.log(
      '[AdminChat] Leaving conversation:',
      conversation.id
    );

    stopTyping(conversation.id);
    leaveConversation(conversation.id);
  };
}, [
  conversation?.id,
  isConnected,
  loadMessages,
  joinConversation,
  leaveConversation,
  stopTyping
]);

  const selectConversation = useCallback(conversationItem => {
    setConversation(conversationItem);
  }, []);

  const handleTypingStart = useCallback(() => {
    if (!conversation?.id) return;

    startTyping(conversation.id);

    clearTimeout(typingTimersRef.current[currentUserId]);

    typingTimersRef.current[currentUserId] = setTimeout(() => {
      stopTyping(conversation.id);
    }, TYPING_DELAY);
  }, [conversation?.id, currentUserId, startTyping, stopTyping]);

  const handleTypingStop = useCallback(() => {
    if (!conversation?.id) return;

    clearTimeout(typingTimersRef.current[currentUserId]);
    stopTyping(conversation.id);
  }, [conversation?.id, currentUserId, stopTyping]);

  const sendMessage = useCallback(content => {
    return new Promise(resolve => {
      if (!conversation?.id || !content?.trim()) {
        resolve(false);
        return;
      }

      handleTypingStop();
      setSending(true);

      socketSendMessage({
        conversationId: conversation.id,
        type: 'TEXT',
        content: content.trim()
      }, response => {
        setSending(false);

        if (!response?.success) {
          toast.error(response?.message || 'Gửi tin nhắn thất bại.');
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }, [conversation?.id, socketSendMessage, handleTypingStop]);

  const sendAttachment = useCallback(async file => {
    if (!conversation?.id || !file) return false;

    try {
      handleTypingStop();
      setUploading(true);

      const uploadResponse = await chatAdminApi.uploadAttachment(file);

      if (!uploadResponse?.success) {
        toast.error(uploadResponse?.message || 'Tải tập tin thất bại.');
        return false;
      }

      const attachment = uploadResponse.data;

      return await new Promise(resolve => {
        socketSendMessage({
          conversationId: conversation.id,
          type: attachment.type,
          content: null,
          attachmentUrl: attachment.attachmentUrl,
          attachmentName: attachment.attachmentName
        }, response => {
          if (!response?.success) {
            toast.error(response?.message || 'Gửi tập tin thất bại.');
            resolve(false);
            return;
          }

          resolve(true);
        });
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Tải tập tin thất bại.');
      return false;
    } finally {
      setUploading(false);
    }
  }, [conversation?.id, socketSendMessage, handleTypingStop]);

  const readConversation = useCallback(() => {
    if (!conversation?.id) return;

    const conversationId = conversation.id;

    markAsRead(conversationId, response => {
      if (!response?.success) {
        console.error('Mark read failed:', response?.message);
        return;
      }

      setConversations(prev =>
        prev.map(item =>
          item.id === conversationId
            ? {
                ...item,
                unreadCount: 0,
                participants: item.participants?.map(participant =>
                  participant.userId === response.data.userId
                    ? { ...participant, lastReadAt: response.data.lastReadAt }
                    : participant
                )
              }
            : item
        )
      );

      setConversation(prev =>
        prev?.id === conversationId ? { ...prev, unreadCount: 0 } : prev
      );
    });
  }, [conversation?.id, markAsRead]);

  const handlePageChange = useCallback(page => {
    if (page < 1 || page > pagination.totalPages || page === filters.page) return;

    setFilters(prev => ({ ...prev, page }));
  }, [filters.page, pagination.totalPages]);

  const handleSearch = useCallback(search => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  }, []);

  useEffect(() => {
    return () => {
      Object.values(typingTimersRef.current).forEach(clearTimeout);
    };
  }, []);

  return {
    conversations,
    conversation,
    messages,
    pagination,
    messagePagination,
    loading,
    sending,
    uploading,
    typingUsers,
    selectConversation,
    sendMessage,
    sendAttachment,
    readConversation,
    handlePageChange,
    handleSearch,
    loadConversations,
    loadMessages,
    handleTypingStart,
    handleTypingStop
  };
};