import React, { useState } from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const ProductTable = ({ 
  products = [], 
  onEdit, 
  onDelete, 
  onManageImages, 
  onManageVariants,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (productId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text- xl border">
          🛍️
        </div>
        <h3 className="text-base font-bold text-slate-800">Chưa có sản phẩm nào</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
          Cửa hàng của bạn hiện đang trống. Hãy thêm sản phẩm đầu tiên nhé.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50/70 border-b border-gray-200/60">
            <tr>
              <th className="w-[60px] px-4 py-4 text-center"></th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Danh mục / Hãng</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Giá & Tồn kho tổng</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-150">
            {products.map((item) => {
              const isActive = item.status === 'ACTIVE';
              const activeVariants = (item.variants || []).filter(v => v.status === 'ACTIVE');
              const variantCount = activeVariants.length;
              const totalStock = activeVariants.reduce((sum, v) => sum + Number(v.stockQuantity || 0), 0);
              const prices = activeVariants.map(v => Number(v.price));
              const minPrice = prices.length ? Math.min(...prices) : 0;
              const maxPrice = prices.length ? Math.max(...prices) : 0;

              const isExpanded = !!expandedRows[item.id];

              return (
                <React.Fragment key={item.id}>
                 <tr
                      className={`
                        transition-colors duration-150 group
                        ${isActive
                          ? 'hover:bg-slate-50/60'
                          : 'bg-gray-50/80 opacity-60'
                        }
                        ${isExpanded && isActive ? 'bg-slate-50/40' : ''}
                      `}
                    >
                    
                   <td className="px-4 py-4.5 text-center">
                  {isActive && (
                    <button
                      onClick={() => toggleRow(item.id)}
                      className={`
                        w-7 h-7 inline-flex items-center justify-center
                        rounded-lg border border-gray-200 bg-white
                        text-gray-500 shadow-sm
                        hover:text-indigo-600 hover:border-indigo-200
                        transition-all
                        ${isExpanded
                          ? 'rotate-90 text-indigo-600 bg-indigo-50/50'
                          : ''
                        }
                      `}
                      title="Xem biến thể"
                    >
                      ▶
                    </button>
                  )}
                </td>

                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200/80 overflow-hidden flex-shrink-0 shadow-sm">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="flex items-center justify-center h-full w-full text-gray-300 text-lg">🖼️</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs group-hover:text-indigo-600 transition-colors">{item.name}</div>
                          <div className="text-xs text-gray-400 mt-1 font-mono">{item.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <div className="text-xs">
                        <span className="font-semibold text-slate-700">{item.category?.name || '---'}</span>
                        <div className="text-xs text-gray-400 mt-0.5">Thương hiệu: <span className="text-slate-500 font-medium">{item.brand?.name || '---'}</span></div>
                      </div>
                    </td>

                    <td className="px-6 py-4.5 text-center">
                      <div className="text-xs font-semibold text-slate-800">
                        {minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                      </div>
                      <div className="text-xs mt-1">
                        <span className={`px-2 py-0.5 rounded font-medium ${totalStock > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200/50' : 'bg-rose-50 text-rose-600 border border-rose-200/50'}`}>
                          Tổng kho: {totalStock} ({variantCount} loại)
                        </span>
                      </div>
                    </td>

<td className="px-4 py-3 text-center">
  <span
    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
      item.status === 'ACTIVE'
        ? 'border-emerald-200/60 bg-emerald-50 text-emerald-600'
        : 'border-slate-200 bg-slate-100 text-slate-500'
    }`}
  >
    {item.status === 'ACTIVE' ? '● Hoạt động' : '○ Đã ẩn'}
  </span>
</td>

                  <td className="px-6 py-4.5 text-center">
                 <div className="flex items-center justify-center gap-1.5">
  {isActive ? (
    <>
      <Button
        size="sm"
        variant="outline"
        className="border-gray-200 bg-white text-sky-600 shadow-none hover:border-sky-500 hover:text-sky-700"
        onClick={() => onManageImages(item)}
      >
        📸 Album
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="border-gray-200 bg-white text-amber-600 shadow-none hover:border-amber-500 hover:text-amber-700"
        onClick={() => onManageVariants(item)}
      >
        📦 Phân loại
      </Button>

      <div className="mx-1 h-5 w-px bg-gray-200" />

      <Button
        size="sm"
        variant="outline"
        className="border-gray-200 bg-white text-slate-600 shadow-none hover:border-indigo-500 hover:text-indigo-600"
        onClick={() => onEdit(item)}
      >
        ✏️ Sửa
      </Button>

      <Button
        size="sm"
        variant="danger"
        className="border border-rose-200 bg-rose-50 text-rose-600 shadow-none hover:bg-rose-600 hover:text-white"
        onClick={() => onDelete(item.id)}
      >
        🗑️ Ẩn
      </Button>
    </>
  ) : (
    <Button
      size="sm"
      variant="outline"
      className="border-indigo-200 bg-indigo-50 text-indigo-600 shadow-none hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
      onClick={() => onEdit(item)}
    >
      ✏️ Kích hoạt lại
    </Button>
  )}
</div>
                </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-slate-50/50 border-l-4 border-l-indigo-500 transition-all duration-300">
                      <td colSpan="6" className="px-8 py-4 bg-slate-50/40">
                        <div className="border border-gray-200/80 rounded-xl overflow-hidden shadow-inner bg-white">
                          <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-gray-200/60">
                            Danh sách các biến thể đang lưu trữ tại kho (Product Variants)
                          </div>
                          
                          {variantCount === 0 ? (
                            <div className="p-4 text-xs text-gray-400 italic text-center">
                              Sản phẩm này hiện tại chưa được khởi tạo bất kỳ phân loại biến thể nào. Hãy bấm vào nút "📦 Phân loại" ở trên để thêm.
                            </div>
                          ) : (
                            <table className="w-full text-left text-xs divide-y divide-gray-100">
                              <thead className="bg-slate-50 text-xs font-semibold text-gray-500">
                                <tr>
                                  <th className="px-4 py-2.5">Mã SKU</th>
                                  <th className="px-4 py-2.5">Màu sắc (Color)</th>
                                  <th className="px-4 py-2.5">Kích cỡ (Size)</th>
                                  <th className="px-4 py-2.5 text-right">Giá bán phân loại</th>
                                  <th className="px-4 py-2.5 text-center">Tồn kho hiện tại</th>
                                  <th className="px-4 py-2.5 text-center">Trạng thái</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-150 font-medium text-slate-700">
                               {activeVariants.map(variant => (
                                  <tr key={variant.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-4 py-2.5 font-mono text-xs text-indigo-600 font-bold">{variant.sku}</td>
                                    <td className="px-4 py-2.5">{variant.color || <span className="text-gray-300 italic">Không có</span>}</td>
                                    <td className="px-4 py-2.5"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-xs text-slate-600">{variant.size || 'Freesize'}</span></td>
                                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-600">{formatCurrency(variant.price)}</td>
                                    <td className="px-4 py-2.5 text-center">
                                      <span className={`font-mono font-bold ${variant.stockQuantity === 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                                        {variant.stockQuantity}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                      <span className={`inline-flex px-2 py-0.5 text-xs rounded font-semibold ${variant.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {variant.status === 'ACTIVE' ? 'Bán' : 'Dừng bán'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={onPageChange} 
      />
    </div>
  );
};

export default ProductTable;