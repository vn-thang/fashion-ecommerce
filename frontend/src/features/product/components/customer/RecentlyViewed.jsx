import React from 'react';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';
import ProductCard from './ProductCard';

const RecentlyViewed = () => {
  const {
    recentProducts,
    clearRecentlyViewed
  } = useRecentlyViewed();

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          👀 Sản phẩm vừa xem
        </h2>

        <button
          type="button"
          onClick={clearRecentlyViewed}
          className="text-sm text-gray-500 transition-colors hover:text-[#ee4d2d]"
        >
          Xóa lịch sử
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {recentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;