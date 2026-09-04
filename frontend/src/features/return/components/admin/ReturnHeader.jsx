import React from 'react';
import Button from '../../../../shared/components/Button';

const ReturnHeader = ({
  search,
  onSearch,
  onSearchClick,
  status,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Quản lý hoàn hàng
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Theo dõi và xử lý các yêu cầu trả hàng, hoàn tiền của khách hàng.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:justify-end">
        <input
          type="text"
          value={search}
          placeholder="Nhập mã đơn hàng..."
          onChange={e => onSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') onSearchClick();
          }}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 lg:w-80"
        />

          <select
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 lg:w-52"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="REQUESTED">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
          <option value="SHIPPING">Đang gửi hàng</option>
          <option value="RECEIVED">Đã nhận hàng</option>
          <option value="COMPLETED">Đã hoàn tất</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>

        <Button
          variant="secondary"
          onClick={onSearchClick}
        >
          🔍 Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default ReturnHeader;