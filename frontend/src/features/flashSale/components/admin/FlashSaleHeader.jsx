import React from 'react';
import Button from '../../../../shared/components/Button';

const FlashSaleHeader = ({
  totalCount,
  search,
  onSearch,
  onCreate
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Quản lý Flash Sale
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Quản lý các chương trình Flash Sale ({totalCount} chương trình)
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onCreate}
          className="bg-rose-600 hover:bg-rose-700 text-white"
        >
          + Tạo Flash Sale
        </Button>

      </div>

      <div className="mt-6">
        <input
          type="text"
          value={search}
          placeholder="Tìm theo tên chương trình..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full lg:w-96 px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
        />
      </div>

    </div>
  );
};

export default FlashSaleHeader;