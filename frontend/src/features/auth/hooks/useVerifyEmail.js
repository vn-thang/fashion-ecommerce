import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authApi } from '../api/authApi';

export const useVerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(
    location.search
  ).get('token');

  const [email, setEmail] = useState(
    location.state?.email || ''
  );
  const [loading, setLoading] = useState(!!token);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setWaiting(true);
      return;
    }

    const verify = async () => {
      setLoading(true);
      setWaiting(false);
      setError('');

      try {
        const response =
          await authApi.verifyEmail(token);

        setSuccess(true);

        toast.success(
          response?.data?.message ||
          'Xác thực email thành công!'
        );
      } catch (err) {
        setError(
          err.message ||
          'Xác thực email thất bại!'
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    const value = email.trim();

    if (!value) {
      setError('Không tìm thấy email cần xác thực!');
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setError('Email không hợp lệ!');
      return;
    }

    setError('');
    setResending(true);

    try {
      const response =
        await authApi.resendVerificationEmail(value);

      setWaiting(true);

      toast.success(
        response?.data?.message ||
        'Email xác thực mới đã được gửi!'
      );
    } catch (err) {
      setError(
        err.message ||
        'Không thể gửi lại email xác thực!'
      );
    } finally {
      setResending(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return {
    token,
    email,
    setEmail,
    loading,
    resending,
    success,
    waiting,
    error,
    handleResend,
    handleLogin
  };
};