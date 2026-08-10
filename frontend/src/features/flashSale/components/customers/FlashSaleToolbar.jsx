import React from 'react';

const FlashSaleToolbar = ({
  totalProducts,
  sortBy,
  onSort
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl">
            🔥
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Flash Sale
            </p>
            <h3 className="text-lg font-semibold text-gray-800">
              {totalProducts} sản phẩm
            </h3>

          </div>

        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
            Sắp xếp
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
            className="
              min-w-[220px]
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              text-gray-700
              outline-none
              transition
              hover:border-red-300
              focus:border-red-500
              focus:ring-2
              focus:ring-red-100
            "
          >
            <option value="latest">
              🆕 Mới thêm
            </option>

            <option value="discount">
              🔥 Giảm giá nhiều nhất
            </option>

            <option value="bestSelling">
              ⭐ Bán chạy nhất
            </option>

            <option value="priceAsc">
              💰 Giá thấp đến cao
            </option>

            <option value="priceDesc">
              💎 Giá cao đến thấp
            </option>

          </select>

        </div>

      </div>

    </div>
  );
};

export default FlashSaleToolbar;