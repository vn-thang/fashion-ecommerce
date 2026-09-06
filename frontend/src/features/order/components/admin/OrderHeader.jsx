import React from 'react';
import Input from '../../../../shared/components/Input';

const OrderHeader = ({
  filters,
  onFilterChange,
  onClearCustomerFilter
}) => {
  return (
    <div className="space-y-5 border-b border-gray-200/60 pb-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          Quản lý Đơn hàng
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Theo dõi đơn hàng, thanh toán và quá trình giao hàng.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <Input
              id="order-search"
              placeholder="Tìm theo mã đơn, tên tài khoản, tên người nhận hoặc số điện thoại..."
              value={filters.search}
              onChange={e =>
                onFilterChange('search', e.target.value)
              }
              className="bg-white !py-2"
            />

            {filters.customerId && (
              <div className="mt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Đang xem đơn hàng của
                </p>

                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2">
                  <span>👤</span>

                  <span className="text-sm font-medium text-indigo-700">
                    {filters.customerName}
                  </span>

                  <button
                    type="button"
                    onClick={onClearCustomerFilter}
                    className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-indigo-600 transition hover:bg-indigo-100 hover:text-red-600"
                    title="Bỏ lọc khách hàng"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-72">
            <select
              id="order-status-filter"
              value={filters.status}
              onChange={e =>
                onFilterChange('status', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Tất cả trạng thái --</option>
              <option value="PENDING">⏳ Chờ xác nhận</option>
              <option value="PROCESSING">📦 Đang xử lý</option>
              <option value="SHIPPING">🚚 Đang giao hàng</option>
              <option value="COMPLETED">✅ Đã hoàn thành</option>
              <option value="CANCELLED">❌ Đã hủy đơn</option>
              <option value="RETURN">↩️ Hoàn trả</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;