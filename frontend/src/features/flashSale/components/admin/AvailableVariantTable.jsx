import React from 'react';
import Pagination from '../../../../shared/components/Pagination';

const AvailableVariantTable = ({
  loading,
  products = [],
  expandedProducts = [],
  onToggleExpand,
  selectedVariants = [],
  onToggleSelect,
  onToggleSelectProduct,
  onToggleSelectAll,
  onUpdateSelected,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const getSelectedItem = id =>
    selectedVariants.find(item => item.productVariantId === id);

  const isProductSelected = product =>
  product.variants.length > 0 &&
  product.variants.every(variant =>
    selectedVariants.some(
      item => item.productVariantId === variant.id
    )
  );

  const isAllSelected =
    products.length > 0 &&
    products.every(product => isProductSelected(product));

  if (loading && products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 py-12 text-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-xl border border-gray-200 py-12 text-center text-gray-500">
        Không có sản phẩm phù hợp.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-slate-50 px-5 py-3">
      <input
      type="checkbox"
      checked={isAllSelected}
      onChange={() => onToggleSelectAll(products)}
      className="h-4 w-4 cursor-pointer"
    />

        <span className="text-sm font-medium text-gray-700">
          Chọn tất cả sản phẩm trong trang
        </span>
      </div>

      <div className="divide-y divide-gray-200">
        {products.map(product => {
          const expanded = expandedProducts.includes(product.id);

          return (
            <div key={product.id}>
              <div className="flex items-center border-b border-gray-100 px-5 py-4 hover:bg-slate-50">
                <input
                type="checkbox"
                checked={isProductSelected(product)}
                onChange={() => onToggleSelectProduct(product)}
                className="mr-4 h-4 w-4 cursor-pointer"
                onClick={e => e.stopPropagation()}
              />

                <button
                  type="button"
                  onClick={() => onToggleExpand(product.id)}
                  className="flex flex-1 items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        product.thumbnailUrl ||
                        product.images?.[0]?.imageUrl ||
                        '/images/no-image.png'
                      }
                      alt={product.name}
                      className="h-16 w-16 rounded-lg border object-cover"
                    />

                    <div className="text-left">
                      <div className="font-semibold text-slate-800">
                        {product.name}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        {product.brand?.name}
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        {product.variants.length} variants
                      </div>
                      <div className="text-xs text-rose-600">
                        {
                          product.variants.filter(v =>
                            selectedVariants.some(
                              item => item.productVariantId === v.id
                            )
                          ).length
                        }{" "}
                        / {product.variants.length} selected
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-xl text-gray-500 transition-transform ${
                      expanded ? 'rotate-90' : ''
                    }`}
                  >
                    ▶
                  </div>
                </button>
              </div>

              {expanded && (
                <div className="bg-slate-50 p-5">
                  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full">
                      <thead className="bg-slate-100">
                        <tr className="text-xs font-semibold uppercase text-gray-500">
                          <th className="w-14 px-3 py-3"></th>
                          <th className="px-3 py-3 text-center">SKU</th>
                          <th className="px-3 py-3 text-center">Màu</th>
                          <th className="px-3 py-3 text-center">Size</th>
                          <th className="px-3 py-3 text-center">Giá gốc</th>
                          <th className="px-3 py-3 text-center">Tồn kho</th>
                          <th className="px-3 py-3 text-center">
                            Flash Price
                          </th>
                          <th className="px-3 py-3 text-center">
                            Flash Stock
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {product.variants.map(variant => {
                          const selected =
                            getSelectedItem(variant.id);

                          return (
                            <tr
                              key={variant.id}
                              className="hover:bg-slate-50"
                            >
                              <td className="px-3 py-3 text-center">
                                <input
                                type="checkbox"
                                checked={!!selected}
                                onChange={() => onToggleSelect(variant)}
                                className="h-4 w-4 cursor-pointer"
                              />
                              </td>

                              <td className="px-3 py-3 text-center">
                                {variant.sku}
                              </td>

                              <td className="px-3 py-3 text-center">
                                {variant.color || '-'}
                              </td>

                              <td className="px-3 py-3 text-center">
                                {variant.size || '-'}
                              </td>

                              <td className="px-3 py-3 text-center font-semibold text-rose-600">
                                {Number(
                                  variant.price
                                ).toLocaleString('vi-VN')}
                                ₫
                              </td>

                              <td className="px-3 py-3 text-center">
                                {variant.stockQuantity}
                              </td>

                              <td className="px-3 py-3 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  max={variant.price}
                                  disabled={!selected}
                                  value={
                                    selected?.flashSalePrice || ''
                                  }
                                  onChange={e =>
                                    onUpdateSelected(
                                      variant.id,
                                      'flashSalePrice',
                                      e.target.value
                                    )
                                  }
                                  className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-center disabled:bg-gray-100"
                                />
                              </td>

                              <td className="px-3 py-3 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  max={variant.stockQuantity}
                                  disabled={!selected}
                                  value={
                                    selected?.flashSaleStock || ''
                                  }
                                  onChange={e =>
                                    onUpdateSelected(
                                      variant.id,
                                      'flashSaleStock',
                                      e.target.value
                                    )
                                  }
                                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-center disabled:bg-gray-100"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-200 p-4">
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

export default AvailableVariantTable;