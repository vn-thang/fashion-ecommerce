import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authApi } from '../api/authApi';

export const useVerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(
    location.search
  ).get('token');
  const verificationAttempted = useRef(null);

  const [email, setEmail] = useState(
    location.state?.email || ''
  );

  const [loading, setLoading] = useState(!!token);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(!token);

  useEffect(() => {
    if (!token || verificationAttempted.current === token) {
      return;
    }

    verificationAttempted.current = token;

    const verify = async () => {
      setLoading(true);
      setWaiting(false);
      setError('');

      try {
        const response =
          await authApi.verifyEmail(token);

        setSuccess(true);
        setError('');

        toast.success(
          response?.message ||
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
    setSuccess(false);

    toast.success(
      response?.message ||
      'Nếu tài khoản cần xác thực, email hướng dẫn sẽ được gửi đến hộp thư.'
    );
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Không thể gửi email xác thực!';

    setError(message);
    toast.error(message);
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