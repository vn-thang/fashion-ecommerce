import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth/store/authContext';

const MAX_ITEMS = 10;
const GUEST_KEY = 'fashionhub_recently_viewed_guest';

const useRecentlyViewed = () => {
  const { user } = useAuth();

  const [recentProducts, setRecentProducts] = useState([]);

  const userId = user?.id;

  const getStorageKey = useCallback(() => {
    return userId
      ? `fashionhub_recently_viewed_${userId}`
      : GUEST_KEY;
  }, [userId]);
  const normalizeProduct = useCallback((product) => {
    if (!product?.id) {
      return null;
    }

    const variantPrices =
      product.variants
        ?.map((variant) => Number(variant.price))
        .filter((price) => Number.isFinite(price)) || [];

    const minPrice =
      variantPrices.length > 0
        ? Math.min(...variantPrices)
        : 0;

    const thumbnailUrl =
      product.thumbnailUrl ||
      product.images?.[0]?.imageUrl ||
      product.images?.[0]?.url ||
      null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      thumbnailUrl,

      minPrice,

      rating: Number(product.rating) || 0,
      reviewCount: Number(product.reviewCount) || 0,
      soldCount: Number(product.soldCount) || 0,

      isFlashSale: Boolean(product.isFlashSale),
      flashSale: product.flashSale || null
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey());

      if (!stored) {
        setRecentProducts([]);
        return;
      }

      const parsed = JSON.parse(stored);

      setRecentProducts(
        Array.isArray(parsed) ? parsed : []
      );
    } catch (error) {
      console.error(
        'Lỗi khi đọc recently viewed:',
        error
      );

      localStorage.removeItem(getStorageKey());
      setRecentProducts([]);
    }
  }, [getStorageKey]);

  const addRecentlyViewed = useCallback(
    (product) => {
      const viewedProduct =
        normalizeProduct(product);

      if (!viewedProduct) {
        return;
      }

      setRecentProducts((currentProducts) => {
        const filteredProducts =
          currentProducts.filter(
            (item) =>
              item.id !== viewedProduct.id
          );
        const updatedProducts = [
          viewedProduct,
          ...filteredProducts
        ].slice(0, MAX_ITEMS);

        localStorage.setItem(
          getStorageKey(),
          JSON.stringify(updatedProducts)
        );

        return updatedProducts;
      });
    },
    [normalizeProduct, getStorageKey]
  );

  const removeRecentlyViewed = useCallback(
    (productId) => {
      setRecentProducts((currentProducts) => {
        const updatedProducts =
          currentProducts.filter(
            (item) =>
              item.id !== productId
          );

        localStorage.setItem(
          getStorageKey(),
          JSON.stringify(updatedProducts)
        );

        return updatedProducts;
      });
    },
    [getStorageKey]
  );

  const clearRecentlyViewed = useCallback(() => {
    localStorage.removeItem(getStorageKey());
    setRecentProducts([]);
  }, [getStorageKey]);

  return {
    recentProducts,
    addRecentlyViewed,
    removeRecentlyViewed,
    clearRecentlyViewed
  };
};

export default useRecentlyViewed;