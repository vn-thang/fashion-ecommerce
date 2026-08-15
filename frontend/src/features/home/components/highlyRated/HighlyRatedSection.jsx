import React from 'react';

import HighlyRatedHeader from './HighlyRatedHeader';
import HighlyRatedCarousel from './HighlyRatedCarousel';

const HighlyRatedSection = ({ products = [] }) => {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <HighlyRatedHeader
        totalProducts={products.length}
      />

      <HighlyRatedCarousel
        products={products}
      />
    </section>
  );
};

export default HighlyRatedSection;