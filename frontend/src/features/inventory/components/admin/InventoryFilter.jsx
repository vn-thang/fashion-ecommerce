import React from 'react';

import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

const InventoryFilter = ({
  filters,
  handleChange,
  onSearch
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

        <Input
          label="Tìm kiếm"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Tên sản phẩm hoặc SKU..."
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Loại giao dịch
          </label>

          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Tất cả
            </option>

            <option value="Import">
              Nhập kho
            </option>

            <option value="Adjustment">
              Điều chỉnh
            </option>

            <option value="Export">
              Xuất kho
            </option>
          </select>
        </div>

        <Input
          label="Từ ngày"
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />

        <Input
          label="Đến ngày"
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />

        <div className="flex items-end">
          <Button
            className="w-full"
            onClick={onSearch}
          >
            Tìm kiếm
          </Button>
        </div>

      </div>

    </div>
  );
};

export default InventoryFilter;