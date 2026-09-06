import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import AvailableVariantTable from './AvailableVariantTable';

const AvailableVariantModal = ({
  isOpen,
  onClose,
  availableLoading,
  groupedAvailableProducts,
  expandedProducts,
  toggleExpandedProduct,
  selectedVariants,
  bulkPrice,
  bulkStock,
  setBulkPrice,
  setBulkStock,
  applyBulkValue,
  search,
  categoryId,
  brandId,
  categories,
  brands,
  onSearch,
  onCategoryChange,
  onBrandChange,
  currentPage,
  totalPages,
  onPageChange,
  onToggleSelect,
  onToggleSelectProduct,
  onToggleSelectAll,
  onUpdateSelected,
  onSubmit
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm sản phẩm vào Flash Sale"
      size="full"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={availableLoading}
          >
            Hủy
          </Button>

          <Button
            variant="primary"
            onClick={onSubmit}
            isLoading={availableLoading}
            disabled={!selectedVariants.length}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Thêm ({selectedVariants.length})
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Tìm tên hoặc SKU..."
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          />

          <select
            value={categoryId}
            onChange={e => onCategoryChange(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          >
            <option value="">Tất cả danh mục</option>

            {categories.map(item => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={brandId}
            onChange={e => onBrandChange(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          >
            <option value="">Tất cả thương hiệu</option>

            {brands.map(item => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {selectedVariants.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500">
                  Selected
                </div>

                <div className="text-sm font-semibold text-rose-600">
                  {selectedVariants.length} variants
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Flash Price
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={bulkPrice}
                    onChange={e => setBulkPrice(e.target.value)}
                    placeholder="190000"
                    className="w-40 rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Flash Stock
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={bulkStock}
                    onChange={e => setBulkStock(e.target.value)}
                    placeholder="30"
                    className="w-32 rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={applyBulkValue}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        <AvailableVariantTable
        loading={availableLoading}
        products={groupedAvailableProducts}
        expandedProducts={expandedProducts}
        onToggleExpand={toggleExpandedProduct}
        selectedVariants={selectedVariants}
        onToggleSelect={onToggleSelect}
        onToggleSelectProduct={onToggleSelectProduct}
        onToggleSelectAll={onToggleSelectAll}
        onUpdateSelected={onUpdateSelected}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      </div>
    </Modal>
  );
};

export default AvailableVariantModal;