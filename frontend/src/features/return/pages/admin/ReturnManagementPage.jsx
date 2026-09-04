import React from 'react';

import ReturnHeader from '../../components/admin/ReturnHeader';
import ReturnTable from '../../components/admin/ReturnTable';
import ReturnDetailModal from '../../components/admin/ReturnDetailModal';

import { useReturnAdmin } from '../../hooks/useReturnAdmin';

const ReturnManagementPage = () => {
  const {
    loading,
    actionLoading,
    detailLoading,
    returns,
    pagination,
    filters,
    search,
    selectedReturn,
    detailOpen,
    openDetail,
    closeDetail,
    handleSearchInput,
    handleSearch,
    handleStatusChange,
    handlePageChange,
    approveReturn,
    rejectReturn,
    markReceived,
    completeReturn
  } = useReturnAdmin();

  return (
    <>
      <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">
        <ReturnHeader
          search={search}
          onSearch={handleSearchInput}
          onSearchClick={handleSearch}
          status={filters.status}
          onStatusChange={handleStatusChange}
        />

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <ReturnTable
            returns={returns}
            loading={loading}
            pagination={pagination}
            onDetail={openDetail}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <ReturnDetailModal
        isOpen={detailOpen}
        onClose={closeDetail}
        returnRequest={selectedReturn}
        loading={detailLoading}
        actionLoading={actionLoading}
        onApprove={approveReturn}
        onReject={rejectReturn}
        onReceived={markReceived}
        onComplete={completeReturn}
      />
    </>
  );
};

export default ReturnManagementPage;