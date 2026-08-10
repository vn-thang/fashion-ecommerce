import React from 'react';
import Button from '../../../../shared/components/Button';

const BannerHeader = ({ onAdd }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý Banner
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Quản lý banner hiển thị trên trang chủ.
        </p>
      </div>

      <Button onClick={onAdd}>
        + Thêm Banner
      </Button>
    </div>
  );
};

export default BannerHeader;