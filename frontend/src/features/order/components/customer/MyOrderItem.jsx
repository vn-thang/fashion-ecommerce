import React from 'react';
import Button from '../../../../shared/components/Button';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  PENDING: { label: 'CHỜ XÁC NHẬN', color: 'text-orange-500' },
  PROCESSING: { label: 'ĐANG XỬ LÝ ', color: 'text-blue-500' },
  SHIPPING: { label: 'ĐANG GIAO', color: 'text-blue-500' },
  COMPLETED: { label: 'HOÀN THÀNH', color: 'text-green-600' },
  CANCELLED: { label: 'ĐÃ HỦY', color: 'text-gray-500' },
  RETURN: { label: 'HOÀN HÀNG', color: 'text-red-500' },
};

const MyOrderItem = ({ order, formatPrice, onCancel, onReviewClick, onRetryPayment, onReturnClick }) => {
  const navigate = useNavigate();

  const statusConfig =
    STATUS_CONFIG[order.status] || {
      label: order.status,
      color: 'text-gray-800',
    };

    const isVnpayPending =
    order?.status === 'PENDING' &&
    order?.payment?.paymentMethod === 'VNPAY' &&
    order?.payment?.status === 'PENDING';

  const totalItems = order.items?.length || 0;

  const reviewedItemsCount =
    order.items?.filter(
      (item) => item.reviews && item.reviews.length > 0
    ).length || 0;

  const isAllReviewed =
    totalItems > 0 && reviewedItemsCount === totalItems;
    
    const hasReturnRequest = order.returnRequests?.length > 0;
  const handleReviewClick = () => {
    if (totalItems === 1) {
      onReviewClick?.(order.items[0]);
    } else {
      navigate(`/account/orders/${order.id}`);
    }
  };

return (
  <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
    <div className="flex flex-col gap-2 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="truncate text-sm font-semibold text-gray-800">
        Mã đơn: {order.orderNumber || order.id}
      </span>

      <span
        className={`shrink-0 text-xs font-bold uppercase sm:text-sm ${statusConfig.color}`}
      >
        {statusConfig.label}
      </span>
    </div>

    <div
      className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
      onClick={() => navigate(`/account/orders/${order.id}`)}
    >
      {order.items?.map(item => {
        const variant = item.variant || {};
        const product = variant.product || {};

        const thumbnailUrl =
          product.thumbnailUrl ||
          'https://placehold.co/80x80?text=No+Image';

        const originalPrice = Number(
          item.originalPrice || item.unitPrice
        );
        const currentPrice = Number(item.unitPrice || 0);

        const isFlashSale =
          item.originalPrice &&
          Number(item.originalPrice) > Number(item.unitPrice);

        return (
          <div
            key={item.id}
            className="flex gap-3 border-b border-gray-50 py-3 last:border-0 sm:gap-4"
          >
            <img
              src={thumbnailUrl}
              alt={item.productName || 'Sản phẩm'}
              className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover sm:h-20 sm:w-20"
            />

            <div className="flex min-w-0 flex-1 flex-col justify-between text-sm">
              <div className="min-w-0">
                <h4 className="line-clamp-2 font-medium text-gray-800">
                  {item.productName || product.name || 'Sản phẩm'}
                </h4>

                <p className="mt-1 truncate text-xs text-gray-500">
                  Phân loại: {item.color} - {item.size}
                </p>
              </div>

              <div className="mt-2 flex items-end justify-between gap-3">
                <span className="shrink-0 text-gray-500">
                  x{item.quantity}
                </span>

                <div className="flex min-w-0 flex-col items-end">
                  {isFlashSale && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}

                  <span className="font-semibold text-[#ee4d2d]">
                    {formatPrice(currentPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div className="flex flex-col gap-4 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-2 text-sm text-gray-600 sm:justify-start">
        <span>Thành tiền:</span>

        <span className="text-lg font-bold text-[#ee4d2d] sm:text-xl">
          {formatPrice(order.totalAmount)}
        </span>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

          {isVnpayPending && (
    <Button
      variant="primary"
      className="w-full bg-[#ee4d2d] text-white hover:bg-[#d74123] sm:w-auto"
      onClick={(e) => {
        e.stopPropagation();
        onRetryPayment?.(order.id);
      }}
    >
      Thanh toán ngay
    </Button>
  )}

        {(order.status === 'PENDING' ||
          order.status === 'PROCESSING') && (
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 sm:w-auto"
            onClick={onCancel}
          >
            Hủy đơn
          </Button>
        )}

{order.status === 'COMPLETED' && (
  hasReturnRequest ? (
    <Button
      variant="outline"
      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 sm:w-auto"
      onClick={e => {
        e.stopPropagation();
        navigate('/account/returns');
      }}
    >
      Xem trả hàng
    </Button>
  ) : (
    <Button
      variant="outline"
      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 sm:w-auto"
      onClick={e => {
        e.stopPropagation();
        onReturnClick?.(order);
      }}
    >
      Trả hàng
    </Button>
  )
)}

        {order.status === 'COMPLETED' &&
          (isAllReviewed ? (
            <span className="flex w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium italic text-gray-400 sm:w-auto">
              Đã đánh giá
            </span>
          ) : (
            <Button
              onClick={handleReviewClick}
              className="w-full bg-[#ee4d2d] text-white hover:bg-[#d74123] sm:w-auto"
            >
              {totalItems === 1
                ? 'Đánh giá'
                : 'Đánh giá sản phẩm'}
            </Button>
          ))}

        <Button
          variant="primary"
          className="w-full bg-slate-800 text-white hover:bg-slate-700 sm:w-auto"
          onClick={() => navigate(`/account/orders/${order.id}`)}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  </div>
);
};

export default MyOrderItem;