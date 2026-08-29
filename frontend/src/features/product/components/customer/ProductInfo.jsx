import React from 'react';

const ProductInfo = ({
  product,
  displayPrice,
  displayOriginalPrice,
  isFlashSale,
  displayStock,
  quantity,
  availableColors,
  availableSizes,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  handleQuantityChange,
  handleAddToCart,
  handleBuyNow
}) => {
  const rating = Number(product.rating) || 0;
  const soldCount = product.soldCount || 0;
  const reviewCount = product.reviewCount || 0;

  const formatPrice = price =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(price));

  const formatDisplayPrice = value => {
    if (typeof value === 'number') {
      return formatPrice(value);
    }

    return value;
  };

  const formatCount = num =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;

  const renderPrice = () => {
    if (!isFlashSale) {
      return (
        <div className="text-3xl font-medium text-[#ee4d2d]">
          {formatDisplayPrice(displayPrice)}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-end gap-3">
        <div className="text-3xl font-semibold text-[#ee4d2d]">
          {formatDisplayPrice(displayPrice)}
        </div>

        <div className="text-lg text-gray-400 line-through">
          {formatDisplayPrice(displayOriginalPrice)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full md:w-[60%] flex flex-col">

      <div className="mb-2 flex items-center gap-2">
      {product.brand?.logoUrl && (
        <img
          src={product.brand.logoUrl}
          alt={product.brand.name}
          className="h-6 w-auto max-w-24 object-contain"
        />
      )}

      <span className="text-sm text-gray-500">
        Thương hiệu:
      </span>

      <span className="text-sm font-semibold text-gray-800">
        {product.brand?.name || 'Không xác định'}
      </span>
    </div>

      <h1 className="text-xl md:text-2xl font-medium text-gray-800 leading-8 mb-3">
        <span className="bg-[#ee4d2d] text-white text-xs px-2 py-1 rounded-sm mr-2 font-semibold">
          Yêu thích
        </span>

        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
        <div className="flex items-center gap-1 border-r pr-4 border-gray-200">
          <span className="text-[#ee4d2d] underline font-medium">
            {rating > 0 ? rating.toFixed(1) : 'Chưa có'}
          </span>

          <div className="text-amber-400 text-xs">
            {'★'.repeat(Math.round(rating))}
          </div>
        </div>

        <div className="border-r pr-4 border-gray-200">
          <span className="text-gray-800 font-medium mr-1">
            {formatCount(reviewCount)}
          </span>
          Đánh giá
        </div>

        <div>
          <span className="text-gray-800 font-medium mr-1">
            {formatCount(soldCount)}
          </span>
          Đã bán
        </div>
      </div>

      <div className="bg-[#fafafa] px-5 py-5 mb-6">
        {renderPrice()}
      </div>

      <div className="flex flex-col gap-6 mb-8">
        {availableColors.length > 0 && (
          <div className="flex gap-4">
            <span className="w-24 text-sm text-gray-500 mt-2">
              Màu sắc
            </span>

            <div className="flex flex-wrap gap-2 flex-1">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() =>
                    setSelectedColor(prev =>
                      prev === color ? null : color
                    )}
                  className={`px-4 py-2 border rounded text-sm transition ${
                    selectedColor === color
                      ? 'border-[#ee4d2d] text-[#ee4d2d]'
                      : 'border-gray-300 hover:border-[#ee4d2d]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div className="flex gap-4">
            <span className="w-24 text-sm text-gray-500 mt-2">
              Kích cỡ
            </span>

            <div className="flex flex-wrap gap-2 flex-1">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() =>
                  setSelectedSize(prev =>
                    prev === size ? null : size
                  )}
                  className={`px-4 py-2 border rounded text-sm transition ${
                    selectedSize === size
                      ? 'border-[#ee4d2d] text-[#ee4d2d]'
                      : 'border-gray-300 hover:border-[#ee4d2d]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className="w-24 text-sm text-gray-500">
            Số lượng
          </span>

          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange('minus')}
              className="w-8 h-8 border"
            >
              -
            </button>

            <input
              readOnly
              value={quantity}
              className="w-12 h-8 border-y text-center"
            />

            <button
              onClick={() => handleQuantityChange('plus')}
              className="w-8 h-8 border"
            >
              +
            </button>
          </div>

          <span className="text-sm text-gray-500">
            {displayStock} sản phẩm có sẵn
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          className="h-12 px-6 border border-[#ee4d2d] bg-[#ffeee8] text-[#ee4d2d] rounded hover:bg-[#ffe3d8]"
        >
          🛒 Thêm vào giỏ hàng
        </button>

        <button
          onClick={handleBuyNow}
          className="h-12 w-40 bg-[#ee4d2d] text-white rounded hover:bg-[#d74123]"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;