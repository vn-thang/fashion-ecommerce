import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { useCart } from '../../cart/hooks/CartContext';

export const useProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);

      try {
        const res = await productApi.getBySlug(slug);
        const data = res?.data?.data || res?.data || null;

        setProduct(data);

       if (data?.thumbnailUrl) {
        setActiveImage(data.thumbnailUrl);
      } else if (data?.images?.length > 0) {
        setActiveImage(
          data.images[0].imageUrl || data.images[0].url
        );
      } else {
        setActiveImage('');
      }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (!product?.id) return;

    const fetchRelatedProducts = async () => {
      setLoadingRelated(true);

      try {
        const res = await productApi.getRelatedProducts(product.id);

        const products =
          res?.data?.data?.products ||
          res?.data?.products ||
          [];

        setRelatedProducts(products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const availableColors = useMemo(() => {
    if (!product?.variants) return [];

    return [
      ...new Set(
        product.variants
          .map(v => v.color)
          .filter(Boolean)
      )
    ];
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product?.variants) return [];

    return [
      ...new Set(
        product.variants
          .map(v => v.size)
          .filter(Boolean)
      )
    ];
  }, [product]);

const activeVariant = useMemo(() => {
  if (!product?.variants) return null;
  if ( availableColors.length > 0 && !selectedColor) {
    return null;
  }

  if (
    availableSizes.length > 0 &&
    !selectedSize
  ) {
    return null;
  }

  return product.variants.find(
    v =>
      (!selectedColor || v.color === selectedColor) &&
      (!selectedSize || v.size === selectedSize)
  );
}, [
  product,
  selectedColor,
  selectedSize,
  availableColors,
  availableSizes
]);

  const isFlashSale = activeVariant
    ? activeVariant.isFlashSale
    : product?.variants?.some(v => v.isFlashSale) || false;

  const displayPrice = useMemo(() => {
    if (!product) return 0;

    if (activeVariant && selectedColor && selectedSize) {
      return Number(
        activeVariant.flashSalePrice ??
        activeVariant.price
      );
    }

    const prices = product.variants.map(v =>
      Number(v.flashSalePrice ?? v.price)
    );

    if (!prices.length) return 0;

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max
      ? min
      : `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')}`;
  }, [product, activeVariant, selectedColor, selectedSize]);

  const displayOriginalPrice = useMemo(() => {
    if (!product) return null;

    if (activeVariant && selectedColor && selectedSize) {
      return activeVariant.isFlashSale
        ? Number(activeVariant.originalPrice)
        : null;
    }

    const originals = product.variants
      .filter(v => v.isFlashSale)
      .map(v => Number(v.originalPrice));

    if (!originals.length) return null;

    const min = Math.min(...originals);
    const max = Math.max(...originals);

    return min === max
      ? min
      : `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')}`;
  }, [product, activeVariant, selectedColor, selectedSize]);

  const displayStock = activeVariant
    ? activeVariant.stockQuantity
    : product?.variants?.reduce(
        (sum, v) => sum + v.stockQuantity,
        0
      ) || 0;

  const handleQuantityChange = type => {
    if (type === 'minus' && quantity > 1) {
      setQuantity(q => q - 1);
    }

    if (type === 'plus' && quantity < displayStock) {
      setQuantity(q => q + 1);
    }
  };

  const handleAddToCart = async () => {
    if (availableColors.length && !selectedColor) {
      return alert('Vui lòng chọn màu sắc!');
    }

    if (availableSizes.length && !selectedSize) {
      return alert('Vui lòng chọn kích cỡ!');
    }

    if (quantity > displayStock) {
      return alert('Số lượng vượt quá tồn kho!');
    }

    if (!activeVariant) {
      return alert('Không tìm thấy biến thể sản phẩm!');
    }

    const result = await addToCart(
      activeVariant.id,
      quantity
    );

    if (result.success) {
      alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
      setQuantity(1);
    } else {
      alert(result.message || 'Lỗi khi thêm vào giỏ hàng!');
    }
  };

  return {
    product,
    isLoading,
    relatedProducts,
    loadingRelated,

    activeImage,
    setActiveImage,

    availableColors,
    availableSizes,

    selectedColor,
    setSelectedColor,

    selectedSize,
    setSelectedSize,

    quantity,
    setQuantity,
    handleQuantityChange,

    activeVariant,

    displayPrice,
    displayOriginalPrice,
    displayStock,
    isFlashSale,

    handleAddToCart
  };
};