import React from 'react';
import ChatMessageList from '../ChatMessageList';
import ChatInput from '../ChatInput';

const formatLastSeen = date => {
  if (!date) return 'Không rõ'
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

const CustomerChat = ({
  currentUserId,
  conversation,
  messages,
  loading,
  sending,
  sendMessage,
  sendAttachment,
  handleTypingStart,
  handleTypingStop,
  adminPresence,
  isAdminTyping
}) => {
  if (loading && !conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-white text-sm text-gray-400">
        Đang tải cuộc trò chuyện...
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-white px-6 text-center text-sm text-gray-400">
        Không tìm thấy cuộc trò chuyện.
      </div>
    );
  }

  const isAdminOnline = adminPresence?.isOnline === true;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            {conversation.store?.logoUrl ? (
              <img
                src={conversation.store.logoUrl}
                alt={conversation.store.storeName || 'Shop'}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {conversation.store?.storeName?.trim()?.charAt(0)?.toUpperCase() || 'S'}
              </div>
            )}

         <span
  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
    isAdminOnline ? 'bg-emerald-500' : 'bg-gray-300'
  }`}
/>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-gray-800">
              {conversation.store?.storeName || 'FashionHub'}
            </h3>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

             <p className="text-[11px] text-gray-400">
  {isAdminOnline
    ? 'Đang hoạt động'
    : formatLastSeen(adminPresence?.lastSeenAt)}
</p>
            </div>
          </div>
        </div>

        {conversation.status === 'CLOSED' && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
            Đã đóng
          </span>
        )}
      </header>

      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
        loading={loading}
        otherUser={{
          fullName: conversation.store?.storeName,
          avatarUrl: conversation.store?.logoUrl
        }}
      />

      {isAdminTyping && (
        <div className="shrink-0 px-4 pb-2 text-xs text-gray-400">
          FashionHub đang nhập...
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        onSendAttachment={sendAttachment}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        sending={sending}
      />
    </div>
  );
};

export default CustomerChat;