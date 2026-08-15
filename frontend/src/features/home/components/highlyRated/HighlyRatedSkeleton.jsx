import React from 'react';

const HighlyRatedSkeleton = () => {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-gray-200" />

            <div className="h-7 w-36 rounded bg-gray-200" />
          </div>

          <div className="h-4 w-64 rounded bg-gray-200" />
        </div>

        <div className="h-5 w-20 rounded bg-gray-200" />
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded border border-gray-100 bg-white"
          >
            <div className="aspect-square bg-gray-200" />

            <div className="p-3">
              <div className="mb-2 h-4 rounded bg-gray-200" />

              <div className="mb-3 h-4 w-4/5 rounded bg-gray-200" />

              <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />

              <div className="h-6 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlyRatedSkeleton;