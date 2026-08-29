import { useState } from 'react';
import { authApi } from '../api/authApi';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async e => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Vui lòng nhập Email!');
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.forgotPassword(
        email.trim()
      );

      setMessage(
        data?.message ||
          'Link đặt lại mật khẩu đã được gửi vào Email của bạn!'
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Có lỗi xảy ra, vui lòng thử lại.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    message,
    error,
    loading,
    handleForgotPassword
  };
};