import React from 'react';
import Button from '../../../../shared/components/Button';

const BrandHeader = ({
  onAdd,
  search,
  onSearch,
  onSearchClick
}) => {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Quản lý thương hiệu
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Xem, thêm mới và quản lý các đối tác, thương hiệu sản phẩm của hệ thống.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onAdd}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>

          Thêm thương hiệu
        </Button>

      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

        <input
          type="text"
          value={search}
          placeholder="Nhập tên thương hiệu..."
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchClick();
            }
          }}
          className="
            w-full
            sm:w-80
            rounded-xl
            border
            border-gray-300
            px-4
            py-2.5
            text-xs
            outline-none
            transition
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100
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

export default BrandHeader;