import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../../payment/api/paymentApi';

export const useOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderApi.getOrderDetails(id);
      
      if (res?.success) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Lỗi tải chi tiết đơn hàng:', err);
      toast.error(err.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const cancelOrder = async (reason = 'Khách hàng hủy đơn') => {
  try {
    const res = await orderApi.cancelOrder(id, reason);

    if (res.success) {
      toast.success(res.message || 'Hủy đơn thành công');
      fetchOrderDetails();
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message || 'Không thể hủy đơn'
    );
  }
};

const retryPayment = async () => {
  if (!order?.id) return;

  try {
    const res = await paymentApi.createPaymentUrl({
      orderId: order.id
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
    if (id) {
      fetchOrderDetails();
    }
  }, [id, fetchOrderDetails]);

  return { 
    order, 
    loading, 
    refreshOrder: fetchOrderDetails,
    cancelOrder,
    retryPayment
  };
};