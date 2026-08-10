import { useCallback, useState } from 'react';
import { paymentApi } from '../../api/paymentApi';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState('');

  const createPayment = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError('');

      const res = await paymentApi.createPaymentUrl(orderId);

      if (res.success && res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
        return;
      }

      throw new Error('Không tạo được liên kết thanh toán.');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Không thể tạo thanh toán VNPAY.';

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

const verifyPayment = useCallback(async (search) => {
  try {
    setLoading(true);
    setError('');

    const params = Object.fromEntries(
      new URLSearchParams(search)
    );

    const res = await paymentApi.verifyPayment(params);
    if (res.data) {
      setPaymentResult(res.data);
      return res.data;
    }

    throw new Error(
      res.message || 'Không xác minh được giao dịch.'
    );

  } catch (err) {

    const message =
      err.response?.data?.message ||
      err.message ||
      'Không xác minh được giao dịch.';

    setError(message);

    throw err;

  } finally {
    setLoading(false);
  }
}, []);

  return {
    loading,
    error,
    paymentResult,
    createPayment,
    verifyPayment
  };
};