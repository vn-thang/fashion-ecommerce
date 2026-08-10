import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">
        Dashboard
      </h1>

      <p className="text-sm text-gray-500">
        Theo dõi doanh thu, đơn hàng, khách hàng và tình hình kinh doanh theo thời gian.
      </p>
    </div>
  );
};

export default DashboardHeader;