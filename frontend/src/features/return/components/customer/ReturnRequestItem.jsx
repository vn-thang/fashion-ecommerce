import React from 'react';

const ReturnRequestItem = ({
  item,
  selected,
  quantity,
  onToggle,
  onQuantityChange
}) => {
  const maxQuantity = item.quantity;
  const unitPrice = Number(item.unitPrice || 0);
  const discountAmount = Number(item.discountAmount || 0);
  const netAmount = itemQuantity => {
    const totalNetAmount =
      Number(item.subtotal || 0) - discountAmount;

    const netUnitPrice =
      item.quantity > 0
        ? totalNetAmount / item.quantity
        : unitPrice;

    return netUnitPrice * itemQuantity;
  };

  const refundAmount = selected
    ? netAmount(quantity)
    : 0;

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        selected
          ? 'border-orange-300 bg-orange-50/50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(item.id)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />

        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {item.variant?.product?.thumbnailUrl ? (
            <img
              src={item.variant.product.thumbnailUrl}
              alt={item.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl text-gray-300">
              🖼️
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-slate-800">
            {item.productName}
          </h4>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            {item.color && <span>Màu: {item.color}</span>}
            {item.size && <span>Size: {item.size}</span>}
            <span>
              Giá mua: {unitPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Đã mua: <span className="font-medium text-gray-700">{maxQuantity}</span>
          </div>

          {selected && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Số lượng trả:
                </span>

                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(
                        item.id,
                        Math.max(1, quantity - 1)
                      )
                    }
                    disabled={quantity <= 1}
                    className="h-9 w-9 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="flex h-9 w-10 items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(
                        item.id,
                        Math.min(maxQuantity, quantity + 1)
                      )
                    }
                    disabled={quantity >= maxQuantity}
                    className="h-9 w-9 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">
                  Hoàn dự kiến:{' '}
                </span>
                <span className="font-bold text-orange-600">
                  {refundAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestItem;