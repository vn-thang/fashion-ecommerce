import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../shared/components/Button';
import NotificationList from './NotificationList';

import { useNotification } from '../hooks/useNotification';
import { NotificationContext } from '../context/NotificationContext';
import { useAuth } from '../../auth/store/authContext';

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    loading,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotification();

  const { openNotification } = useContext(NotificationContext);

  const handleViewAll = () => {
    onClose();

    if (user?.role?.toUpperCase() === 'ADMIN') {
      navigate('/admin/notifications');
      return;
    }

    navigate('/notifications');
  };

  const handleOpenNotification = notification => {
    openNotification(notification);
  };

  return (
    <div className="fixed inset-x-2 top-[60px] z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-900/10 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[380px] sm:rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-gray-900">
            Thông báo
          </h2>

          {unreadCount > 0 && (
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="shrink-0 whitespace-nowrap"
          >
            Đọc tất cả
          </Button>
        )}
      </div>

      <div className="max-h-[calc(100vh-160px)] overflow-y-auto sm:max-h-[420px]">
        <NotificationList
          notifications={notifications.slice(0, 15)}
          loading={loading}
          onRead={markAsRead}
          onOpen={handleOpenNotification}
        />
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 p-2.5 sm:p-3">
        <button
          type="button"
          onClick={handleViewAll}
          className="w-full rounded-lg py-2.5 text-center text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;