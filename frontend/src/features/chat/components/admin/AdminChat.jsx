import React, { useEffect, useState } from 'react';
import ChatMessageList from '../ChatMessageList';
import ChatInput from '../ChatInput';
import { useAdminChat } from '../../hooks/useAdminChat';
import AdminConversationList from './AdminConversationList';

const formatLastSeen = date => {
  if (!date) return 'Không rõ';

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return 'Không rõ';
  const diff = Date.now() - value.getTime();
  if (diff < 60 * 1000) return 'Vừa hoạt động';
  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 60) {
    return `Hoạt động ${minutes} phút trước`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hoạt động ${hours} giờ trước`;
  }
  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `Hoạt động ${days} ngày trước`;
  }
  return value.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const AdminChat = ({ currentUserId }) => {
  const {
    conversations,
    conversation,
    messages,
    pagination,
    loading,
    sending,
    uploading,
    typingUsers,
    selectConversation,
    sendMessage,
    sendAttachment,
    handleTypingStart,
    handleTypingStop,
    readConversation,
    handlePageChange,
    handleSearch
  } = useAdminChat(currentUserId);

  const [showConversationList, setShowConversationList] = useState(true);
  useEffect(() => {
    if (!conversation?.id) return;

    readConversation();
  }, [conversation?.id, readConversation]);

  const handleSelectConversation = item => {
    selectConversation(item);
    setShowConversationList(false);
  };

  const handleBackToList = () => {
    setShowConversationList(true);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[500px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`
          h-full w-full shrink-0
          lg:block lg:w-[350px]
          ${showConversationList ? 'block' : 'hidden'}
        `}
      >
        <AdminConversationList
          conversations={conversations}
          selectedId={conversation?.id}
          pagination={pagination}
          loading={loading}
          onSelect={handleSelectConversation}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
        />
      </div>
      <section
        className={`
          min-w-0 flex-1 flex-col
          lg:flex
          ${showConversationList ? 'hidden' : 'flex'}
        `}
      >
        {!conversation ? (
          <EmptyChat />
        ) : (
          <>
            <ChatHeader
              conversation={conversation}
              onBack={handleBackToList}
            />

            <ChatMessageList
              messages={messages}
              currentUserId={currentUserId}
              loading={loading}
              otherUser={conversation.customer}
              typingUsers={typingUsers}
            />

            {Object.keys(typingUsers).length > 0 && (
              <div className="shrink-0 px-4 pb-2 text-xs text-gray-400 sm:px-5">
                Khách hàng đang nhập...
              </div>
            )}

            <ChatInput
              onSend={sendMessage}
              onSendAttachment={sendAttachment}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              sending={sending}
              uploading={uploading}
            />
          </>
        )}
      </section>
    </div>
  );
};

const ChatHeader = ({ conversation, onBack }) => {
  const customer = conversation.customer;
  const isOnline = customer?.isOnline;

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-3 py-3 sm:px-5 sm:py-3.5">

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label="Quay lại danh sách"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="relative shrink-0">
          {customer?.avatarUrl ? (
            <img
              src={customer.avatarUrl}
              alt={customer.fullName || 'Customer'}
              className="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 sm:h-11 sm:w-11">
              {customer?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'C'}
            </div>
          )}

          <span
            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white sm:h-3 sm:w-3 ${
              isOnline ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-800">
            {customer?.fullName || 'Khách hàng'}
          </h2>

          <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />

            <p className="truncate text-[11px] text-gray-400 sm:text-xs">
              {isOnline
                ? 'Đang hoạt động'
                : formatLastSeen(customer?.lastSeenAt)}
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Thông tin khách hàng"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            d="M12 10v6m0-9h.01"
          />
        </svg>
      </button>
    </header>
  );
};

const EmptyChat = () => (
  <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 text-center">

    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 sm:h-20 sm:w-20">
      <svg
        className="h-8 w-8 sm:h-9 sm:w-9"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <h2 className="text-base font-bold text-gray-700 sm:text-lg">
      Tin nhắn hỗ trợ
    </h2>

    <p className="mt-1 max-w-sm text-xs leading-6 text-gray-400 sm:text-sm">
      Chọn một cuộc trò chuyện bên trái để bắt đầu hỗ trợ khách hàng.
    </p>
  </div>
);

export default AdminChat;