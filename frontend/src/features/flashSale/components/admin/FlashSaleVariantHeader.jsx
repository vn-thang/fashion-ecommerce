import React from 'react';
import Button from '../../../../shared/components/Button';

const FlashSaleVariantHeader = ({
  flashSale,
  totalCount = 0,
  search = '',
  onSearch,
  onAdd,
  canEdit
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-slate-800">
              {flashSale?.name || 'Flash Sale'}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
              {totalCount} sản phẩm
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Quản lý danh sách sản phẩm tham gia chương trình Flash Sale
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              value={search}
              onChange={e => onSearch?.(e.target.value)}
              placeholder="Tìm theo tên sản phẩm hoặc SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <Button
            variant="primary"
            onClick={onAdd}
            disabled={!canEdit}
            className="bg-rose-600 hover:bg-rose-700 text-white whitespace-nowrap"
          >
            + Thêm sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleVariantHeader;