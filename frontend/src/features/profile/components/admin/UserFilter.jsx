import React from 'react';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

const UserFilter = ({
  filters,
  onChange,
  onSearch
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <Input
          label="Tìm kiếm"
          name="keyword"
          value={filters.keyword}
          onChange={onChange}
          placeholder="Tên, email hoặc SĐT..."
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Quyền
          </label>

          <select
            name="role"
            value={filters.role}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Tất cả
            </option>

            <option value="Customer">
              Customer
            </option>

            <option value="Admin">
              Admin
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Trạng thái
          </label>

          <select
            name="isActive"
            value={filters.isActive}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Tất cả
            </option>

            <option value="true">
              Hoạt động
            </option>

            <option value="false">
              Đã khóa
            </option>
          </select>
        </div>

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

export default UserFilter;