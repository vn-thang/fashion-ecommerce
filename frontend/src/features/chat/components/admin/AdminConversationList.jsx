import React, { useState } from 'react';
import Input from '../../../../shared/components/Input';
import Pagination from '../../../../shared/components/Pagination';

const formatTime = date => {
  if (!date) return '';

  const value = new Date(date);
  const now = new Date();

  if (value.toDateString() === now.toDateString()) {
    return value.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (value.toDateString() === yesterday.toDateString()) {
    return 'Hôm qua';
  }

  return value.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  });
};

const getInitial = name =>
  name?.trim()?.charAt(0)?.toUpperCase() || 'C';

const getLastMessagePreview = message => {
  if (!message) return 'Chưa có tin nhắn';
  if (message.content?.trim()) return message.content;

  if (message.type === 'IMAGE') return 'Đã gửi một ảnh';
  if (message.type === 'FILE') return 'Đã gửi một file';
  if (message.attachmentUrl) return 'Đã gửi một file';

  return 'Chưa có tin nhắn';
};

const AdminConversationList = ({
  conversations = [],
  selectedId,
  pagination,
  loading,
  onSelect,
  onSearch,
  onPageChange
}) => {
  const [search, setSearch] = useState('');

  const handleSearch = e => {
    e.preventDefault();
    onSearch(search.trim());
  };

return (
  <aside className="flex h-full w-full shrink-0 flex-col border-r border-gray-100 bg-white lg:w-[350px]">
    <div className="border-b border-gray-100 px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-gray-800 sm:text-sm">
            Tin nhắn
          </h2>

          <p className="mt-0.5 text-[11px] text-gray-400 sm:text-xs">
            Hỗ trợ khách hàng
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-9 sm:w-9">
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSearch}>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm khách hàng..."
            className="w-full pl-9"
          />
        </div>
      </form>
    </div>

    <div className="min-h-0 flex-1 overflow-y-auto">
      {loading && !conversations.length ? (
        <div className="flex h-32 items-center justify-center px-4 text-center text-xs text-gray-400">
          Đang tải cuộc trò chuyện...
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <p className="text-xs font-medium text-gray-600">
            Không có cuộc trò chuyện
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Chưa có khách hàng nào nhắn tin.
          </p>
        </div>
      ) : (
        <div className="py-1">
          {conversations.map(item => {
            const lastMessage = item.messages?.[0];
            const isSelected = selectedId === item.id;
            const unreadCount = Number(item.unreadCount) || 0;
            const hasUnread = unreadCount > 0;
            const isOnline = Boolean(item.customer?.isOnline);

            const isLastMessageMine =
              lastMessage?.senderId &&
              item.customer?.id &&
              lastMessage.senderId !== item.customer.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`relative flex w-full gap-3 px-4 py-3 text-left transition-colors sm:px-4 ${
                  isSelected
                    ? 'bg-indigo-50'
                    : hasUnread
                      ? 'bg-indigo-50/40 hover:bg-indigo-50'
                      : 'hover:bg-gray-50'
                }`}
              >
                {isSelected && (
                  <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-indigo-600" />
                )}

                <div className="relative shrink-0">
                  {item.customer?.avatarUrl ? (
                    <img
                      src={item.customer.avatarUrl}
                      alt={item.customer.fullName || 'Customer'}
                      className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 sm:h-12 sm:w-12">
                      {getInitial(item.customer?.fullName)}
                    </div>
                  )}

                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`min-w-0 truncate text-xs ${
                        hasUnread
                          ? 'font-bold text-gray-900'
                          : isSelected
                            ? 'font-semibold text-indigo-700'
                            : 'font-semibold text-gray-800'
                      }`}
                    >
                      {item.customer?.fullName || 'Khách hàng'}
                    </p>

                    <span
                      className={`shrink-0 text-[10px] ${
                        hasUnread
                          ? 'font-semibold text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {formatTime(item.lastMessageAt)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <p
                      className={`min-w-0 flex-1 truncate text-xs ${
                        hasUnread
                          ? 'font-semibold text-gray-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {isLastMessageMine && (
                        <span className="font-medium text-gray-500">
                          Bạn:{' '}
                        </span>
                      )}

                      {getLastMessagePreview(lastMessage)}
                    </p>

                    {hasUnread && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>

    <div className="shrink-0 border-t border-gray-100 bg-white">
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  </aside>
);
};

export default AdminConversationList;