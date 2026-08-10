import React from 'react';
import FlashSaleHeader from './FlashSaleHeader';

const FlashSaleSection = ({
  flashSale,
  loading,
  children
}) => {
  if (loading) {
    return (
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 w-72 bg-gray-200 rounded mb-6"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-72 rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (!flashSale) {
    return null;
  }

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <FlashSaleHeader flashSale={flashSale} />
      <div className="p-6">
        {children}
      </div>

    </section>
  );
};

export default FlashSaleSection;