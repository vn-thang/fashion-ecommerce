import React from 'react';

import ProductCard from '../../../product/components/customer/ProductCard';

const HighlyRatedCarousel = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-gray-50 py-10 text-center">
        <p className="text-sm text-gray-500">
          Chưa có sản phẩm đánh giá cao.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default HighlyRatedCarousel;