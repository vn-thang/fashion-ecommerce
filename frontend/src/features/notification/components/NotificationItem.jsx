import React from 'react';

const getNotificationIcon = type => {
  switch (type) {
    case 'ORDER_CREATED':
    case 'ADMIN_NEW_ORDER':
      return (
        <svg
          className="h-5 w-5"
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
    case 'ADMIN_PAYMENT_SUCCESS':
      return (
        <svg
          className="h-5 w-5"
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
    case 'ADMIN_ORDER_CANCELLED':
      return (
        <svg
          className="h-5 w-5"
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

    case 'ADMIN_PAYMENT_CANCELLED':
      return (
        <svg
          className="h-5 w-5"
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

    case 'ADMIN_PAYMENT_FAILED':
    case 'PAYMENT_FAILED':
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v4m0 4h.01M10.29 3.86l-7.82 14a1 1 0 00.87 1.5h17.32a1 1 0 00.87-1.5l-7.82-14a1 1 0 00-1.74 0z"
          />
        </svg>
      );

    case 'ADMIN_LOW_STOCK':
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v4m0 4h.01M10.29 3.86l-7.82 14a1 1 0 00.87 1.5h17.32a1 1 0 00.87-1.5l-7.82-14a1 1 0 00-1.74 0z"
          />
        </svg>
      );

    case 'ADMIN_NEW_REVIEW':
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h8m-8 4h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );

    case 'FLASH_SALE':
      return (
        <svg
          className="h-5 w-5"
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
          className="h-5 w-5"
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
          className="h-5 w-5"
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

const formatDate = date => {
  return new Date(date).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const NotificationItem = ({
  notification,
  onRead,
  onOpen
}) => {
  const handleClick = async () => {
    if (!notification.isRead) {
      await onRead(notification.id);
    }

    onOpen(notification);
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex cursor-pointer gap-4 border-b border-gray-100 px-5 py-4 transition-colors ${
        notification.isRead
          ? 'bg-white hover:bg-gray-50'
          : 'bg-indigo-50/60 hover:bg-indigo-50'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          notification.isRead
            ? 'bg-gray-100 text-gray-500'
            : 'bg-indigo-100 text-indigo-600'
        }`}
      >
        {getNotificationIcon(notification.type)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-xs ${
              notification.isRead
                ? 'font-medium text-gray-700'
                : 'font-bold text-gray-900'
            }`}
          >
            {notification.title}
          </h3>

          {!notification.isRead && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
          {notification.content}
        </p>

        <p className="mt-2 text-xs text-gray-400">
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;