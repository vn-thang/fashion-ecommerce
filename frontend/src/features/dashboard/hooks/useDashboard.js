import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { dashboardApi } from '../api/dashboardApi';

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [orderStatusChart, setOrderStatusChart] = useState({});

  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [brandRevenue, setBrandRevenue] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);

  const [filters, setFilters] = useState({
    range: 'today',
    startDate: '',
    endDate: ''
  });

  const fetchDashboard = useCallback(async currentFilters => {
    try {
      setLoading(true);

      const res = await dashboardApi.getDashboard(currentFilters);

      if (res.success) {
        const data = res.data;

        setSummary(data.summary);
        setRevenueChart(data.revenueChart || []);
        setOrderStatusChart(data.orderStatusChart || {});

        setTopProducts(data.topProducts || []);
        setTopCustomers(data.topCustomers || []);
        setBrandRevenue(data.brandRevenue || []);
        setCategoryRevenue(data.categoryRevenue || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu Dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(filters);
  }, [fetchDashboard]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      switch (key) {
        case 'range':
          return {
            range: value,
            startDate: '',
            endDate: ''
          };

        case 'startDate':
          return {
            ...prev,
            range: '',
            startDate: value
          };

        case 'endDate':
          return {
            ...prev,
            range: '',
            endDate: value
          };

        default:
          return prev;
      }
    });
  };

  const handleApplyFilter = () => {
    fetchDashboard(filters);
  };

  return {
    loading,

    filters,

    summary,
    revenueChart,
    orderStatusChart,

    topProducts,
    topCustomers,
    brandRevenue,
    categoryRevenue,

    fetchDashboard,

    handleFilterChange,
    handleApplyFilter
  };
};