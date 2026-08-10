import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminPaymentApi } from '../../api/adminPaymentApi';

export const useAdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    keyword: '',
    paymentMethod: '',
    status: '',
    orderStatus: '',
    fromDate: '',
    toDate: ''
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const res = await adminPaymentApi.getAll(filters);

      if (res?.success && res?.data) {
        setPayments(res.data.items || []);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách thanh toán:', err);
      toast.error('Không thể tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchPayments]);

  const handlePageChange = page => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleViewDetails = async id => {
    try {
      setIsModalOpen(true);
      setModalLoading(true);

      const res = await adminPaymentApi.getById(id);

      if (res?.success && res?.data) {
        setSelectedPayment(res.data);
      }
    } catch (err) {
      toast.error('Không tìm thấy thông tin thanh toán');
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  return {
    payments,
    meta,
    loading,
    filters,
    selectedPayment,
    isModalOpen,
    modalLoading,
    setIsModalOpen,
    fetchPayments,
    handlePageChange,
    handleFilterChange,
    handleViewDetails
  };
};