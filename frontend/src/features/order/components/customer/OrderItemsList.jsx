import React from 'react';
import Button from '../../../../shared/components/Button';

const OrderItemsList = ({
  items,
  formatPrice,
  orderStatus,
  onReviewClick
}) => { 
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-800">
          Sản phẩm
        </h2>

        <div className="space-y-4">
          {items?.map(item => {
            const variant = item.variant || {};
            const product = variant.product || {};
            const thumbnailUrl =
              product.thumbnailUrl ||
              'https://placehold.co/80x80?text=No+Image';

            const hasReviewed = item.reviews?.length > 0;
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
  className="flex gap-3 border-t border-gray-50 py-4 first:border-0 first:pt-0 sm:gap-4"
>
  <img
    src={thumbnailUrl}
    alt={item.productName || product.name || 'Sản phẩm'}
    className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover sm:h-24 sm:w-24"
  />

  <div className="min-w-0 flex-1">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 break-words text-sm font-medium text-gray-800 sm:text-base">
          {item.productName || product.name || 'Sản phẩm'}
        </h4>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Phân loại: {item.color} - {item.size}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:block sm:min-w-[120px] sm:text-right">
        <div>
          {isFlashSale && (
            <span className="mr-2 text-[11px] text-gray-400 line-through sm:mr-0 sm:block sm:text-xs">
              {formatPrice(originalPrice)}
            </span>
          )}

          <span className="text-sm font-semibold text-[#ee4d2d] sm:text-base">
            {formatPrice(currentPrice)}
          </span>
        </div>

        <span className="text-xs text-gray-500 sm:block sm:text-sm">
          x{item.quantity}
        </span>
      </div>
    </div>

    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-medium text-rose-600 sm:text-sm">
        Thành tiền: {formatPrice(currentPrice * Number(item.quantity))}
      </p>

      {orderStatus === 'COMPLETED' &&
        (hasReviewed ? (
          <span className="self-start rounded-md border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium italic text-gray-400 sm:self-auto">
            Đã đánh giá
          </span>
        ) : (
          <Button
            onClick={() => onReviewClick(item)}
            className="w-full bg-[#ee4d2d] px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#d74123] sm:w-auto"
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