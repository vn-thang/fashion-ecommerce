import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import Input from '../../../../shared/components/Input';

const VariantStockAdjustmentModal = ({ isOpen, onClose, variant, quantity, note, loading, onQuantityChange, onNoteChange, onSubmit }) => {
  if (!variant) return null;

  const currentStock = Number(variant.stockQuantity) || 0;
  const numericQuantity = Number(quantity);
  const isValidQuantity = quantity !== '' && !Number.isNaN(numericQuantity) && numericQuantity !== 0;
  const newStock = isValidQuantity ? currentStock + numericQuantity : currentStock;
  const isIncrease = isValidQuantity && numericQuantity > 0;
  const isDecrease = isValidQuantity && numericQuantity < 0;
  const isInvalidStock = newStock < 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Điều chỉnh tồn kho"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Hủy</Button>
          <Button type="button" onClick={onSubmit} isLoading={loading} disabled={loading || !isValidQuantity || isInvalidStock}>Xác nhận điều chỉnh</Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sản phẩm</p>
              <p className="mt-1 truncate text-base font-bold text-slate-800">{variant.product?.name || 'Sản phẩm'}</p>
            </div>
            <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-1 text-xs font-mono font-semibold text-indigo-600">{variant.sku}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tồn kho hiện tại</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{currentStock}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sau điều chỉnh</p>
              <p className={`mt-1 text-2xl font-bold ${isInvalidStock ? 'text-rose-600' : isIncrease ? 'text-emerald-600' : isDecrease ? 'text-amber-600' : 'text-slate-800'}`}>{newStock}</p>
            </div>
          </div>
        </div>

        <div>
          <Input label="Số lượng điều chỉnh" type="number" value={quantity} onChange={onQuantityChange} placeholder="Ví dụ: 10 hoặc -5" required />
          <p className="mt-1.5 text-xs text-slate-500">Nhập số dương để tăng kho, số âm để giảm kho.</p>
        </div>

        {isValidQuantity && (
          <div className={`rounded-lg border px-4 py-3 text-sm ${isInvalidStock ? 'border-rose-200 bg-rose-50 text-rose-700' : isIncrease ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
            {isInvalidStock ? (
              <p className="font-medium">Số lượng giảm không được lớn hơn tồn kho hiện tại.</p>
            ) : (
              <p>Tồn kho sẽ <strong>{isIncrease ? 'tăng' : 'giảm'} {Math.abs(numericQuantity)}</strong> sản phẩm.</p>
            )}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Ghi chú</label>
          <textarea name="note" rows={3} value={note} onChange={onNoteChange} placeholder="Ví dụ: Kiểm kê kho, hàng lỗi, nhập bổ sung..." className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          <p className="mt-1 text-xs text-slate-400">Ghi chú giúp dễ dàng kiểm tra lại lịch sử điều chỉnh kho.</p>
        </div>
      </div>
    </Modal>
  );
};

export default VariantStockAdjustmentModal;