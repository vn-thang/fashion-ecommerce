import React from 'react';
import Modal from '../../../shared/components/Modal';

const formatDate = date => {
  if (!date) {
    return '';
  }
  return new Date(date).toLocaleString(
    'vi-VN',
    {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
  );
};
const getNotificationIcon = type => {
  switch (type) {
    case 'ORDER_CREATED':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10"
          />
        </svg>
      );
    case 'PAYMENT_SUCCESS':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'ORDER_CANCELLED':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    case 'FLASH_SALE':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );

    case 'COUPON':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 14l6-6m-7.5 1.5h.01M16.5 14.5h.01M19 5H5a2 2 0 00-2 2v2a2 2 0 012 2 2 2 0 010 4 2 2 0 01-2 2v1a2 2 0 002 2h14a2 2 0 002-2v-1a2 2 0 01-2-2 2 2 0 010-4 2 2 0 012-2V7a2 2 0 00-2-2z"
          />
        </svg>
      );

    default:
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      );
  }
};

const NotificationDetailModal = ({
  notification,
  onClose
}) => {
  return (
    <Modal
      isOpen={!!notification}
      onClose={onClose}
      title="Chi tiết thông báo"
      size="md"
    >
      {notification && (
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              {getNotificationIcon(
                notification.type
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-gray-900">
                {notification.title}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {formatDate(
                  notification.createdAt
                )}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-xs leading-7 text-gray-700">
              {notification.content}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Loại thông báo:</span>

            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-600">
              {notification.type}
            </span>
          </div>

        </div>
      )}
    </Modal>
  );
};

export default NotificationDetailModal;