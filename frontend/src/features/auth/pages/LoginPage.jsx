import React, { useState } from 'react';
import { authApi } from '../api/authApi';
import { useAuth } from '../store/authContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const LoginPage = () => {
  const { loginSuccess } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

   try {
      const result = await authApi.login(username, password);

      const loginData = result.data; 

      loginSuccess(loginData.user, loginData.accessToken);
      toast.success('Đăng nhập thành công!');
      
      const userRole = loginData.user?.role?.toLowerCase();
      
      if (userRole === 'admin') {
        navigate('/admin/dashboard'); 
      } else {
        navigate('/');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#8893b0] via-[#a1889f] to-[#6d9ac4] p-4 font-sans">
      <div className="relative flex h-[540px] w-[880px] overflow-hidden rounded-[35px] bg-[#eaecf0] shadow-2xl">
        <div
          className="relative z-10 flex w-[45%] flex-col items-center justify-center bg-[#1f2438] p-10 text-center text-white"
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)'
          }}
        >
          <div className="flex flex-col items-center gap-4 pr-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl border border-white/20 shadow-lg text-white">
              👑
            </div>

            <h1 className="text-3xl font-black tracking-widest text-white uppercase">
              KING
            </h1>

            <p className="max-w-[200px] text-[12px] leading-relaxed text-slate-300">
              Lorem ipsum dolor sit amet...
            </p>

            <Button
              variant="auth"
              size="sm"
              className="mt-4 px-8 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="absolute left-[42.5%] top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#c36374] border-4 border-[#eaecf0] shadow-xl cursor-pointer text-white transition hover:scale-110 active:scale-95">
          <span className="text-lg font-black select-none leading-none mb-0.5">
            ‹
          </span>
        </div>

        <div className="relative z-20 flex w-[55%] flex-col justify-center bg-[#eaecf0] pl-16 pr-12 py-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black tracking-tight text-[#1f2438]">
              Welcome Back!
            </h2>

            <p className="text-xs font-bold text-slate-500 mt-1 tracking-wide uppercase">
              Sign in to continue
            </p>

            <div className="flex justify-center gap-1.5 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#c36374]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-600 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <Input
              variant="auth"
              type="text"
              placeholder="Email or Phone number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              variant="auth"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="accent-[#c36374] h-3.5 w-3.5"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="hover:text-[#c36374] transition hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="auth"
              disabled={loading}
              className="mt-2 w-full py-3 text-sm font-black tracking-wide"
            >
              {loading ? 'SIGNING IN...' : 'Login'}
            </Button>
          </form>

          <div className="mt-8 text-center text-[11px] font-bold text-slate-500 tracking-wide">
            Don't have an account?

            <Link
              to="/register"
              className="text-[#c36374] hover:underline font-extrabold ml-1"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;