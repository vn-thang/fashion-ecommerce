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

  const [verificationLink, setVerificationLink] =
    useState(
      location.state?.verificationLink || ''
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

  const handleVerifyDemo = () => {
    if (!verificationLink) {
      setError(
        'Không tìm thấy link xác thực. Vui lòng đăng ký lại.'
      );

      return;
    }

    window.location.href = verificationLink;
  };

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

    console.log(
      'RESEND VERIFICATION RESPONSE:',
      response
    );

    const newVerificationLink =
      response?.data?.verificationLink;

    if (!newVerificationLink) {
      throw new Error(
        'Không tìm thấy link xác thực mới.'
      );
    }

    setVerificationLink(newVerificationLink);
    setWaiting(true);
    setSuccess(false);

    toast.success(
      response?.data?.message ||
      'Đã tạo link xác thực mới!'
    );
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Không thể tạo link xác thực mới!';

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
    verificationLink,
    loading,
    resending,
    success,
    waiting,
    error,
    handleVerifyDemo,
    handleResend,
    handleLogin
  };
};