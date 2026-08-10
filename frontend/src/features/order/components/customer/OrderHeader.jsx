import React from 'react';

const OrderHeader = ({ order, statusConfig, formatDate }) => {
  const currentStatus = statusConfig[order.status] || { label: order.status, color: 'text-gray-800', bg: 'bg-gray-100' };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <span>Mã đơn: <strong className="text-gray-700">{order.orderNumber || order.id}</strong></span>
          <span>•</span>
          <span>Ngày đặt: {formatDate(order.createdAt)}</span>
        </div>
      </div>
      <div className={`px-4 py-2 rounded-full font-bold text-sm ${currentStatus.color} ${currentStatus.bg}`}>
        {currentStatus.label}
      </div>
    </div>
  );
};

export default OrderHeader;