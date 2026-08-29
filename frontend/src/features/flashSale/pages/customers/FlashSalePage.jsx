import React from 'react';
import { Link } from 'react-router-dom';

import useFlashSaleCustomer from '../../hooks/useFlashSaleCustomer';

import FlashSaleBanner from '../../components/customers/FlashSaleBanner';
import FlashSaleToolbar from '../../components/customers/FlashSaleToolbar';
import FlashSaleGrid from '../../components/customers/FlashSaleGrid';
import FlashSaleSkeleton from '../../components/customers/FlashSaleSkeleton';
import FlashSaleEmpty from '../../components/customers/FlashSaleEmpty';
import FlashSalePagination from '../../components/customers/FlashSalePagination';

const FlashSalePage = () => {
  const {
    loading,
    flashSale,
    products,
    currentPage,
    totalPages,
    totalItems,
    sortBy,
    handleSort,
    handlePageChange
  } = useFlashSaleCustomer();

 return (
  <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <div className="mx-auto w-full max-w-[1600px]">
      <FlashSaleBanner flashSale={flashSale} />

      <FlashSaleToolbar
        totalProducts={totalItems}
        sortBy={sortBy}
        onSort={handleSort}
      />

      {loading ? (
        <FlashSaleSkeleton />
      ) : products.length === 0 ? (
        <FlashSaleEmpty />
      ) : (
        <FlashSaleGrid products={products} />
      )}

      <div className="mt-6 sm:mt-8 flex justify-center overflow-x-auto">
        <FlashSalePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  </div>
);
};

export default FlashSalePage;