import React from 'react';
import { useParams } from 'react-router-dom';

import FlashSaleVariantHeader from '../../components/admin/FlashSaleVariantHeader';
import FlashSaleVariantTable from '../../components/admin/FlashSaleVariantTable';
import FlashSaleVariantForm from '../../components/admin/FlashSaleVariantForm';
import AvailableVariantModal from '../../components/admin/AvailableVariantModal';

import { useFlashSaleVariantAdmin } from '../../hooks/useFlashSaleVariantAdmin';

const FlashSaleVariantPage = () => {
  const { flashSaleId } = useParams();

  const {
    loading,
    availableLoading,

    variants,

    groupedAvailableProducts,
    expandedProducts,
    toggleExpandedProduct,

    search,
    availableSearch,

    categories,
    brands,

    categoryId,
    brandId,

    currentPage,
    totalPages,
    totalItems,

    availablePage,
    availableTotalPages,

    selectedVariants,

    bulkPrice,
    bulkStock,
    setBulkPrice,
    setBulkStock,
    applyBulkValue,

    editingVariant,

    isAddModalOpen,
    isEditModalOpen,
    isEditable,

    handleSearch,
    handleAvailableSearch,
    handleCategoryChange,
    handleBrandChange,

    handlePageChange,
    handleAvailablePageChange,

    toggleSelect,
    toggleSelectProduct,
    toggleSelectAll,
    updateSelectedVariant,

    handleAddVariants,
    handleRemove,

    openAddModal,
    closeAddModal,

    openEditModal,
    closeEditModal,

    refresh
  } = useFlashSaleVariantAdmin(flashSaleId);

  return (
    <>
      <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <FlashSaleVariantHeader
          totalCount={totalItems}
          search={search}
          onSearch={handleSearch}
          onAdd={openAddModal}
           canEdit={isEditable}
        />

        {loading && variants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <FlashSaleVariantTable
            variants={variants}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEdit={openEditModal}
            onRemove={handleRemove}
             canEdit={isEditable}
          />
        )}
      </div>

      <AvailableVariantModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        availableLoading={availableLoading}
        groupedAvailableProducts={groupedAvailableProducts}
        expandedProducts={expandedProducts}
        toggleExpandedProduct={toggleExpandedProduct}
        selectedVariants={selectedVariants}
        bulkPrice={bulkPrice}
        bulkStock={bulkStock}
        setBulkPrice={setBulkPrice}
        setBulkStock={setBulkStock}
        applyBulkValue={applyBulkValue}
        search={availableSearch}
        categoryId={categoryId}
        brandId={brandId}
        categories={categories}
        brands={brands}
        currentPage={availablePage}
        totalPages={availableTotalPages}
        onSearch={handleAvailableSearch}
        onCategoryChange={handleCategoryChange}
        onBrandChange={handleBrandChange}
        onPageChange={handleAvailablePageChange}
        onToggleSelect={toggleSelect}
        onToggleSelectProduct={toggleSelectProduct}
        onToggleSelectAll={toggleSelectAll}
        onUpdateSelected={updateSelectedVariant}
        onSubmit={handleAddVariants}
         canEdit={isEditable}
      />

      <FlashSaleVariantForm
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        variant={editingVariant}
        onSuccess={refresh}
         canEdit={isEditable}
      />
    </>
  );
};

export default FlashSaleVariantPage;