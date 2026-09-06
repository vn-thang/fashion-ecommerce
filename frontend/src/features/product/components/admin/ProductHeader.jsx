import React from 'react';
import Button from '../../../../shared/components/Button';

const ProductHeader = ({ onAdd }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Quản lý Sản phẩm
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý thông tin, hình ảnh, trạng thái của toàn bộ sản phẩm trên hệ thống.
        </p>
      </div>

      <Button
        variant="primary"
        className="shadow-md shadow-indigo-600/10 hover:shadow-lg font-semibold px-5 bg-indigo-600 hover:bg-indigo-700 text-white"
        onClick={onAdd}
      >
        <span className="text-sm leading-none mr-1">+</span> Thêm sản phẩm mới
      </Button>
    </div>
  );
};

export default ProductHeader;