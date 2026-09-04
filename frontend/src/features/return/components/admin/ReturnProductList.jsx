import React from 'react';

const formatPrice = value =>
  Number(value || 0).toLocaleString('vi-VN') + 'đ';

const ReturnProductList = ({ items }) => {
  return (
    <div className="space-y-3">
      {items?.map(item => {
        const orderItem = item.orderItem;
        const product = orderItem?.variant?.product;

        const itemRefund = Math.round(
          ((Number(orderItem?.subtotal || 0) -
            Number(orderItem?.discountAmount || 0)) /
            Number(orderItem?.quantity || 1)) *
            item.quantity
        );

        return (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                {product?.thumbnailUrl ? (
                  <img
                    src={product.thumbnailUrl}
                    alt={orderItem?.productName || 'Sản phẩm'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl text-gray-300">
                    🖼️
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="font-medium text-slate-800">
                  {orderItem?.productName || 'Sản phẩm'}
                </div>

                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  {orderItem?.color && (
                    <span>Màu: {orderItem.color}</span>
                  )}
                  {orderItem?.size && (
                    <span>Size: {orderItem.size}</span>
                  )}
                  <span>Số lượng: {item.quantity}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 text-sm font-semibold text-orange-600">
              {formatPrice(itemRefund)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReturnProductList;