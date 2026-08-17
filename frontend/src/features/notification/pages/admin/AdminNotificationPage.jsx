import React, { useState } from 'react';

import Button from '../../../../shared/components/Button/index';
import Pagination from '../../../../shared/components/Pagination/index';

import NotificationList from '../../components/NotificationList';
import NotificationDetailModal from '../../components/NotificationDetailModal';
import { useNotification } from '../../hooks/useNotification';

const AdminNotificationPage = () => {
  const {
    loading,
    notifications,
    unreadCount,
    pagination,
    markAsRead,
    markAllAsRead,
    handlePageChange
  } = useNotification();

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const handleOpenNotification = notification => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  return (
    <>
      <div className="mx-auto max-w-[1000px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Thông báo quản trị
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Theo dõi các hoạt động và sự kiện quan trọng của hệ thống.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Đọc tất cả
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Tất cả thông báo
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : 'Bạn đã đọc tất cả thông báo'}
              </p>
            </div>

            <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-indigo-50 px-3 text-sm font-bold text-indigo-600">
              {pagination.totalItems}
            </div>
          </div>

          <NotificationList
            notifications={notifications}
            loading={loading}
            onRead={markAsRead}
            onOpen={handleOpenNotification}
          />

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Notification detail */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default AdminNotificationPage;