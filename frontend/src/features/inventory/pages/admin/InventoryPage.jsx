import React from 'react';

import InventoryHeader from '../../components/admin/InventoryHeader';
import InventoryFilter from '../../components/admin/InventoryFilter';
import InventoryTable from '../../components/admin/InventoryTable';
import InventoryImportModal from '../../components/admin/InventoryImportModal';
import InventoryAdjustmentModal from '../../components/admin/InventoryAdjustmentModal';
import InventoryDetailModal from '../../components/admin/InventoryDetailModal';

import { useInventory } from '../../hooks/useInventory';

const InventoryPage = () => {
  const {
    loading,
    saving,
    loadingVariants,

    transactions,
    variants,
    pagination,

    filters,
    form,
    variantKeyword,

    selectedTransaction,

    isImportOpen,
    isAdjustmentOpen,
    isDetailOpen,

    setVariantKeyword,
    setIsDetailOpen,

    handleChange,
    handleFilterChange,

    fetchTransactionDetail,

    searchTransactions,
    changePage,

    importStock,
    adjustStock,

    openImport,
    openAdjustment,

    closeImport,
    closeAdjustment
  } = useInventory();

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">

      <InventoryHeader
        onImport={openImport}
        onAdjustment={openAdjustment}
      />

      <InventoryFilter
        filters={filters}
        handleChange={handleFilterChange}
        onSearch={searchTransactions}
      />

          <InventoryTable
        transactions={transactions}
        pagination={pagination}
        onPageChange={changePage}
        onViewDetail={fetchTransactionDetail}
      />

      <InventoryImportModal
        isOpen={isImportOpen}
        onClose={closeImport}
        form={form}
        variants={variants}
        loadingVariants={loadingVariants}
        keyword={variantKeyword}
        onKeywordChange={setVariantKeyword}
        handleChange={handleChange}
        onSubmit={importStock}
        saving={saving}
      />

      <InventoryAdjustmentModal
        isOpen={isAdjustmentOpen}
        onClose={closeAdjustment}
        form={form}
        variants={variants}
        loadingVariants={loadingVariants}
        keyword={variantKeyword}
        onKeywordChange={setVariantKeyword}
        handleChange={handleChange}
        onSubmit={adjustStock}
        saving={saving}
      />

      <InventoryDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        transaction={selectedTransaction}
      />

    </div>
  );
};

export default InventoryPage;