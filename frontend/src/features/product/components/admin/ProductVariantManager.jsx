import React from 'react';
import Button from '../../../../shared/components/Button';
import { useProductVariantAdmin } from '../../hooks/useProductVariantAdmin';
import VariantStockAdjustmentModal from './VariantStockAdjustmentModal';

const ProductVariantManager = ({ productId }) => {
  const {
  variants,
  form,
  editingId,
  isLoading,
  handleInputChange,
  handleEditClick,
  handleCancelEdit,
  handleSubmitForm,
  handleDeleteVariant,
  handleActivateVariant,
  adjustingVariantId,
  adjustmentQuantity,
  adjustmentNote,
  isAdjustingStock,
  openStockAdjustment,
  closeStockAdjustment,
  handleAdjustmentQuantityChange,
  handleAdjustmentNoteChange,
  adjustStock
} = useProductVariantAdmin(productId);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitForm} className={`p-5 rounded-2xl border shadow-sm transition-colors ${editingId ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-gray-200'}`}>
        <h4 className={`text-sm font-bold mb-4 uppercase tracking-wider ${editingId ? 'text-amber-700' : 'text-slate-700'}`}>
          {editingId ? '📝 Cập nhật phân loại' : 'Thêm phân loại mới'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mã SKU *</label>
            <input type="text" name="sku" value={form.sku} onChange={handleInputChange} placeholder="VD: POLO-DEN-M" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Màu sắc</label>
            <input type="text" name="color" value={form.color} onChange={handleInputChange} placeholder="Đen, Trắng..." className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kích cỡ</label>
            <input type="text" name="size" value={form.size} onChange={handleInputChange} placeholder="S, M, L..." className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Giá bán *</label>
            <input type="number" name="price" value={form.price} onChange={handleInputChange} placeholder="0 VNĐ" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kho ban đầu *</label>
            <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleInputChange} placeholder="0" disabled={!!editingId} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white disabled:bg-gray-100 disabled:text-gray-400" />
            {editingId && <p className="mt-1 text-[11px] text-gray-500">Điều chỉnh tồn kho bằng nút "Kho".</p>}
          </div>

          <div className="flex flex-col gap-2 justify-end">
            <Button type="submit" disabled={isLoading} className={`w-full text-white py-2 ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isLoading ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : '➕ Thêm'}
            </Button>

            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors">
                Trở về thêm mới
              </button>
            )}
          </div>
        </div>
      </form>

      <div>
        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Danh sách phân loại ({variants.length})</h4>

        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm divide-y divide-gray-200 bg-white">
            <thead className="bg-slate-100 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Mã SKU</th>
                <th className="px-4 py-3">Màu sắc</th>
                <th className="px-4 py-3">Kích cỡ</th>
                <th className="px-4 py-3 text-right">Giá</th>
                <th className="px-4 py-3 text-center">Tồn kho</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400 italic">Chưa có phân loại nào được tạo.</td>
                </tr>
              ) : (
               variants.map(v => (
  <tr key={v.id} className={`transition-colors ${v.status === 'INACTIVE' ? 'bg-slate-50' : editingId === v.id ? 'bg-amber-50/50' : 'hover:bg-slate-50'}`}>
    <td className={`px-4 py-3 font-mono font-bold ${v.status === 'INACTIVE' ? 'opacity-50 text-slate-400' : 'text-indigo-600'}`}>
      {v.sku}
      {v.status === 'INACTIVE' && <span className="ml-2 font-sans text-[10px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">Đã ẩn</span>}
    </td>
    <td className={`px-4 py-3 ${v.status === 'INACTIVE' ? 'opacity-50 text-slate-400' : ''}`}>{v.color || '-'}</td>
    <td className={`px-4 py-3 font-semibold ${v.status === 'INACTIVE' ? 'opacity-50 text-slate-400' : ''}`}>{v.size || '-'}</td>
    <td className={`px-4 py-3 text-right text-emerald-600 font-semibold ${v.status === 'INACTIVE' ? 'opacity-50' : ''}`}>
      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
    </td>
    <td className={`px-4 py-3 text-center ${v.status === 'INACTIVE' ? 'opacity-50' : ''}`}>
      <span className={`font-mono font-bold ${v.stockQuantity === 0 ? 'text-rose-600' : 'text-slate-700'}`}>{v.stockQuantity}</span>
    </td>
    <td className="px-4 py-3 text-center">
      {v.status === 'ACTIVE' ? (
        <div className="flex justify-center items-center gap-2">
          <button type="button" onClick={() => openStockAdjustment(v)} className="text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded transition-colors">Điều chỉnh kho</button>
          <button type="button" onClick={() => handleEditClick(v)} className="text-amber-600 hover:text-amber-800 font-medium bg-amber-50 px-2 py-1 rounded transition-colors">Sửa</button>
          <button type="button" onClick={() => handleDeleteVariant(v.id)} className="text-rose-500 hover:text-rose-700 font-medium bg-rose-50 px-2 py-1 rounded transition-colors">Ẩn</button>
        </div>
      ) : (
        <button type="button" onClick={() => handleActivateVariant(v.id)} className="text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors">Hiện lại</button>
      )}
    </td>
  </tr>
))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

<VariantStockAdjustmentModal
  isOpen={!!adjustingVariantId}
  onClose={closeStockAdjustment}
  variant={variants.find(v => v.id === adjustingVariantId)}
  quantity={adjustmentQuantity}
  note={adjustmentNote}
  loading={isAdjustingStock}
  onQuantityChange={handleAdjustmentQuantityChange}
  onNoteChange={handleAdjustmentNoteChange}
  onSubmit={adjustStock}
/>
    </div>
  );
};

export default ProductVariantManager;