import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import ReturnRequestItem from './ReturnRequestItem';
import { useReturn } from '../../hooks/useReturn';

const REASONS = [
  {
    value: 'WRONG_SIZE',
    label: 'Không vừa kích thước'
  },
  {
    value: 'WRONG_PRODUCT',
    label: 'Nhận sai sản phẩm'
  },
  {
    value: 'DEFECTIVE',
    label: 'Sản phẩm bị lỗi'
  },
  {
    value: 'NOT_AS_DESCRIBED',
    label: 'Sản phẩm không giống mô tả'
  },
  {
    value: 'OTHER',
    label: 'Lý do khác'
  }
];

const ReturnRequestModal = ({
  isOpen,
  onClose,
  order,
  onSuccess
}) => {
  const { createReturn, submitting } = useReturn();

  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedItems({});
      setReason('');
      setDescription('');
    }
  }, [isOpen]);

  const items = order?.items || [];

  const handleToggle = itemId => {
    setSelectedItems(prev => {
      if (prev[itemId]) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }

      return {
        ...prev,
        [itemId]: 1
      };
    });
  };

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const selectedItemList = useMemo(() => {
    return items.filter(item => selectedItems[item.id]);
  }, [items, selectedItems]);

  const refundAmount = useMemo(() => {
    return selectedItemList.reduce((total, item) => {
      const quantity = selectedItems[item.id] || 0;
      const subtotal = Number(item.subtotal || 0);
      const discountAmount = Number(item.discountAmount || 0);

      const netAmount = subtotal - discountAmount;
      const netUnitPrice =
        item.quantity > 0
          ? netAmount / item.quantity
          : Number(item.unitPrice || 0);

      return total + netUnitPrice * quantity;
    }, 0);
  }, [selectedItemList, selectedItems]);

  const handleSubmit = async () => {
    if (!order?.id || selectedItemList.length === 0) {
      return;
    }

    if (!reason) {
      return;
    }

    const data = {
      orderId: order.id,
      reason,
      description: description.trim() || null,
      items: selectedItemList.map(item => ({
        orderItemId: item.id,
        quantity: selectedItems[item.id]
      }))
    };

    const result = await createReturn(data);

    if (result) {
      onSuccess?.(result);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yêu cầu trả hàng"
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Hủy
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              submitting ||
              selectedItemList.length === 0 ||
              !reason
            }
          >
            {submitting
              ? 'Đang gửi...'
              : 'Gửi yêu cầu'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <div className="text-xs text-gray-500">
            Đơn hàng
          </div>
          <div className="mt-1 font-semibold text-slate-800">
            {order?.orderNumber}
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-semibold text-slate-800">
            Chọn sản phẩm muốn trả
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <ReturnRequestItem
                key={item.id}
                item={item}
                selected={Boolean(selectedItems[item.id])}
                quantity={selectedItems[item.id] || 1}
                onToggle={handleToggle}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="return-reason"
            className="mb-2 block text-xs font-semibold text-slate-800"
          >
            Lý do trả hàng
          </label>

          <select
            id="return-reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">
              Chọn lý do trả hàng
            </option>

            {REASONS.map(item => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="return-description"
            className="mb-2 block text-xs font-semibold text-slate-800"
          >
            Mô tả chi tiết
          </label>

          <textarea
            id="return-description"
            value={description}
            onChange={e =>
              setDescription(e.target.value)
            }
            rows={4}
            placeholder="Mô tả tình trạng hoặc lý do bạn muốn trả sản phẩm..."
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-gray-700">
              Số tiền hoàn
            </span>

            <span className="text-sm font-bold text-orange-600">
              {Math.round(
                refundAmount
              ).toLocaleString('vi-VN')}đ
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Số tiền hoàn được xác nhận sau khi yêu cầu trả hàng được kiểm tra và chấp nhận.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReturnRequestModal;