import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const InventoryDetailModal = ({
  isOpen,
  onClose,
 transaction
}) => {
  if (!transaction) return null;

  const getType = type => {
    switch (type) {
      case 'Import':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            Nhập kho
          </span>
        );

      case 'Adjustment':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            Điều chỉnh
          </span>
        );

      case 'Export':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
            Xuất kho
          </span>
        );

      default:
        return type;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết giao dịch kho"
      size="lg"
      footer={
        <Button
          variant="outline"
          onClick={onClose}
        >
          Đóng
        </Button>
      }
    >
      <div className="space-y-6">

        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="text-xs text-gray-500">
              Sản phẩm
            </p>

            <p className="font-semibold">
              {transaction.variant?.product?.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              SKU
            </p>

            <p className="font-semibold">
              {transaction.variant?.sku}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Màu sắc
            </p>

            <p>
              {transaction.variant?.color || '-'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Kích thước
            </p>

            <p>
              {transaction.variant?.size || '-'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Loại giao dịch
            </p>

            {getType(transaction.type)}
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Số lượng
            </p>

            <p className="font-semibold">
              {transaction.quantity}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Tồn kho sau giao dịch
            </p>

            <p className="font-semibold text-indigo-600">
              {transaction.balanceAfter}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Người thực hiện
            </p>

            <p>
              {transaction.user?.fullName}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">
              Ghi chú
            </p>

            <p>
              {transaction.note || '-'}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-xs text-gray-500">
              Thời gian
            </p>

            <p>
              {new Date(
                transaction.createdAt
              ).toLocaleString('vi-VN')}
            </p>
          </div>

        </div>

      </div>
    </Modal>
  );
};

export default InventoryDetailModal;