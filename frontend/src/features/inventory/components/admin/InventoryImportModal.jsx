import React from 'react';

import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import Input from '../../../../shared/components/Input';

import VariantSelector from './VariantSelector';

const InventoryImportModal = ({
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
        onClick={onSubmit}
        isLoading={saving}
        disabled={
          saving ||
          !form.productVariantId ||
          !form.quantity
        }
      >
        Nhập kho
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhập kho"
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
          label="Số lượng nhập"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min={1}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ghi chú
          </label>

          <textarea
            name="note"
            rows={4}
            value={form.note}
            onChange={handleChange}
            placeholder="Ví dụ: Nhập hàng từ nhà cung cấp..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </Modal>
  );
};

export default InventoryImportModal;