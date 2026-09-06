import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';

export const useRegister = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleRegister = async e => {
  //   e.preventDefault();
  //   setError('');

  //   if (!fullName.trim()) {
  //     setError('Vui lòng nhập họ tên!');
  //     return;
  //   }

  //   if (!email.trim()) {
  //     setError('Vui lòng nhập Email!');
  //     return;
  //   }

  //   if (!password) {
  //     setError('Vui lòng nhập mật khẩu!');
  //     return;
  //   }

  //   if (password.length < 8) {
  //     setError('Mật khẩu phải có ít nhất 8 ký tự!');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await authApi.register({
  //       fullName: fullName.trim(),
  //       email: email.trim(),
  //       password
  //     });

  //     toast.success('Đăng ký thành công! Email xác thực đã được gửi.');

  //     navigate('/verify-email', {
  //       state: {
  //         email: email.trim()
  //       }
  //     });
  //   } catch (err) {
  //     const message =
  //       err.message || 'Đăng ký thất bại, vui lòng thử lại.';

  //     setError(message);
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRegister = async e => {
  e.preventDefault();
  setError('');

  if (!fullName.trim()) {
    setError('Vui lòng nhập họ tên!');
    return;
  }

  if (!email.trim()) {
    setError('Vui lòng nhập Email!');
    return;
  }

  if (!password) {
    setError('Vui lòng nhập mật khẩu!');
    return;
  }

  if (password.length < 8) {
    setError('Mật khẩu phải có ít nhất 8 ký tự!');
    return;
  }

  setLoading(true);

  try {
    const response = await authApi.register({
      fullName: fullName.trim(),
      email: email.trim(),
      password
    });

    const verificationLink =
      response?.data?.verificationLink;

    toast.success(
      response?.data?.message ||
      'Đăng ký thành công! Vui lòng xác thực tài khoản.'
    );

    navigate('/verify-email', {
      state: {
        email: email.trim(),
        verificationLink
      }
    });
  } catch (err) {
    const message =
      err.message ||
      'Đăng ký thất bại, vui lòng thử lại.';

    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleRegister
  };
};