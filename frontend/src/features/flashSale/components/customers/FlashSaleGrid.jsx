import React from 'react';

import FlashSaleCard from './FlashSaleCard';

const FlashSaleGrid = ({
  products = []
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {products.map(product => (
        <FlashSaleCard
          key={product.productId}
          product={product}
        />
      ))}
    </div>
  );
};

export default FlashSaleGrid;