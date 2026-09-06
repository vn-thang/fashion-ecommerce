import React from 'react';

const StatCard = ({
  title,
  value,
  icon,
  color
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div>
      <p className="text-xs font-bold tracking-wider text-slate-400">
        {title}
      </p>

      <h3
        className={`mt-2 text-xl font-extrabold ${color}`}
      >
        {value}
      </h3>
    </div>

    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${color.replace(
        'text',
        'bg'
      )}/10`}
    >
      {icon}
    </div>
  </div>
);

const CategoryStats = ({
  pagination = {}
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <StatCard
        title="Tổng danh mục"
        value={pagination.totalItems || 0}
        icon="📁"
        color="text-indigo-600"
      />

      <StatCard
        title="Trang hiện tại"
        value={pagination.currentPage || 1}
        icon="📄"
        color="text-emerald-600"
      />

      <StatCard
        title="Tổng số trang"
        value={pagination.totalPages || 1}
        icon="📚"
        color="text-amber-500"
      />
    </div>
  );
};

export default CategoryStats;