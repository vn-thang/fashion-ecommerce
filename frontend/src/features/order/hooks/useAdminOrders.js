import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminOrderApi } from '../api/adminOrderApi';

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
    customerId: '',
    customerName: ''
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await adminOrderApi.getAll(filters);

      if (res.success) {
        setOrders(res.data.items || []);
        setMeta(
          res.data.meta || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
          }
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể lấy danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 400);
    return () => clearTimeout(timer);
  }, [
    filters.page,
    filters.limit,
    filters.status,
    filters.search,
    filters.customerId,
    filters.customerName
  ]);

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

  const setOrderFilters = values => {
    setFilters(prev => {
      const next = {
        ...prev,
        ...values,
        page: 1
      };

      if (JSON.stringify(prev) === JSON.stringify(next)) {
        return prev;
      }

      return next;
    });
  };

  const handleClearCustomerFilter = () => {
    setFilters(prev => ({
      ...prev,
      customerId: '',
      customerName: '',
      page: 1
    }));
  };

  const handleViewDetails = async id => {
    try {
      setIsModalOpen(true);
      setModalLoading(true);

      const res = await adminOrderApi.getById(id);

      if (res.success) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      toast.error('Không tìm thấy thông tin đơn hàng.');
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await adminOrderApi.updateStatus(id, newStatus);

      if (res.success) {
        toast.success('Cập nhật trạng thái thành công!');
        await fetchOrders();

        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => ({
            ...prev,
            status: newStatus
          }));
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Cập nhật trạng thái thất bại.'
      );
    }
  };

  const handleCancelOrder = async (
    reason = 'Quản trị viên hủy đơn'
  ) => {
    if (!selectedOrder) return;

    try {
      const res = await adminOrderApi.cancelOrder(
        selectedOrder.id,
        reason
      );

      if (res.success) {
        toast.success('Hủy đơn thành công!');
        await fetchOrders();

        setSelectedOrder(prev => ({
          ...prev,
          status: 'CANCELLED',
          cancelledBy: 'ADMIN',
          cancelReason: reason,
          payment: prev.payment
            ? {
                ...prev.payment,
                status:
                  prev.payment.status === 'SUCCESS'
                    ? 'REFUNDED'
                    : 'CANCELLED'
              }
            : prev.payment
        }));

        setIsCancelModalOpen(false);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Không thể hủy đơn.'
      );
    }
  };

  return {
    orders,
    meta,
    loading,
    filters,
    selectedOrder,
    isModalOpen,
    modalLoading,
    isCancelModalOpen,
    setIsModalOpen,
    setIsCancelModalOpen,
    setOrderFilters,
    handleClearCustomerFilter,
    fetchOrders,
    handlePageChange,
    handleFilterChange,
    handleViewDetails,
    handleUpdateStatus,
    handleCancelOrder
  };
};