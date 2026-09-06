import React from 'react';

import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import Input from '../../../../shared/components/Input';

import VariantSelector from './VariantSelector';

const InventoryAdjustmentModal = ({
  isOpen,
  onClose,
  form,
  variants,
  loadingVariants,
  saving,
  keyword,
  onKeywordChange,
  handleChange,
  onSubmit
}) => {
  const footer = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
      >
        Hủy
      </Button>

      <Button
        variant="secondary"
        onClick={onSubmit}
        isLoading={saving}
        disabled={
          saving ||
          !form.productVariantId ||
          !form.quantity
        }
      >
        Điều chỉnh
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Điều chỉnh tồn kho"
      footer={footer}
      size="lg"
    >
      <div className="space-y-5">
        <VariantSelector
          value={form.productVariantId}
          keyword={keyword}
          variants={variants}
          loading={loadingVariants}
          onKeywordChange={onKeywordChange}
          onChange={value =>
            handleChange({
              target: {
                name: 'productVariantId',
                value
              }
            })
          }
        />

        <Input
          label="Số lượng điều chỉnh"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="-5 hoặc 10"
          required
        />

        <p className="text-xs text-gray-500">
          Giá trị dương (+) để tăng tồn kho, giá trị âm (-) để giảm tồn kho.
        </p>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ghi chú
          </label>

          <textarea
            name="note"
            rows={4}
            value={form.note}
            onChange={handleChange}
            placeholder="Ví dụ: Kiểm kê kho, hàng lỗi..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </Modal>
  );
};

export default InventoryAdjustmentModal;