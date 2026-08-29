import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authApi } from '../api/authApi';
import { useAuth } from '../store/authContext';

export const useLogin = () => {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();

    setError('');
    setVerificationRequired(false);

    if (!username.trim()) {
      setError('Vui lòng nhập Email hoặc Số điện thoại!');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu!');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.login(
        username.trim(),
        password
      );

      const loginData = result.data;

      loginSuccess(
        loginData.user,
        loginData.accessToken
      );

      toast.success('Đăng nhập thành công!');

      const userRole =
        loginData.user?.role?.toLowerCase();

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message =
        err.message ||
        'Đăng nhập thất bại!';

      setError(message);

      if (
        message ===
        'Vui lòng xác thực email trước khi đăng nhập!'
      ) {
        setVerificationRequired(true);
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    const email = username.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(
        'Vui lòng nhập Email để xác thực tài khoản.'
      );
      return;
    }

    setError('');
    setResending(true);

    try {
      const response =
        await authApi.resendVerificationEmail(email);

      toast.success(
        response?.data?.message ||
        'Email xác thực đã được gửi!'
      );

      navigate('/verify-email', {
        state: {
          email
        }
      });
    } catch (err) {
      const message =
        err.message ||
        'Không thể gửi email xác thực!';

      setError(message);
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    loading,
    verificationRequired,
    resending,
    handleVerifyEmail,
    handleLogin
  };
};