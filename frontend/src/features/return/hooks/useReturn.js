import {
  useCallback,
  useEffect,
  useState
} from 'react';
import toast from 'react-hot-toast';

import { returnApi } from '../api/returnApi';

const DEFAULT_LIMIT = 10;

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: DEFAULT_LIMIT
};

export const useReturn = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [returns, setReturns] = useState([]);
  const [pagination, setPagination] = useState(
    DEFAULT_PAGINATION
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: DEFAULT_LIMIT
  });

  const [selectedReturn, setSelectedReturn] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const loadReturns = useCallback(async () => {
    try {
      setLoading(true);

      const res = await returnApi.getAll(filters);
      console.log('GET /returns response:', res);
    console.log('GET /returns data:', res.data);
    console.log('GET /returns returns:', res.data?.returns);

      if (res.success) {
        setReturns(res.data?.returns || []);
        setPagination(
          res.data?.pagination || DEFAULT_PAGINATION
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          'Không tải được danh sách yêu cầu trả hàng.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const getReturnById = async id => {
    if (!id) return null;

    try {
      setDetailLoading(true);

      const res = await returnApi.getById(id);

       console.log('GET /returns/:id response:', res);
    console.log('GET /returns/:id data:', res.data);
    console.log(
      'refundAmount:',
      res.data?.refundAmount
    );

      if (res.success) {
        setSelectedReturn(res.data);
        return res.data;
      }

      return null;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          'Không tải được chi tiết yêu cầu trả hàng.'
      );

      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  const getReturnsByOrderId = async orderId => {
    if (!orderId) return [];

    try {
      const res = await returnApi.getByOrderId(orderId);

      if (res.success) {
        return res.data || [];
      }

      return [];
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          'Không tải được lịch sử trả hàng.'
      );

      return [];
    }
  };

  const createReturn = async data => {
    try {
      setSubmitting(true);

      const res = await returnApi.create(data);

      if (res.success) {
        toast.success(
          'Gửi yêu cầu trả hàng thành công.'
        );

        await loadReturns();

        return res.data;
      }

      return null;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          'Gửi yêu cầu trả hàng thất bại.'
      );

      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const markShipping = async id => {
    if (!id) return null;

    try {
      setSubmitting(true);

      const res =
        await returnApi.markShipping(id);

      if (res.success) {
        toast.success(
          'Cập nhật trạng thái gửi hàng thành công.'
        );

        setSelectedReturn(res.data || null);
        await loadReturns();

        return res.data;
      }

      return null;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          'Cập nhật trạng thái gửi hàng thất bại.'
      );

      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const cancelReturn = async id => {
  if (!id) return null;

  try {
    setSubmitting(true);

    const res = await returnApi.cancel(id);

    if (res.success) {
      toast.success('Hủy yêu cầu trả hàng thành công.');
      setSelectedReturn(res.data || null);
      await loadReturns();
      return res.data;
    }

    return null;
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
        'Hủy yêu cầu trả hàng thất bại.'
    );

    return null;
  } finally {
    setSubmitting(false);
  }
};

  const handlePageChange = page => {
    if (
      page === filters.page ||
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const openDetail = async id => {
    return await getReturnById(id);
  };

  const closeDetail = () => {
    setSelectedReturn(null);
  };

  return {
    loading,
    submitting,
    detailLoading,
    returns,
    pagination,
    filters,
    selectedReturn,

    loadReturns,
    getReturnById,
    getReturnsByOrderId,
    createReturn,
    markShipping,
    cancelReturn,

    handlePageChange,
    openDetail,
    closeDetail
  };
};