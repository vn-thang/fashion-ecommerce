import React from 'react';
import Button from '../../../../shared/components/Button';
import Input from '../../../../shared/components/Input';

const CouponHeader = ({
  onAdd,
  filters,
  onFilterChange,
  onSearch,
  onReset,
  totalCount = 0
}) => {
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý mã giảm giá</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tạo và quản lý các chương trình khuyến mãi cho khách hàng.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onAdd}
          className="w-full px-5 font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg sm:w-auto"
        >
          <span className="text-lg leading-none">+</span>
          Thêm mã giảm giá
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <Input
              id="coupon-search"
              label="Tìm kiếm"
              placeholder="Nhập mã giảm giá..."
              value={filters.search}
              onChange={e => onFilterChange('search', e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Loại giảm giá
            </label>
            <select
              value={filters.discountType}
              onChange={e => onFilterChange('discountType', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Tất cả loại</option>
              <option value="PERCENTAGE">Phần trăm (%)</option>
              <option value="FIXED">Giảm cố định</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={e => onFilterChange('status', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang chạy</option>
              <option value="UPCOMING">Sắp diễn ra</option>
              <option value="EXPIRED">Đã hết hạn</option>
              <option value="INACTIVE">Đã tắt</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={onSearch}
              className="w-full"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={e => onFilterChange('fromDate', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.toDate}
              onChange={e => onFilterChange('toDate', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <Button
            variant="outline"
            onClick={onReset}
            className="w-full lg:self-end"
          >
            Đặt lại
          </Button>

          <div className="flex items-center justify-center rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-500 lg:self-end">
            Tổng: <span className="ml-1 font-semibold text-slate-700">{totalCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponHeader;