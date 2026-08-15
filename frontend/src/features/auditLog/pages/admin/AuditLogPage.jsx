import React from 'react';
import Modal from '../../../../shared/components/Modal';
import AuditLogHeader from '../../components/admin/AuditLogHeader';
import AuditLogFilter from '../../components/admin/AuditLogFilter';
import AuditLogTable from '../../components/admin/AuditLogTable';
import AuditLogDetail from '../../components/admin/AuditLogDetail';
import { useAuditLog } from '../../hooks/useAuditLog';

const AuditLogPage = () => {
  const {
    loading,
    auditLogs,
    pagination,
    search,
    filters,
    detail,
    detailLoading,
    openDetail,
    handleSearchInput,
    handleFilterChange,
    handleSearch,
    handlePageChange,
    handleViewDetail,
    closeDetail
  } = useAuditLog();

  return (
    <>
      <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">
        <AuditLogHeader
          search={search}
          onSearch={handleSearchInput}
          onSearchClick={handleSearch}
        />

        <AuditLogFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onFilter={handleSearch}
        />

        <AuditLogTable
          auditLogs={auditLogs}
          loading={loading}
          pagination={pagination}
          onViewDetail={handleViewDetail}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal
        isOpen={openDetail}
        onClose={closeDetail}
        title="Chi tiết Audit Log"
        size="lg"
      >
        <AuditLogDetail
          detail={detail}
          loading={detailLoading}
        />
      </Modal>
    </>
  );
};

export default AuditLogPage;