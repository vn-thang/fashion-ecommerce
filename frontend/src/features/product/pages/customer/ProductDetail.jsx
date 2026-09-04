import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';
import ProductGallery from '../../components/customer/ProductGallery';
import ProductInfo from '../../components/customer/ProductInfo';
import ProductReviewSection from '../../components/customer/ProductReviewSection';
import RelatedProducts from '../../components/customer/RelatedProducts';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [slug]);

    const {
  addRecentlyViewed
} = useRecentlyViewed();

  const {
    product,
    isLoading,
    activeImage,
    setActiveImage,
    availableColors,
    availableSizes,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    handleQuantityChange,
    displayPrice,
    displayOriginalPrice,
    isFlashSale,
    displayStock,
    activeVariant,
    handleAddToCart,
    relatedProducts,
    loadingRelated
  } = useProductDetail();

useEffect(() => {
  if (!product) {
    return;
  }

  addRecentlyViewed(product);
}, [product, addRecentlyViewed]);

  const handleBuyNow = () => {
    if (availableColors.length && !selectedColor) {
      alert('Vui lòng chọn màu sắc!');
      return;
    }

    if (availableSizes.length && !selectedSize) {
      alert('Vui lòng chọn kích cỡ!');
      return;
    }

    if (!activeVariant) {
      alert('Biến thể sản phẩm không khả dụng!');
      return;
    }

    if (activeVariant.stockQuantity < quantity) {
      alert(`Sản phẩm chỉ còn ${activeVariant.stockQuantity} trong kho!`);
      return;
    }

    const buyNowItem = {
      id: activeVariant.id,
      variantId: activeVariant.id,
      productName: product.name,
      color: activeVariant.color,
      size: activeVariant.size,
      quantity,
      price: activeVariant.flashSalePrice ?? activeVariant.price,
      originalPrice: activeVariant.price,
      isFlashSale: activeVariant.isFlashSale || false,
      thumbnailUrl:
        product.thumbnailUrl ||
        product.images?.[0]?.imageUrl ||
        product.images?.[0]?.url
    };

    navigate('/checkout', {
      state: {
        itemsToCheckout: [buyNowItem],
        isBuyNow: true
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Sản phẩm không tồn tại!
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-6">
      <div className="w-[95%] max-w-[1200px] mx-auto">

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-[#ee4d2d]">
            FashionHub
          </Link>

          <span>{'>'}</span>

          <Link
            to={`/products?category=${product.categoryId}`}
            className="hover:text-[#ee4d2d]"
          >
            {product.category?.name || 'Danh mục'}
          </Link>

          <span>{'>'}</span>

          <span className="truncate max-w-[220px] text-gray-800">
            {product.name}
          </span>
        </div>

        <div className="bg-white rounded-sm shadow-sm flex flex-col md:flex-row gap-8 p-4 md:p-6">
          <ProductGallery
            product={product}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />

          <ProductInfo
            product={product}
            displayPrice={displayPrice}
            displayOriginalPrice={displayOriginalPrice}
            isFlashSale={isFlashSale}
            displayStock={displayStock}
            quantity={quantity}
            availableColors={availableColors}
            availableSizes={availableSizes}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            handleQuantityChange={handleQuantityChange}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
          />
        </div>

        <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
          <div className="bg-gray-50 px-4 py-3 text-lg font-medium uppercase mb-4">
            Mô tả sản phẩm
          </div>

          <div className="text-sm text-gray-700 leading-7 whitespace-pre-wrap px-4">
            {product.description || 'Đang cập nhật mô tả...'}
          </div>
        </div>

        <ProductReviewSection
          productId={product.id}
          averageRating={product.rating}
          totalReviews={product.reviewCount}
        />

        <RelatedProducts
          products={relatedProducts}
          loading={loadingRelated}
          parentCategoryId={
            product.category?.parentId || product.categoryId
          }
        />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .clip-triangle{
              clip-path:polygon(100% 0,0 100%,100% 100%);
            }
          `
        }}
      />
    </div>
  );
};

export default ProductDetail;