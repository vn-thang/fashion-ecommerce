import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { auditLogAdminApi } from '../api/auditLogAdminApi';

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 20
};

const DEFAULT_FILTERS = {
  page: 1,
  limit: 20,
  search: '',
  userId: '',
  action: '',
  entityName: '',
  entityId: '',
  fromDate: '',
  toDate: ''
};

export const useAuditLog = () => {
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');

  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const loadAuditLogs = useCallback(async () => {
    try {
      setLoading(true);

      const res = await auditLogAdminApi.getAll(filters);

      if (res.success) {
        setAuditLogs(res.data.auditLogs || []);
        setPagination(res.data.pagination || DEFAULT_PAGINATION);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        'Không tải được danh sách audit log.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      [name]: value
    }));
  };

  const handleReset = () => {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
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

const handleViewDetail = async id => {
  try {
    setDetailLoading(true);
    setDetail(null);

    const res = await auditLogAdminApi.getById(id);

    if (res.success) {
      setDetail(res.data);
      setOpenDetail(true);
    }
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message ||
      'Không tải được chi tiết audit log.'
    );
  } finally {
    setDetailLoading(false);
  }
};

  const closeDetail = () => {
    setOpenDetail(false);
    setDetail(null);
  };

  return {
    loading,
    auditLogs,
    pagination,
    filters,
    search,
    detail,
    detailLoading,
    openDetail,
    handleSearchInput,
    handleSearch,
    handleFilterChange,
    handleReset,
    handlePageChange,
    handleViewDetail,
    closeDetail,
    loadAuditLogs
  };
};