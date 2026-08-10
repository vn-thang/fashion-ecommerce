import React from 'react';

const CheckoutItems = ({ items = [], formatPrice }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-md font-bold mb-4 text-gray-800 border-b pb-2 text-left">
        Sản phẩm đặt mua ({items.length})
      </h2>

      <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 pr-1">
        {items.map((item) => {
          const product = item.product || {};

          const productName =
            item.productName || product.name || 'Sản phẩm';

          const thumbnailUrl =
            product.thumbnailUrl ||
            product.image ||
            'https://placehold.co/60x60?text=No+Image';

          const colorName = item.color || 'Mặc định';
          const sizeName = item.size || 'Mặc định';
          const originalPrice = Number(
            item.originalPrice ?? item.price ?? item.unitPrice ?? 0
          );

          const unitPrice = Number(
            item.unitPrice ?? item.price ?? 0
          );

          const hasFlashSale = originalPrice > unitPrice;

          return (
            <div key={item.id} className="flex gap-3 py-3 text-sm">
              <img
                src={thumbnailUrl}
                alt={productName}
                className="w-12 h-12 object-cover rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0"
              />

              <div className="flex-1 text-left flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-gray-800 line-clamp-1">
                    {productName}
                  </h4>

                  <p className="text-xs text-gray-400 mt-0.5">
                    Phân loại: {colorName} - {sizeName}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    x{item.quantity}
                  </span>

                  <div className="text-right">
                    {hasFlashSale ? (
                      <>
                        <div className="text-xs text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </div>

                        <div className="font-semibold text-red-500">
                          {formatPrice(unitPrice)}
                        </div>
                      </>
                    ) : (
                      <div className="font-semibold text-gray-700">
                        {formatPrice(unitPrice)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutItems;