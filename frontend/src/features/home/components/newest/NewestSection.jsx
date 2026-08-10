import React from 'react';
import NewestHeader from './NewestHeader';
import NewestCarousel from './NewestCarousel';

const NewestSection = ({ products = [] }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <NewestHeader
        totalProducts={products.length}
      />

      <NewestCarousel
        products={products}
      />
    </section>
  );
};

export default NewestSection;