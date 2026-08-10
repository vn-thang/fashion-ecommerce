import React from 'react';
import Button from '../../../../shared/components/Button';

const CategoryHeader = ({
  onAdd,
  search,
  onSearch,
  onSearchClick
}) => {
  return (
    <div className="flex flex-col gap-5 border-b border-gray-200/60 pb-5">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Quản lý Danh mục
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Tạo lập, sửa đổi cấu trúc cây danh mục định vị sản phẩm.
          </p>
        </div>

        <Button
          variant="primary"
          className="px-5 font-semibold"
          onClick={onAdd}
        >
          ＋ Thêm danh mục mới
        </Button>

      </div>

      <div className="flex justify-end gap-3">

        <input
          type="text"
          value={search}
          placeholder="Nhập tên danh mục..."
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchClick();
            }
          }}
          className="
            w-full
            max-w-sm
            rounded-xl
            border
            border-gray-300
            px-4
            py-2.5
            text-sm
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100
            outline-none
          "
        />

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

export default CategoryHeader;