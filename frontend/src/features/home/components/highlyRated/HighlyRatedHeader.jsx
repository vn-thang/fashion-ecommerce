import React from 'react';
import { Link } from 'react-router-dom';

const HighlyRatedHeader = ({ totalProducts = 0 }) => {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>

          <h2 className="text-2xl font-bold text-gray-900">
            Đánh giá cao
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {totalProducts} sản phẩm được khách hàng đánh giá cao
        </p>
      </div>

      <Link
        to="/products?sort=highestRated"
        className="flex items-center gap-1 text-sm font-medium text-rose-500 transition-colors hover:text-rose-600"
      >
        Xem tất cả

        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
};

export default HighlyRatedHeader;