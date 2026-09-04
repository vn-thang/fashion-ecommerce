import React from 'react';
import { Link } from 'react-router-dom';

const NewestHeader = ({ totalProducts = 0 }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🆕</span>

          <h2 className="text-2xl font-bold text-gray-900">
            Sản phẩm mới
          </h2>
        </div>
      </div>

      <Link
        to="/products?sort=newest"
        className="flex items-center gap-1 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
      >
        Xem tất cả

        <svg
          className="w-4 h-4"
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

export default NewestHeader;