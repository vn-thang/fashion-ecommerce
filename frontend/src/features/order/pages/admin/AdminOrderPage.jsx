import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

import OrderHeader from '../../components/admin/OrderHeader';
import OrderTable from '../../components/admin/OrderTable';
import OrderDetailContent from '../../components/admin/OrderDetailContent';
import CancelOrderModal from '../../shares/CancelOrderModal';

import { useAdminOrders } from '../../hooks/useAdminOrders';

const AdminOrderPage = () => {
  const location = useLocation();

  const {
    orders,
    meta,
    loading,
    filters,

    selectedOrder,
    isModalOpen,
    modalLoading,
    setIsModalOpen,

    isCancelModalOpen,
    setIsCancelModalOpen,

    handlePageChange,
    handleFilterChange,
    handleViewDetails,
    handleUpdateStatus,
    handleCancelOrder,
    handleClearCustomerFilter,

    setOrderFilters
  } = useAdminOrders();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setOrderFilters({
      customerId: params.get('customerId') || '',
      customerName: params.get('customerName') || ''
    });
  }, [location.search]);

  return (
    <>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fadeIn">
        <OrderHeader
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearCustomerFilter={handleClearCustomerFilter}
        />

        <OrderTable
          orders={orders}
          meta={meta}
          loading={loading}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsCancelModalOpen(false);
        }}
        title={
          selectedOrder
            ? `Chi tiết đơn hàng: ${selectedOrder.orderNumber}`
            : 'Đang tải đơn hàng...'
        }
        size="xl"
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
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

            <p className="text-gray-500">
              Đang tải chi tiết đơn hàng...
            </p>
          </div>
        ) : (
          <OrderDetailContent
            order={selectedOrder}
            onUpdateStatus={handleUpdateStatus}
            onOpenCancel={() => setIsCancelModalOpen(true)}
          />
        )}
      </Modal>

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        order={selectedOrder}
        loading={loading}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
      />
    </>
  );
};

export default AdminOrderPage;