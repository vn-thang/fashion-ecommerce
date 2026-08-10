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
  const { order, loading, refreshOrder,  cancelOrder } = useOrderDetails();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-0">
      <button 
        onClick={() => navigate('/account/orders')}
        className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        ← Quay lại danh sách đơn hàng
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
        <OrderHeader order={order} statusConfig={STATUS_CONFIG} formatDate={formatDate} />
        <ShippingAddress order={order} />
      </div>

      <OrderItemsList 
        items={order.items} 
        formatPrice={formatPrice} 
        orderStatus={order.status}
        onReviewClick={handleOpenReviewModal}
      />
      
      <OrderSummary order={order} formatPrice={formatPrice} />

      <div className="flex justify-end gap-3 mt-4">
       {(order.status === 'PENDING' ||
        order.status === 'PROCESSING') && (
        <Button
          variant="danger"
          onClick={() => setIsCancelModalOpen(true)}
        >
          Hủy đơn hàng
        </Button>
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