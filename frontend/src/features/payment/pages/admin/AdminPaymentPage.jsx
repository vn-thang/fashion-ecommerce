import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

import PaymentHeader from '../../components/admin/PaymentHeader';
import PaymentTable from '../../components/admin/PaymentTable';
import PaymentDetailContent from '../../components/admin/PaymentDetailContent';

import { useAdminPayments } from '../../hooks/admin/useAdminPayments';

const AdminPaymentPage = () => {
  const {
    payments,
    meta,
    loading,
    filters,
    selectedPayment,
    isModalOpen,
    modalLoading,
    setIsModalOpen,
    handlePageChange,
    handleFilterChange,
    handleViewDetails
  } = useAdminPayments();

  return (
    <>
      <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <PaymentHeader
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <PaymentTable
          payments={payments}
          meta={meta}
          loading={loading}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedPayment
            ? `Chi tiết thanh toán - ${selectedPayment.order?.orderNumber}`
            : 'Đang tải thông tin thanh toán...'
        }
        size="3xl"
        footer={
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
          >
            Đóng
          </Button>
        }
      >
        {modalLoading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Đang tải thông tin thanh toán...
            </p>
          </div>
        ) : (
          <PaymentDetailContent payment={selectedPayment} />
        )}
      </Modal>
    </>
  );
};

export default AdminPaymentPage;