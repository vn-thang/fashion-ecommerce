import React from 'react';

import DashboardHeader from '../components/DashboardHeader';
import DashboardFilter from '../components/DashboardFilter';

import SummaryCards from '../components/SummaryCards';

import RevenueChart from '../components/RevenueChart';
import OrderStatusChart from '../components/OrderStatusChart';

import TopProducts from '../components/TopProducts';
import TopCustomers from '../components/TopCustomers';

import CategoryRevenueChart from '../components/CategoryRevenueChart';
import BrandRevenueChart from '../components/BrandRevenueChart';

import { useDashboard } from '../hooks/useDashboard';

const DashboardPage = () => {
  const {
    loading,

    filters,

    summary,

    revenueChart,
    orderStatusChart,

    topProducts,
    topCustomers,

    categoryRevenue,
    brandRevenue,

    handleFilterChange,
    handleApplyFilter
  } = useDashboard();

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">

      <DashboardHeader />

      <DashboardFilter
        filters={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilter}
      />

      <SummaryCards
        summary={summary}
        loading={loading}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">
          <RevenueChart
            data={revenueChart}
            loading={loading}
          />
        </div>

        <OrderStatusChart
          data={orderStatusChart}
          loading={loading}
        />

      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <TopProducts
          products={topProducts}
          loading={loading}
        />

        <TopCustomers
          customers={topCustomers}
          loading={loading}
        />

      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <CategoryRevenueChart
          data={categoryRevenue}
          loading={loading}
        />

        <BrandRevenueChart
          data={brandRevenue}
          loading={loading}
        />

      </div>

    </div>
  );
};

export default DashboardPage;