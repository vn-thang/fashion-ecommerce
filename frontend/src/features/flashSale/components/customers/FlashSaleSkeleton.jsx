import React from 'react';

const FlashSaleSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden border border-gray-100 bg-white"
        >
          <div className="aspect-square bg-gray-200 animate-pulse" />

          <div className="p-3 space-y-3">
            <div className="h-4 rounded bg-gray-200 animate-pulse" />

            <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />

            <div className="h-8 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashSaleSkeleton;