import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlashSaleHeader from '../../components/admin/FlashSaleHeader';
import FlashSaleStats from '../../components/admin/FlashSaleStats';
import FlashSaleTable from '../../components/admin/FlashSaleTable';
import FlashSaleForm from '../../components/admin/FlashSaleForm';

import { useFlashSaleAdmin } from '../../hooks/useFlashSaleAdmin';

const FlashSaleAdminPage = () => {
  const navigate = useNavigate();
  const {
    loading,
    flashSales,
    stats,
    search,
    currentPage,
    totalPages,
    totalItems,

    isFormOpen,
    editingFlashSale,

    handleSearch,
    handlePageChange,
    handleDisable,

    openCreate,
    openEdit,
    closeForm,

    refreshFlashSales
  } = useFlashSaleAdmin();

const handleManageVariants = flashSale => {
  navigate(`/admin/flashSales/${flashSale.id}/variants`);
};
  return (
    <>
      <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <FlashSaleHeader
          totalCount={totalItems}
          search={search}
          onSearch={handleSearch}
          onCreate={openCreate}
        />

        <FlashSaleStats
          stats={stats}
        />

        {loading && flashSales.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
         <FlashSaleTable
          flashSales={flashSales}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onDisable={handleDisable}
          onEdit={openEdit}
          onManageVariants={handleManageVariants}
        />
        )}
      </div>
      
      <FlashSaleForm
        isOpen={isFormOpen}
        onClose={closeForm}
        flashSale={editingFlashSale}
        onSuccess={() => refreshFlashSales(currentPage)}
      />
     
    </>
  );
};

export default FlashSaleAdminPage;