import React from 'react';
import Button from '../../../../shared/components/Button';

const StoreSettingHeader = ({ onSave, saving }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Thông tin cửa hàng
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Cập nhật thông tin chung của cửa hàng. Những thông tin này sẽ được sử dụng tại Header, Footer, trang Giới thiệu và các khu vực hiển thị trên website.
        </p>
      </div>

      <Button
        variant="primary"
        className="shadow-md shadow-emerald-600/10 hover:shadow-lg font-semibold px-5"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </div>
  );
};

export default StoreSettingHeader;