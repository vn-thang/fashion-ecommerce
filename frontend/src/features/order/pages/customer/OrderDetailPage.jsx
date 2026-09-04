import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import Button from '../../../../shared/components/Button';
import { orderApi } from '../../api/orderApi';
import CancelOrderModal from '../../shares/CancelOrderModal';
import toast from 'react-hot-toast';

import OrderHeader from '../../components/customer/OrderHeader';
import ShippingAddress from '../../components/customer/ShippingAddress';
import OrderItemsList from '../../components/customer/OrderItemsList';
import OrderSummary from '../../components/customer/OrderSummary';
import CreateReviewModal from '../../../review/components/customer/CreateReviewModal';
import ReturnRequestModal from '../../../return/components/customer/ReturnRequestModal';

const STATUS_CONFIG = {
  PENDING: { label: 'CHỜ XÁC NHẬN', color: 'text-orange-600', bg: 'bg-orange-50' },
  PROCESSING: { label: 'ĐANG XỬ LÝ ', color: 'text-blue-600', bg: 'bg-blue-50' },
  SHIPPING: { label: 'ĐANG GIAO', color: 'text-blue-600', bg: 'bg-blue-50' },
  COMPLETED: { label: 'HOÀN THÀNH', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  CANCELLED: { label: 'ĐÃ HỦY', color: 'text-gray-500', bg: 'bg-gray-100' },
  RETURN: { label: 'HOÀN HÀNG', color: 'text-rose-600', bg: 'bg-rose-50' },
};

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('vi-VN', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { order, loading, refreshOrder,  cancelOrder,  retryPayment } = useOrderDetails();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const isVnpayPending =
  order?.status === 'PENDING' &&
  order?.payment?.paymentMethod === 'VNPAY' &&
  order?.payment?.status === 'PENDING';

const handleConfirmCancel = async reason => {
  await cancelOrder(reason);

  setIsCancelModalOpen(false);

  refreshOrder();
};

  const handleOpenReviewModal = (item) => {
    setSelectedItemForReview(item);
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
    refreshOrder(); 
  };

  if (loading) return <div className="max-w-4xl mx-auto py-10 text-center text-gray-500">Đang tải dữ liệu...</div>;
  
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Không tìm thấy đơn hàng</h2>
        <Button variant="outline" onClick={() => navigate('/account/orders')}>Quay lại danh sách</Button>
      </div>
    );
  }
  
  const hasReturnRequest = order.returnRequests?.length > 0;
  
return (
  <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-5 sm:py-6">
    <button
      onClick={() => navigate('/account/orders')}
      className="mb-4 flex items-center text-sm text-gray-500 transition-colors hover:text-gray-800"
    >
      ← <span className="ml-1">Quay lại danh sách đơn hàng</span>
    </button>

    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <OrderHeader
        order={order}
        statusConfig={STATUS_CONFIG}
        formatDate={formatDate}
      />
      <ShippingAddress order={order} />
    </div>

    <OrderItemsList
      items={order.items}
      formatPrice={formatPrice}
      orderStatus={order.status}
      onReviewClick={handleOpenReviewModal}
      onRetryPayment={retryPayment}
    />

    <OrderSummary order={order} formatPrice={formatPrice} />

<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
  {isVnpayPending && (
    <Button
      variant="primary"
      onClick={retryPayment}
      className="w-full bg-[#ee4d2d] text-white hover:bg-[#d74123] sm:w-auto"
    >
      Thanh toán ngay
    </Button>
  )}

  {(order.status === 'PENDING' ||
    order.status === 'PROCESSING') && (
    <Button
      variant="danger"
      onClick={() => setIsCancelModalOpen(true)}
      className="w-full sm:w-auto"
    >
      Hủy đơn hàng
    </Button>
  )}

{order.status === 'COMPLETED' && (
  hasReturnRequest ? (
    <Button
      variant="outline"
      onClick={() => navigate('/account/returns')}
      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 sm:w-auto"
    >
      Xem trả hàng
    </Button>
  ) : (
    <Button
      variant="outline"
      onClick={() => setIsReturnModalOpen(true)}
      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 sm:w-auto"
    >
      Trả hàng
    </Button>
  )
)}
</div>

    {selectedItemForReview && (
      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedItemForReview(null);
        }}
        orderItem={selectedItemForReview}
        onSuccess={handleReviewSuccess}
      />
    )}

    <ReturnRequestModal
  isOpen={isReturnModalOpen}
  order={order}
  onClose={() => setIsReturnModalOpen(false)}
  onSuccess={refreshOrder}
/>

    <CancelOrderModal
      isOpen={isCancelModalOpen}
      order={order}
      onClose={() => setIsCancelModalOpen(false)}
      onConfirm={handleConfirmCancel}
      loading={loading}
    />
  </div>
);
};

export default OrderDetailPage;