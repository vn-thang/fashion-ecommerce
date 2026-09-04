import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { orderApi } from '../api/orderApi'; 
import { paymentApi } from '../../payment/api/paymentApi';

export const useMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    status: '' 
  });

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderApi.getMyOrders(filters); 
      
      if (res?.success) {
        setOrders(res.data.items || []);
        setMeta(res.data.meta || { currentPage: 1, totalPages: 1, totalItems: 0 });
      }
    } catch (err) {
      console.error('Lỗi tải đơn hàng của User:', err);
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [filters]);

const cancelOrder = async (orderId, reason = 'Khách hàng hủy đơn') => {
  const res = await orderApi.cancelOrder(orderId, reason);

  if (res.success) {
    toast.success(res.message || 'Hủy đơn thành công');
    await fetchMyOrders();
  }

  return res;
};

const retryPayment = async orderId => {
  try {
    const res = await paymentApi.createPaymentUrl({
      orderId
    });

    if (res?.success && res.data?.paymentUrl) {
      window.location.href = res.data.paymentUrl;
      return;
    }

    toast.error(
      res?.message || 'Không thể khởi tạo thanh toán'
    );
  } catch (err) {
    console.error('Lỗi thanh toán lại:', err);

    toast.error(
      err.response?.data?.message ||
      'Không thể khởi tạo thanh toán'
    );
  }
};

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const handleTabChange = (newStatus) => {
    setFilters({ page: 1, limit: 5, status: newStatus });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return {
    orders,
    meta,
    loading,
    filters,
    handleTabChange,
    handlePageChange,
    refreshOrders: fetchMyOrders,
    cancelOrder,
    retryPayment
  };
};