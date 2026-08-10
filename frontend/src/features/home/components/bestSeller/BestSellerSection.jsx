import React from 'react';

import BestSellerHeader from './BestSellerHeader';
import BestSellerGrid from './BestSellerGrid';
import BestSellerSkeleton from './BestSellerSkeleton';

const BestSellerSection = ({
  loading,
  products = []
}) => {
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6">
      <BestSellerHeader
        totalProducts={products.length}
      />

      {loading ? (
        <BestSellerSkeleton />
      ) : (
        <BestSellerGrid
          products={products}
        />
      )}
    </section>
  );
};

export default BestSellerSection;