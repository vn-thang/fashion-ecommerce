import React from 'react';
import Button from '../../../../shared/components/Button';

const OrderItemsList = ({
  items,
  formatPrice,
  orderStatus,
  onReviewClick
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="p-4 sm:p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Sản phẩm
        </h2>

        <div className="space-y-4">
          {items?.map((item) => {
            const variant = item.variant || {};
            const product = variant.product || {};

            const thumbnailUrl =
              product.thumbnailUrl ||
              'https://placehold.co/80x80?text=No+Image';

            const hasReviewed =
              item.reviews && item.reviews.length > 0;

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
                className="flex gap-4 py-4 border-t border-gray-50 first:border-0 first:py-0"
              >
                <img
                  src={thumbnailUrl}
                  alt={item.productName || product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 line-clamp-2">
                        {item.productName || product.name}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        Phân loại: {item.color} - {item.size}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {isFlashSale && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </p>
                      )}

                      <p className="font-semibold text-[#ee4d2d]">
                        {formatPrice(currentPrice)}
                      </p>

                      <p className="text-sm text-gray-500">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm font-medium text-rose-600">
                      Thành tiền:{' '}
                      {formatPrice(
                        currentPrice * Number(item.quantity)
                      )}
                    </div>

                    {orderStatus === 'COMPLETED' &&
                      (hasReviewed ? (
                        <span className="text-xs text-gray-400 italic font-medium border border-gray-100 px-3 py-1.5 rounded-md bg-gray-50 select-none">
                          Đã đánh giá
                        </span>
                      ) : (
                        <Button
                          onClick={() => onReviewClick(item)}
                          className="bg-[#ee4d2d] hover:bg-[#d74123] text-white h-8 text-xs font-medium px-4 rounded-md shadow-sm"
                        >
                          Đánh giá
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;