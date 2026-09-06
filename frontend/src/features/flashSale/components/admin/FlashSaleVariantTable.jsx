import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const formatPrice = value =>
  Number(value || 0).toLocaleString('vi-VN') + '₫';

const FlashSaleVariantTable = ({
  variants = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
  canEdit
}) => {
  if (!variants.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <h3 className="text-sm font-semibold text-slate-700">
          Chưa có sản phẩm nào trong Flash Sale
        </h3>
        <p className="text-xs text-gray-500 mt-2">
          Hãy thêm sản phẩm đầu tiên vào chương trình Flash Sale.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs uppercase font-bold text-gray-500">
                Sản phẩm
              </th>
              <th className="px-4 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Phân loại
              </th>
              <th className="px-4 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Giá gốc
              </th>
              <th className="px-4 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Flash Sale
              </th>
              <th className="px-4 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Tồn Flash
              </th>
              <th className="px-4 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Đã bán
              </th>
              <th className="px-6 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {variants.map(item => {
              const variant = item.variant || {};
              const product = variant.product || {};
              const image = product.thumbnailUrl || product.images?.[0]?.imageUrl;

              return (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 min-w-[260px]">
                      <img
                        src={image || '/placeholder-product.png'}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 bg-gray-100"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          SKU: {variant.sku}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <div className="text-xs text-slate-700">
                      <div>{variant.color || '-' }</div>
                      <div className="text-gray-400 mt-1">
                        {variant.size || '-' }
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center font-semibold text-slate-700">
                    {formatPrice(variant.price)}
                  </td>

                  <td className="px-4 py-5 text-center">
                    <div className="font-bold text-rose-600">
                      {formatPrice(item.flashSalePrice)}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      -{Math.round((1 - Number(item.flashSalePrice) / Number(variant.price || 1)) * 100)}%
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <div className="font-semibold text-slate-700">
                      {item.flashSaleStock}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Kho: {variant.stockQuantity}
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center font-semibold text-indigo-600">
                    {item.soldCount}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(item)}
                        disabled={!canEdit}
                      >
                        Sửa
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete?.(item.id)}
                        disabled={!canEdit}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-200 p-5 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default FlashSaleVariantTable;