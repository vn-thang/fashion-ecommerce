import { useState } from 'react';
import { authApi } from '../api/authApi';
import { useAuth } from '../store/authContext';

export const useLogin = () => {
  const { loginSuccess } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(username, password);
      loginSuccess(data.user, data.accessToken);
      alert('Đăng nhập thành công vào hệ thống KING!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    handleLogin,
  };
};