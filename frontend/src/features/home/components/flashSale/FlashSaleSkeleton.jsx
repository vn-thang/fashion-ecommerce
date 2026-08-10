import React from 'react';

const FlashSaleSkeleton = () => {
  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 animate-pulse">

        <div className="flex items-center justify-between">

          <div className="space-y-3">
            <div className="h-7 w-48 rounded bg-gray-200" />
            <div className="h-4 w-64 rounded bg-gray-100" />
          </div>

          <div className="flex gap-2">
            <div className="w-10 h-8 rounded bg-gray-200" />
            <div className="w-10 h-8 rounded bg-gray-200" />
            <div className="w-10 h-8 rounded bg-gray-200" />
          </div>

        </div>

      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 animate-pulse" />

              <div className="p-3 space-y-3">

                <div className="h-4 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />

                <div className="h-5 w-1/2 rounded bg-gray-200 animate-pulse" />

                <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse" />

                <div className="h-5 rounded-full bg-gray-200 animate-pulse" />

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default FlashSaleSkeleton;