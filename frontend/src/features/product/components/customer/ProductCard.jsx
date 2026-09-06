
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(price));

  const formatSoldCount = (num) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;

  const productSlug = product.slug || product.id;
  const imageUrl =
    product.thumbnailUrl ||
    'https://via.placeholder.com/300x300?text=No+Image';

  const rating = Number(product.rating) || 0;
  const soldCount = product.soldCount || 0;

  const flash = product.flashSale;
  const isFlashSale = product.isFlashSale && flash;

const renderNormalPrice = () => (
  <div className="flex items-baseline gap-1">
    <span className="text-sm font-medium text-[#ee4d2d]">
      Từ
    </span>

    <span className="text-sm font-bold text-[#ee4d2d]">
      {formatPrice(product.minPrice)}
    </span>
  </div>
);

const renderFlashPrice = () => (
  <div className="flex items-baseline gap-1">
    <span className="text-sm font-medium text-[#ee4d2d]">
      Từ
    </span>

    <span className="text-sm font-bold text-[#ee4d2d]">
      {formatPrice(flash.minFlashPrice)}
    </span>
  </div>
);

const renderOriginalPrice = () => (
  <div className="flex items-baseline gap-1 mt-1">
    <span className="text-sm text-gray-400">
      Từ
    </span>

    <span className="text-sm text-gray-400 line-through">
      {formatPrice(flash.minOriginalPrice)}
    </span>
  </div>
);

  return (
    <Link
      to={`/product/${productSlug}`}
      className="group flex flex-col h-full overflow-hidden rounded border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative pt-[100%] overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />

        {isFlashSale && (
          <div className="absolute right-0 top-0 rounded-bl bg-[#ffd839] px-2 py-1 text-xs font-bold text-[#ee4d2d]">
            -{flash.maxDiscountPercent}%
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-2 min-h-[2.5rem] line-clamp-2 text-sm leading-relaxed text-gray-800 transition-colors group-hover:text-[#ee4d2d]">
          {product.name}
        </h4>

        <div className="mt-auto mb-2 flex items-center gap-2 text-xs text-gray-500">
          {rating > 0 && (
            <>
              <div className="flex items-center text-amber-500">
                <span className="mr-0.5 font-medium">
                  {rating.toFixed(1)}
                </span>

                <svg
                  className="h-3 w-3 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <span className="text-gray-300">|</span>
            </>
          )}

          <span>Đã bán {formatSoldCount(soldCount)}</span>
        </div>

        {isFlashSale ? (
  <>
  {renderOriginalPrice()}
  {renderFlashPrice()}
  </>
) : (
  renderNormalPrice()
)}
      </div>
    </Link>
  );
};

export default ProductCard;