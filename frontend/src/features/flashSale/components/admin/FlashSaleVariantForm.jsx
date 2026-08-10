import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import { useFlashSaleVariantForm } from '../../hooks/useFlashSaleVariantForm';

const FlashSaleVariantForm = ({
  isOpen,
  onClose,
  flashSaleId,
  variant,
  onSuccess
}) => {
  const {
    formData,
    loading,
    handleChange,
    handleSubmit
  } = useFlashSaleVariantForm({
    flashSaleId,
    variant,
    onClose,
    onSuccess
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        variant
          ? 'Cập nhật Flash Sale Variant'
          : 'Thêm vào Flash Sale'
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
            onClick={handleSubmit}
            isLoading={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {variant ? 'Cập nhật' : 'Thêm'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">

        {variant?.product && (
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-4">

              <img
                src={
                  variant.product.images?.[0]?.imageUrl ||
                  variant.product.thumbnailUrl
                }
                alt={variant.product.name}
                className="w-20 h-20 rounded-lg object-cover border"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  {variant.product.name}
                </h3>

                <div className="mt-1 text-sm text-gray-500">
                  SKU: {variant.sku}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {variant.color} / {variant.size}
                </div>

                <div className="mt-2 text-sm">
                  Giá gốc:
                  <span className="ml-2 font-semibold text-slate-700">
                    {Number(variant.price).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="text-sm">
                  Tồn kho:
                  <span className="ml-2 font-semibold text-blue-600">
                    {variant.stockQuantity}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Giá Flash Sale
          </label>

          <input
            type="number"
            name="flashSalePrice"
            value={formData.flashSalePrice}
            onChange={handleChange}
            placeholder="Nhập giá Flash Sale"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Số lượng Flash Sale
          </label>

          <input
            type="number"
            name="flashSaleStock"
            value={formData.flashSaleStock}
            onChange={handleChange}
            placeholder="Nhập số lượng"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
          />
        </div>

      </div>
    </Modal>
  );
};

export default FlashSaleVariantForm;