import React from 'react';

const StatCard = ({
  title,
  value,
  icon,
  color
}) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
    >
      {icon}
    </div>

    <div>
      <p className="text-sm font-medium text-gray-400">
        {title}
      </p>

      <h3 className="mt-1 text-2xl font-bold text-slate-800">
        {value}
      </h3>
    </div>
  </div>
);

const BrandStats = ({
  stats = {}
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

      <StatCard
        title="Tổng thương hiệu"
        value={stats.totalBrands ?? 0}
        color="bg-emerald-50 text-emerald-600"
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
            />
          </svg>
        }
      />

      <StatCard
        title="Đang được sử dụng"
        value={stats.activeBrands ?? 0}
        color="bg-indigo-50 text-indigo-600"
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        }
      />

      <StatCard
        title="Chưa có sản phẩm"
        value={stats.emptyBrands ?? 0}
        color="bg-amber-50 text-amber-600"
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 12H4"
            />
          </svg>
        }
      />

    </div>
  );
};

export default BrandStats;