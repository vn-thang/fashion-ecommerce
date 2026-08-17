import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { notificationApi } from '../api/notificationApi';
import { useFCM } from '../hooks/useFCM';
import NotificationDetailModal from '../components/NotificationDetailModal';

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 10
};

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [pagination, setPagination] = useState(
    DEFAULT_PAGINATION
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10
  });
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const { token: fcmToken, loading: fcmLoading, registerToken } = useFCM(true);
  const loadNotifications = useCallback(
    async (customFilters = filters) => {
      try {
        setLoading(true);
        const res = await notificationApi.getAll(
          customFilters
        );
        if (res.success) {
          setNotifications(
            res.data?.notifications || []
          );
          setPagination(
            res.data?.pagination ||
              DEFAULT_PAGINATION
          );
        }
      } catch (error) {
        console.error(
          'Load notifications error:',
          error
        );

        toast.error(
          error.response?.data?.message ||
            'Không tải được danh sách thông báo.'
        );
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );
  const loadUnreadCount = useCallback(async () => {
    try {
      const res =
        await notificationApi.getUnreadCount();

      if (res.success) {
        setUnreadCount(
          res.data?.unreadCount || 0
        );
      }
    } catch (error) {
      console.error(
        'Load unread count error:',
        error
      );
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  const markAsRead = useCallback(
    async id => {
      try {
        const notification =
          notifications.find(
            item => item.id === id
          );
        if (
          !notification ||
          notification.isRead
        ) {
          return notification;
        }
        const res =
          await notificationApi.markAsRead(id);

        if (!res.success) {
          return null;
        }
        setNotifications(prev =>
          prev.map(item =>
            item.id === id
              ? {
                  ...item,
                  isRead: true
                }
              : item
          )
        );
        setUnreadCount(prev =>
          Math.max(0, prev - 1)
        );
        return {
          ...notification,
          isRead: true
        };
      } catch (error) {
        console.error(
          'Mark notification as read error:',
          error
        );

        toast.error(
          error.response?.data?.message ||
            'Không thể đánh dấu thông báo đã đọc.'
        );

        return null;
      }
    },
    [notifications]
  );
  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      const res =
        await notificationApi.markAllAsRead();

      if (!res.success) {
        return;
      }
      setNotifications(prev =>
        prev.map(item => ({
          ...item,
          isRead: true
        }))
      );
      setUnreadCount(0);
      toast.success(
        'Đã đánh dấu tất cả thông báo là đã đọc.'
      );
    } catch (error) {
      console.error(
        'Mark all notifications as read error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Không thể đánh dấu tất cả thông báo.'
      );
    }
  }, [unreadCount]);

  const openNotification = useCallback(
    notification => {
      setSelectedNotification(notification);
    },
    []
  );

  const closeNotification = useCallback(() => {
    setSelectedNotification(null);
  }, []);

  const handlePageChange = useCallback(
    page => {
      if (
        page === filters.page ||
        page < 1 ||
        page > pagination.totalPages
      ) {
        return;
      }

      setFilters(prev => ({
        ...prev,
        page
      }));
    },
    [filters.page, pagination.totalPages]
  );

  const value = {
    loading,
    notifications,
    unreadCount,

    pagination,
    filters,

    markAsRead,
    markAllAsRead,

    loadNotifications,
    loadUnreadCount,

    handlePageChange,

    selectedNotification,
    openNotification,
    closeNotification,
    fcmToken,
    fcmLoading,
    registerToken
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <NotificationDetailModal
        notification={selectedNotification}
        onClose={closeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotificationContext must be used inside NotificationProvider'
    );
  }

  return context;
};