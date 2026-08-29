import React from 'react';

const formatLastSeen = date => {
  if (!date) return 'Không rõ';

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return 'Không rõ';
  }

  const diff = Date.now() - value.getTime();

  if (diff < 60 * 1000) {
    return 'Vừa hoạt động';
  }

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

const CustomerChatButton = ({
  onClick,
  unreadCount = 0,
  store,
  adminPresence
}) => {
  const storeName = store?.storeName || 'FashionHub';
  const logoUrl = store?.logoUrl;

  const isAdminOnline =
    adminPresence?.isOnline === true;

  const presenceText = isAdminOnline
    ? 'Đang hoạt động'
    : formatLastSeen(adminPresence?.lastSeenAt);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Chat với ${storeName}`}
      className="
        group relative flex h-14 w-14 items-center justify-center
        rounded-full border-4 border-white
        bg-white
        shadow-lg shadow-gray-900/15
        transition-all duration-300
        hover:scale-105
        hover:shadow-xl hover:shadow-gray-900/20
        active:scale-95
      "
    >
      <span
        className="
          pointer-events-none absolute inset-0
          rounded-full
          bg-indigo-500
          opacity-0
          transition-opacity
          group-hover:animate-ping
          group-hover:opacity-20
        "
      />

      <div className="relative z-10 h-full w-full overflow-hidden rounded-full">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={storeName}
            className="
              h-full w-full
              object-cover
              transition-transform duration-300
              group-hover:scale-110
            "
          />
        ) : (
          <div
            className="
              flex h-full w-full items-center justify-center
              bg-indigo-100
              text-lg font-bold
              text-indigo-600
            "
          >
            {storeName.trim().charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span
        className={`
          absolute bottom-0.5 right-0.5 z-20
          h-3.5 w-3.5
          rounded-full
          border-2 border-white
          shadow-sm
          ${
            isAdminOnline
              ? 'bg-emerald-500'
              : 'bg-gray-300'
          }
        `}
        title={presenceText}
      />

      {unreadCount > 0 && (
        <span
          className="
            absolute -right-1.5 -top-1.5 z-30
            flex h-5 min-w-5
            items-center justify-center
            rounded-full
            border-2 border-white
            bg-rose-500
            px-1
            text-[10px]
            font-bold
            leading-none
            text-white
            shadow-md
          "
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      <span
        className="
          pointer-events-none absolute right-[calc(100%+12px)]
          top-1/2 z-40
          -translate-y-1/2
          whitespace-nowrap
          rounded-lg
          bg-gray-900
          px-3 py-2
          text-xs font-medium
          text-white
          opacity-0
          shadow-lg
          transition-all duration-200
          group-hover:translate-x-0
          group-hover:opacity-100
          translate-x-1
        "
      >
        Chat với {storeName}

        <span
          className="
            absolute -right-1.5 top-1/2
            h-3 w-3
            -translate-y-1/2
            rotate-45
            bg-gray-900
          "
        />
      </span>
    </button>
  );
};

export default CustomerChatButton;