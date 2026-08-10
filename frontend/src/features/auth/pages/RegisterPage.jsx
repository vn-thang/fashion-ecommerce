import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);

    try {
      await authApi.register({
        fullName,
        email,
        password
      });

     toast.success('Đăng ký tài khoản thành công!');
    } catch (err) {
      toast.error(
        err.message ||
        'Đăng ký thất bại, vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#8893b0] via-[#a1889f] to-[#6d9ac4] p-4 font-sans">
      <div className="relative flex h-[580px] w-[880px] overflow-hidden rounded-[35px] bg-[#eaecf0] shadow-2xl">

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
              Trở thành một phần của triều đại KING. Quản lý hệ thống dữ liệu
              thông minh và trải nghiệm đặc quyền tối thượng ngay hôm nay.
            </p>

            <Button
              type="button"
              variant="auth"
              size="sm"
              className="mt-4 px-8 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Explore Now
            </Button>
          </div>
        </div>

        <div className="absolute left-[42.5%] top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#c36374] border-4 border-[#eaecf0] shadow-xl cursor-pointer text-white transition hover:scale-110 active:scale-95">
          <span className="text-lg font-black select-none leading-none mb-0.5">
            ›
          </span>
        </div>

        <div className="relative z-20 flex w-[55%] flex-col justify-center bg-[#eaecf0] pl-16 pr-12 py-6">
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-black tracking-tight text-[#1f2438]">
              Create Account
            </h2>

            <p className="text-xs font-bold text-slate-500 mt-1 tracking-wide uppercase">
              Get started for free
            </p>

            <div className="flex justify-center gap-1.5 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c36374]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-xl bg-red-100 p-2.5 text-xs font-bold text-red-600 border border-red-200 text-center">
              ⚠️ {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 w-full"
          >
            <Input
              variant="auth"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              variant="auth"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              variant="auth"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="auth"
              disabled={loading}
              className="mt-2 w-full py-3 text-sm font-black tracking-wide"
            >
              {loading
                ? 'CREATING ACCOUNT...'
                : 'REGISTER'}
            </Button>
          </form>

          <div className="mt-6 text-center text-[11px] font-bold text-slate-500 tracking-wide">
            Already have an account?

            <Link
              to="/login"
              className="text-[#c36374] hover:underline font-extrabold ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;