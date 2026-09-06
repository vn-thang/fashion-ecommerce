import React from 'react';
import Button from '../../../../shared/components/Button';

const InventoryHeader = ({
  onImport,
  onAdjustment
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Quản lý kho
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Quản lý nhập kho, điều chỉnh tồn kho và theo dõi lịch sử giao dịch.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onAdjustment}
        >
          Điều chỉnh kho
        </Button>

        <Button
          onClick={onImport}
        >
          Nhập kho
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;