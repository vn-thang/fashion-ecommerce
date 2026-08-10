import React from 'react';

const NewestSkeleton = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-7 w-52 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>

        <div className="h-5 w-24 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="border rounded bg-white overflow-hidden"
          >
            <div className="aspect-square bg-gray-200" />

            <div className="p-3">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-4/5 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewestSkeleton;