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

const MyOrderItem = ({ order, formatPrice, onCancel, onReviewClick }) => {
  const navigate = useNavigate();

  const statusConfig =
    STATUS_CONFIG[order.status] || {
      label: order.status,
      color: 'text-gray-800',
    };

  const totalItems = order.items?.length || 0;

  const reviewedItemsCount =
    order.items?.filter(
      (item) => item.reviews && item.reviews.length > 0
    ).length || 0;

  const isAllReviewed =
    totalItems > 0 && reviewedItemsCount === totalItems;

  const handleReviewClick = () => {
    if (totalItems === 1) {
      onReviewClick?.(order.items[0]);
    } else {
      navigate(`/account/orders/${order.id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">
          Mã đơn: {order.orderNumber || order.id}
        </span>

        <span
          className={`text-sm font-bold uppercase ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate(`/account/orders/${order.id}`)}
      >
        {order.items?.map((item) => {
          const variant = item.variant || {};
          const product = variant.product || {};

          const thumbnailUrl =
            product.thumbnailUrl ||
            'https://placehold.co/80x80?text=No+Image';

          const originalPrice = Number(item.originalPrice || item.unitPrice);
          const currentPrice = Number(item.unitPrice || 0);

          const isFlashSale =
            item.originalPrice &&
            Number(item.originalPrice) > Number(item.unitPrice);

          return (
            <div
              key={item.id}
              className="flex gap-3 py-3 border-b border-gray-50 last:border-0"
            >
              <img
                src={thumbnailUrl}
                alt={item.productName || 'Sản phẩm'}
                className="w-20 h-20 object-cover rounded-lg border border-gray-100 flex-shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 line-clamp-2">
                    {item.productName || product.name || 'Sản phẩm'}
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Phân loại: {item.color} - {item.size}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500">
                    x{item.quantity}
                  </span>

                  <div className="flex flex-col items-end">
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

      <div className="p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Thành tiền:</span>

          <span className="text-xl font-bold text-[#ee4d2d]">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {(order.status === 'PENDING' ||
            order.status === 'PROCESSING') && (
           <Button
            variant="outline"
            className="flex-1 sm:flex-none text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={onCancel}
          >
            Hủy đơn
          </Button>
          )}

          {order.status === 'COMPLETED' &&
            (isAllReviewed ? (
              <span className="flex-1 sm:flex-none text-xs text-gray-400 italic font-medium border border-gray-200 px-4 py-2 rounded-md bg-gray-50 flex items-center justify-center select-none">
                Đã đánh giá
              </span>
            ) : (
              <Button
                onClick={handleReviewClick}
                className="flex-1 sm:flex-none bg-[#ee4d2d] hover:bg-[#d74123] text-white"
              >
                {totalItems === 1
                  ? 'Đánh giá'
                  : 'Đánh giá sản phẩm'}
              </Button>
            ))}

          <Button
            variant="primary"
            className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white"
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