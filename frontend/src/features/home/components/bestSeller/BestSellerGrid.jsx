import React from 'react';
import ProductCard from '../../../product/components/customer/ProductCard';

const BestSellerGrid = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default BestSellerGrid;