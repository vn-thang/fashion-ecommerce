import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!conversation?.id) return;
    readConversation();
  }, [conversation?.id, readConversation]);

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[620px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <AdminConversationList
        conversations={conversations}
        selectedId={conversation?.id}
        pagination={pagination}
        loading={loading}
        onSelect={selectConversation}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        {!conversation ? (
          <EmptyChat />
        ) : (
          <>
            <ChatHeader conversation={conversation} />

            <ChatMessageList
              messages={messages}
              currentUserId={currentUserId}
              loading={loading}
              otherUser={conversation.customer}
               typingUsers={typingUsers}
            />

            {Object.keys(typingUsers).length > 0 && (
              <div className="shrink-0 px-5 pb-2 text-xs text-gray-400">
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

const ChatHeader = ({ conversation }) => {
  const customer = conversation.customer;
  const isOnline = customer?.isOnline;

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          {customer?.avatarUrl ? (
            <img
              src={customer.avatarUrl}
              alt={customer.fullName || 'Customer'}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              {customer?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'C'}
            </div>
          )}

          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              isOnline ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-800">
            {customer?.fullName || 'Khách hàng'}
          </h2>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />

            <p className="text-xs text-gray-400">
              {isOnline
                ? 'Đang hoạt động'
                : formatLastSeen(customer?.lastSeenAt)}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Thông tin khách hàng"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 10v6m0-9h.01" />
        </svg>
      </button>
    </header>
  );
};

const EmptyChat = () => (
  <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 text-center">
    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <h2 className="text-lg font-bold text-gray-700">
      Tin nhắn hỗ trợ
    </h2>

    <p className="mt-1 max-w-sm text-sm leading-6 text-gray-400">
      Chọn một cuộc trò chuyện bên trái để bắt đầu hỗ trợ khách hàng.
    </p>
  </div>
);

export default AdminChat;