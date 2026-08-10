import React from 'react';

const statusConfig = {
  'Đang diễn ra': {
    className: 'bg-green-100 text-green-700'
  },
  'Sắp diễn ra': {
    className: 'bg-blue-100 text-blue-700'
  },
  'Đã kết thúc': {
    className: 'bg-gray-100 text-gray-700'
  },
  'Đã tắt': {
    className: 'bg-red-100 text-red-700'
  }
};

const FlashSaleStatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    className: 'bg-gray-100 text-gray-700'
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      {status}
    </span>
  );
};

export default FlashSaleStatusBadge;