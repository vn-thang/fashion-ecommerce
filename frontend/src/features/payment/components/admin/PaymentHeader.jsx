import React from 'react';
import Input from '../../../../shared/components/Input';

const PaymentHeader = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Quản lý thanh toán
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý giao dịch thanh toán của khách hàng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Input
          placeholder="Mã đơn, mã GD, khách hàng..."
          value={filters.keyword}
          onChange={e => onFilterChange('keyword', e.target.value)}
        />

        <select
          value={filters.paymentMethod}
          onChange={e => onFilterChange('paymentMethod', e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Tất cả phương thức</option>
          <option value="COD">COD</option>
          <option value="VNPAY">VNPAY</option>
        </select>

        <select
          value={filters.status}
          onChange={e => onFilterChange('status', e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Tất cả trạng thái thanh toán</option>
          <option value="PENDING">Chờ thanh toán</option>
          <option value="SUCCESS">Đã thanh toán</option>
          <option value="FAILED">Thanh toán thất bại</option>
          <option value="CANCELLED">Đã hủy</option>
          <option value="REFUNDED">Đã hoàn tiền</option>
        </select>

        <select
          value={filters.orderStatus}
          onChange={e => onFilterChange('orderStatus', e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Tất cả trạng thái đơn</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="SHIPPING">Đang giao</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
          <option value="RETURN">Hoàn trả</option>
        </select>

        <Input
          type="date"
          value={filters.fromDate}
          onChange={e => onFilterChange('fromDate', e.target.value)}
        />

        <Input
          type="date"
          value={filters.toDate}
          onChange={e => onFilterChange('toDate', e.target.value)}
        />
      </div>
    </div>
  );
};

export default PaymentHeader;