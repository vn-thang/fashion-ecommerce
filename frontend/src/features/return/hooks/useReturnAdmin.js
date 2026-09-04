import {
  useCallback,
  useEffect,
  useState
} from 'react';
import toast from 'react-hot-toast';

import { returnAdminApi } from '../api/returnAdminApi';

const DEFAULT_LIMIT = 10;

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: DEFAULT_LIMIT
};

export const useReturnAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [returns, setReturns] = useState([]);

  const [pagination, setPagination] =
    useState(DEFAULT_PAGINATION);

  const [filters, setFilters] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    search: '',
    status: ''
  });

  const [search, setSearch] = useState('');

  const [selectedReturn, setSelectedReturn] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [detailOpen, setDetailOpen] =
    useState(false);

  const loadReturns = useCallback(async () => {
    try {
      setLoading(true);

      const res =
        await returnAdminApi.getAll(filters);

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

      const res =
        await returnAdminApi.getById(id);

      if (res.success) {
        setSelectedReturn(res.data);
        setDetailOpen(true);

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

  const openDetail = async id => {
    return await getReturnById(id);
  };

  const closeDetail = () => {
    setSelectedReturn(null);
    setDetailOpen(false);
  };

  const handleSearchInput = value => {
    setSearch(value);
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: search.trim()
    }));
  };

  const handleStatusChange = status => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      status
    }));
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

  const approveReturn = async id => {
    if (!id) return null;

    try {
      setActionLoading(true);

      const res =
        await returnAdminApi.approve(id);

      if (res.success) {
        toast.success(
          'Duyệt yêu cầu trả hàng thành công.'
        );

        setSelectedReturn(
          res.data || selectedReturn
        );

        await loadReturns();

        if (selectedReturn?.id) {
          await getReturnById(selectedReturn.id);
        }

        return res.data;
      }

      return null;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Duyệt yêu cầu trả hàng thất bại.'
      );

      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const rejectReturn = async (
    id,
    rejectReason
  ) => {
    if (!id) return null;

    try {
      setActionLoading(true);

      const res =
        await returnAdminApi.reject(id, {
          rejectReason: rejectReason?.trim()
        });

      if (res.success) {
        toast.success(
          'Từ chối yêu cầu trả hàng thành công.'
        );

        setSelectedReturn(
          res.data || selectedReturn
        );

        await loadReturns();

        if (selectedReturn?.id) {
          await getReturnById(selectedReturn.id);
        }

        return res.data;
      }

      return null;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Từ chối yêu cầu trả hàng thất bại.'
      );

      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const markReceived = async id => {
    if (!id) return null;

    try {
      setActionLoading(true);

      const res =
        await returnAdminApi.received(id);

      if (res.success) {
        toast.success(
          'Xác nhận đã nhận hàng thành công.'
        );

        setSelectedReturn(
          res.data || selectedReturn
        );

        await loadReturns();

        if (selectedReturn?.id) {
          await getReturnById(selectedReturn.id);
        }

        return res.data;
      }

      return null;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Xác nhận đã nhận hàng thất bại.'
      );

      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const completeReturn = async id => {
    if (!id) return null;

    try {
      setActionLoading(true);

      const res =
        await returnAdminApi.complete(id);

      if (res.success) {
        toast.success(
          'Hoàn tất trả hàng và hoàn tiền thành công.'
        );

        setSelectedReturn(
          res.data || selectedReturn
        );

        await loadReturns();

        if (selectedReturn?.id) {
          await getReturnById(selectedReturn.id);
        }

        return res.data;
      }

      return null;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Hoàn tất trả hàng thất bại.'
      );

      return null;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    loading,
    actionLoading,
    detailLoading,

    returns,
    pagination,
    filters,
    search,

    selectedReturn,
    detailOpen,

    loadReturns,
    getReturnById,

    openDetail,
    closeDetail,

    handleSearchInput,
    handleSearch,
    handleStatusChange,
    handlePageChange,

    approveReturn,
    rejectReturn,
    markReceived,
    completeReturn
  };
};