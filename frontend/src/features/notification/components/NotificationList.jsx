import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications, loading, onRead, onOpen }) => {
  if (loading) {
    return (
      <div className="divide-y divide-gray-100">
        {[1, 2, 3].map(item => (
          <div key={item} className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-5">
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200 sm:h-10 sm:w-10" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/2 max-w-[160px] animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/3 max-w-[100px] animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px] sm:px-5">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 sm:h-14 sm:w-14">
          <svg
            className="h-6 w-6 sm:h-7 sm:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>

        <p className="text-sm font-medium text-gray-600">
          Chưa có thông báo
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Các thông báo mới sẽ xuất hiện ở đây.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

export default NotificationList;