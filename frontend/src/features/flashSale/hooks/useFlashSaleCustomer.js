import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { flashSaleApi } from '../api/flashSaleApi';

const DEFAULT_LIMIT = 20;

const useFlashSaleCustomer = () => {
  const [loading, setLoading] = useState(false);

  const [flashSale, setFlashSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: DEFAULT_LIMIT
  });

  const loadFlashSale = useCallback(
    async ({
      page = 1,
      sortBy = 'latest'
    } = {}) => {
      try {
        setLoading(true);

        const response =
          await flashSaleApi.getCustomerFlashSale({
            page,
            limit: DEFAULT_LIMIT,
            sortBy
          });

        const data = response.data || {};

        setFlashSale(data.flashSale || null);
        setProducts(data.products || []);

        setPagination(
          data.pagination || {
            currentPage: page,
            totalPages: 1,
            totalItems: 0,
            limit: DEFAULT_LIMIT
          }
        );
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            'Không thể tải Flash Sale.'
        );

        setFlashSale(null);
        setProducts([]);

        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: DEFAULT_LIMIT
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadFlashSale();
  }, [loadFlashSale]);
  
  const handleSort = (value) => {
    setSortBy(value);

    loadFlashSale({
      page: 1,
      sortBy: value
    });
  };

  const handlePageChange = (page) => {
    if (
      page === pagination.currentPage ||
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    loadFlashSale({
      page,
      sortBy
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const reload = () => {
    loadFlashSale({
      page: pagination.currentPage,
      sortBy
    });
  };

  return {
    loading,

    flashSale,
    products,
    sortBy,
    pagination,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    handleSort,
    handlePageChange,
    reload
  };
};

export default useFlashSaleCustomer;