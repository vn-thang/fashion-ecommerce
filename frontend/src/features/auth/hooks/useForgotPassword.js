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

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError('Email không hợp lệ!');
      return;
    }

    setLoading(true);

    try {
      const response =
        await authApi.forgotPassword(
          email.trim()
        );

      setMessage(
        response?.message ||
        'Nếu email này thuộc một tài khoản hợp lệ, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư.'
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

  const handleUseAnotherEmail = () => {
    setEmail('');
    setMessage('');
    setError('');
  };

  return {
    email,
    setEmail,
    message,
    error,
    loading,
    handleForgotPassword,
    handleUseAnotherEmail
  };
};