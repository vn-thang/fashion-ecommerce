import React from 'react';
import Button from '../../../../shared/components/Button';
import Input from '../../../../shared/components/Input';

const AuditLogFilter = ({
  filters,
  search,
  onSearchInput,
  onSearch,
  onFilterChange,
  onReset
}) => {
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Input
            id="audit-log-search"
            label="Tìm kiếm"
            placeholder="Nhập nội dung cần tìm..."
            value={search}
            onChange={e => onSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

       <div>
  <label
    htmlFor="audit-log-action"
    className="mb-1.5 block text-sm font-semibold text-gray-700"
  >
    Hành động
  </label>

  <select
    id="audit-log-action"
    value={filters.action}
    onChange={e => onFilterChange('action', e.target.value)}
    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
  >
    <option value="">Tất cả hành động</option>

    <option value="CREATE">Tạo mới</option>
    <option value="UPDATE">Cập nhật</option>
    <option value="DELETE">Xóa</option>

    <option value="ACTIVATE">Kích hoạt</option>
    <option value="DEACTIVATE">Vô hiệu hóa</option>

    <option value="IMPORT">Nhập kho</option>
    <option value="ADJUST_STOCK">Điều chỉnh tồn kho</option>

    <option value="REPLY_REVIEW">Trả lời đánh giá</option>
    <option value="HIDE_REVIEW">Ẩn đánh giá</option>
    <option value="RESTORE_REVIEW">Hiện lại đánh giá</option>
  </select>
</div>

<div>
  <label
    htmlFor="audit-log-entity"
    className="mb-1.5 block text-sm font-semibold text-gray-700"
  >
    Đối tượng
  </label>

  <select
    id="audit-log-entity"
    value={filters.entityName}
    onChange={e => onFilterChange('entityName', e.target.value)}
    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
  >
    <option value="">Tất cả đối tượng</option>

    <option value="Brand">Thương hiệu</option>
    <option value="Category">Danh mục</option>
    <option value="Product">Sản phẩm</option>
    <option value="ProductVariant">Biến thể sản phẩm</option>

    <option value="Coupon">Mã giảm giá</option>
    <option value="FlashSale">Flash Sale</option>
    <option value="FlashSaleVariant">Biến thể Flash Sale</option>

    <option value="Order">Đơn hàng</option>
    <option value="Review">Đánh giá</option>
    <option value="User">Người dùng</option>
    <option value="Inventory">Kho hàng</option>
  </select>
</div>

        <div>
          <Input
            id="audit-log-from-date"
            label="Từ ngày"
            type="date"
            value={filters.fromDate}
            onChange={e => onFilterChange('fromDate', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="audit-log-to-date"
            label="Đến ngày"
            type="date"
            value={filters.toDate}
            onChange={e => onFilterChange('toDate', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3 border-t border-gray-100 pt-5">
        <Button
          variant="outline"
          onClick={onReset}
        >
          Xóa bộ lọc
        </Button>

        <Button
          variant="secondary"
          onClick={onSearch}
        >
          🔍 Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default AuditLogFilter;