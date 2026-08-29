import React from 'react';

const FlashSaleToolbar = ({ totalProducts, sortBy, onSort }) => {
  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg sm:h-11 sm:w-11 sm:text-xl">
            🔥
          </div>

          <div>
            <p className="text-xs text-gray-500 sm:text-sm">Flash Sale</p>
            <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
              {totalProducts} sản phẩm
            </h3>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3 md:w-auto">
          <span className="text-sm font-medium text-gray-500">
            Sắp xếp
          </span>

          <select
            value={sortBy}
            onChange={e => onSort(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition hover:border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 sm:min-w-[220px] sm:w-auto sm:px-4"
          >
            <option value="latest">🆕 Mới thêm</option>
            <option value="discount">🔥 Giảm giá nhiều nhất</option>
            <option value="bestSelling">⭐ Bán chạy nhất</option>
            <option value="priceAsc">💰 Giá thấp đến cao</option>
            <option value="priceDesc">💎 Giá cao đến thấp</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleToolbar;