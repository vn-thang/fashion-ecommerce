import React from 'react';
import { Link } from 'react-router-dom';

const FlashSaleCard = ({ product }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);

  const image =
    product.thumbnailUrl ||
    'https://via.placeholder.com/300x300?text=No+Image';

  const minOriginalPrice = Number(product.minOriginalPrice || 0);
  const maxOriginalPrice = Number(product.maxOriginalPrice || 0);

  const minFlashPrice = Number(product.minFlashPrice || 0);
  const maxFlashPrice = Number(product.maxFlashPrice || 0);

  const discount =
    minOriginalPrice > 0
      ? Math.round(
          ((minOriginalPrice - minFlashPrice) / minOriginalPrice) * 100
        )
      : 0;

  const sold = Number(product.soldCount || 0);
  const stock = Number(product.flashSaleStock || 0);

  const total = sold + stock;

  const percent =
    total > 0
      ? Math.min((sold / total) * 100, 100)
      : 0;

 const renderFlashPrice = () => (
  <div className="flex items-baseline gap-1">
    <span className="text-sm font-medium text-[#ee4d2d]">
      Từ
    </span>

    <span className="text-xl font-bold text-[#ee4d2d]">
      {formatPrice(minFlashPrice)}
    </span>
  </div>
);

const renderOriginalPrice = () => (
  <div className="flex items-baseline gap-1 mt-1">
    <span className="text-sm text-gray-400">
      Từ
    </span>

    <span className="text-sm text-gray-400 line-through">
      {formatPrice(minOriginalPrice)}
    </span>
  </div>
);

  return (
    <Link
      to={`/product/${product.productSlug}`}
      className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {discount > 0 && (
          <div className="absolute top-0 right-0 bg-[#ffd839] text-[#ee4d2d] text-xs font-bold px-2 py-1 rounded-bl-lg">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col">
        <h3 className="line-clamp-2 text-sm text-gray-800 min-h-[40px] group-hover:text-[#ee4d2d] transition-colors">
          {product.productName}
        </h3>
        {renderOriginalPrice()}
        <div className="mt-3">
          {renderFlashPrice()}
          
        </div>
        <div className="mt-3">

          <div className="w-full h-5 rounded-full bg-orange-100 overflow-hidden relative">

            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{
                width: `${percent}%`
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">
              Đã bán {sold}
            </div>

          </div>

        </div>

      </div>
    </Link>
  );
};

export default FlashSaleCard;