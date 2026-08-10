import React from 'react';

const BestSellerSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-200" />

          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded mb-2" />

            <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />

            <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />

            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BestSellerSkeleton;