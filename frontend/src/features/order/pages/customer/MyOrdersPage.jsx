import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useMyOrders } from '../../hooks/useMyOrders';

import MyOrderTabs from '../../components/customer/MyOrderTabs';
import MyOrderItem from '../../components/customer/MyOrderItem';
import CancelOrderModal from '../../shares/CancelOrderModal';

import Button from '../../../../shared/components/Button';
import CreateReviewModal from '../../../review/components/customer/CreateReviewModal';

const MyOrdersPage = () => {
  const {
    orders,
    loading,
    filters,
    meta,
    handleTabChange,
    handlePageChange,
    refreshOrders,
     cancelOrder
  } = useMyOrders();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatPrice = price =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);

  const handleOpenReviewModal = orderItem => {
    setSelectedOrderItem(orderItem);
    setIsReviewModalOpen(true);
  };

  const handleOpenCancelModal = order => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const handleCancelSuccess = () => {
    toast.success('Hủy đơn hàng thành công');
    refreshOrders();
  };

  const handleConfirmCancel = async reason => {
  await cancelOrder(selectedOrder.id, reason);

  setIsCancelModalOpen(false);
  setSelectedOrder(null);

  refreshOrders();
};

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Đơn mua của tôi
      </h1>

      <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
        <MyOrderTabs
          currentTab={filters.status}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
              alt="Empty Order"
              className="w-24 h-24 mx-auto mb-4 opacity-50"
            />

            <p className="text-gray-500 font-medium">
              Chưa có đơn hàng nào
            </p>
          </div>
        ) : (
          orders.map(order => (
            <MyOrderItem
              key={order.id}
              order={order}
              formatPrice={formatPrice}
              onCancel={() => handleOpenCancelModal(order)}
              onReviewClick={handleOpenReviewModal}
            />
          ))
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={meta.currentPage === 1}
            onClick={() => handlePageChange(meta.currentPage - 1)}
          >
            Trước
          </Button>

          <span className="px-4 py-2 font-medium text-gray-600">
            Trang {meta.currentPage} / {meta.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={meta.currentPage === meta.totalPages}
            onClick={() => handlePageChange(meta.currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      {isReviewModalOpen && selectedOrderItem && (
        <CreateReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedOrderItem(null);
          }}
          orderItem={{
            ...selectedOrderItem,
            productId:
              selectedOrderItem.variant?.productId ||
              selectedOrderItem.variant?.product?.id
          }}
          onSuccess={() => {
            toast.success('Đánh giá sản phẩm thành công!');
            refreshOrders();
          }}
        />
      )}

      {isCancelModalOpen && selectedOrder && (
        <CancelOrderModal
        isOpen={isCancelModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmCancel}
        loading={loading}
      />
      )}
    </div>
  );
};

export default MyOrdersPage;