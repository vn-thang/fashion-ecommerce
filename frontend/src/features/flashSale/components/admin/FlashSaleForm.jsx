import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

import { useFlashSaleForm } from '../../hooks/useFlashSaleForm';

const FlashSaleForm = ({
  isOpen,
  onClose,
  flashSale,
  onSuccess
}) => {
  const {
    formData,
    loading,
    handleChange,
    handleSubmit
  } = useFlashSaleForm({
    flashSale,
    onClose,
    onSuccess
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        flashSale
          ? 'Cập nhật Flash Sale'
          : 'Tạo Flash Sale'
      }
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>

          <Button
            variant="primary"
            isLoading={loading}
            onClick={handleSubmit}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {flashSale ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <div className="space-y-5 py-2">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Tên chương trình
          </label>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ví dụ: Flash Sale 11.11"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Thời gian bắt đầu
          </label>

          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Thời gian kết thúc
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
          <div>
            <p className="font-semibold text-gray-800">
              Kích hoạt chương trình
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Nếu tắt, chương trình sẽ không được áp dụng.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="sr-only peer"/>
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-rose-600 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default FlashSaleForm;