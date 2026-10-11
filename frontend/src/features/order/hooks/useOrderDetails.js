import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../../payment/api/paymentApi';

export const useOrderDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ['orderDetails', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await orderApi.getOrderDetails(id);

      if (!res?.success || !res.data) {
        throw new Error(
          res?.message || 'Không thể tải chi tiết đơn hàng'
        );
      }

      return res.data;
    },
    refetchInterval: query => {
      const activeStatuses = [
        'PENDING',
        'PROCESSING',
        'SHIPPING'
      ];

      return activeStatuses.includes(query.state.data?.status)
        ? 15000
        : false;
    }
  });

  useEffect(() => {
    if (orderQuery.error) {
      console.error(
        'Lỗi tải chi tiết đơn hàng:',
        orderQuery.error
      );
      toast.error(
        orderQuery.error.response?.data?.message ||
          orderQuery.error.message ||
          'Không thể tải chi tiết đơn hàng'
      );
    }
  }, [orderQuery.error]);

  const cancelMutation = useMutation({
    mutationFn: async reason => {
      const res = await orderApi.cancelOrder(id, reason);

      if (!res?.success) {
        throw new Error(res?.message || 'Không thể hủy đơn');
      }

      return res;
    },
    onSuccess: async res => {
      toast.success(res.message || 'Hủy đơn thành công');
      await queryClient.invalidateQueries({
        queryKey: ['orderDetails', id]
      });
    },
    onError: error => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Không thể hủy đơn'
      );
    }
  });

  const refreshOrder = () => orderQuery.refetch();

  const cancelOrder = async (reason = 'Khách hàng hủy đơn') => {
    try {
      await cancelMutation.mutateAsync(reason);
    } catch {
      // The mutation reports the error to the customer.
    }
  };

const retryPayment = async () => {
  const order = orderQuery.data;

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

  return { 
    order: orderQuery.data || null,
    loading: orderQuery.isLoading,
    cancelling: cancelMutation.isPending,
    refreshOrder,
    cancelOrder,
    retryPayment
  };
};