import { useState } from 'react';
import toast from 'react-hot-toast';

import { useMyOrders } from '../../hooks/useMyOrders';

import MyOrderTabs from '../../components/customer/MyOrderTabs';
import MyOrderItem from '../../components/customer/MyOrderItem';
import CancelOrderModal from '../../shares/CancelOrderModal';
import ReturnRequestModal from '../../../return/components/customer/ReturnRequestModal';

import Button from '../../../../shared/components/Button';
import CreateReviewModal from '../../../review/components/customer/CreateReviewModal';
import CustomerPageHeader from '../../../../shared/components/CustomerPageHeader';

const MyOrdersPage = () => {
  const {
    orders,
    loading,
    filters,
    meta,
    handleTabChange,
    handlePageChange,
    refreshOrders,
    cancelOrder,
    retryPayment
  } = useMyOrders();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);

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

  const handleOpenReturnModal = order => {
  setSelectedReturnOrder(order);
  setIsReturnModalOpen(true);
};

  const handleConfirmCancel = async reason => {
  await cancelOrder(selectedOrder.id, reason);

  setIsCancelModalOpen(false);
  setSelectedOrder(null);

  refreshOrders();
};

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 py-2">
      <CustomerPageHeader
        title="Đơn mua"
        description="Theo dõi trạng thái, thanh toán và lịch sử đơn hàng của bạn."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <MyOrderTabs
          currentTab={filters.status}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
            Đang tải dữ liệu...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-14">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
              alt="Empty Order"
              className="mx-auto mb-4 h-20 w-20 opacity-50"
            />

            <p className="font-medium text-slate-700">
              Chưa có đơn hàng nào
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Các đơn hàng bạn đặt sẽ xuất hiện tại đây.
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
              onRetryPayment={retryPayment}
                onReturnClick={handleOpenReturnModal}
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

    {isReturnModalOpen && selectedReturnOrder && (
      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        order={selectedReturnOrder}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedReturnOrder(null);
        }}
        onSuccess={refreshOrders}
      />
    )}
    </div>
  );
};

export default MyOrdersPage;