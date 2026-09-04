import React from 'react';

const STATUS_CONFIG = {
  REQUESTED: {
    label: 'Chờ duyệt',
    className: 'border-amber-200 bg-amber-50 text-amber-600'
  },
  APPROVED: {
    label: 'Đã duyệt',
    className: 'border-blue-200 bg-blue-50 text-blue-600'
  },
  REJECTED: {
    label: 'Từ chối',
    className: 'border-red-200 bg-red-50 text-red-600'
  },
  SHIPPING: {
    label: 'Đang gửi hàng',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-600'
  },
  RECEIVED: {
    label: 'Đã nhận hàng',
    className: 'border-purple-200 bg-purple-50 text-purple-600'
  },
  COMPLETED: {
    label: 'Đã hoàn tất',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-600'
  },
  CANCELLED: {
  label: 'Đã hủy',
  className: 'border-gray-200 bg-gray-50 text-gray-500'
}
};

const ReturnStatus = ({ status }) => {
  const config =
    STATUS_CONFIG[status] || {
      label: status || 'Không xác định',
      className: 'border-gray-200 bg-gray-50 text-gray-500'
    };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default ReturnStatus;