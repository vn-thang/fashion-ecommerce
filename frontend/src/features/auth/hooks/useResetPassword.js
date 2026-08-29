import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { authApi } from '../api/authApi';

export const useResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async e => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!token) {
      setError(
        'Link đặt lại mật khẩu không hợp lệ!'
      );
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError(
        'Mật khẩu mới phải có ít nhất 8 ký tự!'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        'Mật khẩu xác nhận không khớp!'
      );
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.resetPassword(
        token,
        newPassword
      );

      setMessage(
        data?.message ||
          'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Đặt lại mật khẩu thất bại!'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    loading,
    handleResetPassword
  };
};

