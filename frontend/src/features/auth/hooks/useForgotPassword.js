import { useState } from 'react';

import { authApi } from '../api/authApi';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async e => {
    e.preventDefault();

    setError('');
    setMessage('');
    setResetLink('');

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

      const newResetLink =
        response?.data?.resetLink;

      if (!newResetLink) {
        throw new Error(
          'Không tìm thấy link đặt lại mật khẩu.'
        );
      }

      setResetLink(newResetLink);

      setMessage(
        response?.data?.message ||
        'Link đặt lại mật khẩu đã được gửi vào email của bạn!'
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

  const handleResetPassword = () => {
    if (!resetLink) {
      setError(
        'Không tìm thấy link đặt lại mật khẩu.'
      );
      return;
    }

    window.location.href = resetLink;
  };

  const handleUseAnotherEmail = () => {
    setEmail('');
    setMessage('');
    setResetLink('');
    setError('');
  };

  return {
    email,
    setEmail,
    message,
    resetLink,
    error,
    loading,
    handleForgotPassword,
    handleResetPassword,
    handleUseAnotherEmail
  };
};