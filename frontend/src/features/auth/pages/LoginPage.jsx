import React from 'react';
import { Link } from 'react-router-dom';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthMessage from '../components/AuthMessage';
import AuthFooter from '../components/AuthFooter';

import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const {
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
  } = useLogin();

  return (
    <AuthLayout
      height="h-[580px]"
      brandDescription="Khám phá phong cách thời trang của riêng bạn. Đăng nhập để trải nghiệm mua sắm và những ưu đãi đặc biệt dành riêng cho bạn."
      arrow="‹"
    >
      <AuthHeader
      title="Chào mừng trở lại!"
      subtitle="Đăng nhập để tiếp tục"
        activeStep={2}
      />

      <AuthMessage type="error">
        {error}
      </AuthMessage>

      <form
        onSubmit={handleLogin}
        className="flex w-full flex-col gap-4"
      >
        <Input
          variant="auth"
          type="text"
          placeholder="Email or Phone number"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading || resending}
        />

        <Input
          variant="auth"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading || resending}
        />

        <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e =>
                setRememberMe(e.target.checked)
              }
              disabled={loading || resending}
              className="h-3.5 w-3.5 accent-[#c36374]"
            />
            Ghi nhớ đăng nhập
          </label>

          <Link
            to="/forgot-password"
            className="transition hover:text-[#c36374] hover:underline"
          >
              Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          variant="auth"
          disabled={loading || resending}
          className="mt-2 w-full py-3 text-sm font-black tracking-wide"
        >
          {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
        </Button>
      </form>

{verificationRequired && (
  <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm">
        ✉
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-700">
          Email chưa được xác thực
        </p>

        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
          Xác thực email để kích hoạt tài khoản của bạn.
        </p>
      </div>
    </div>

    <Button
      type="button"
      variant="auth"
      onClick={handleVerifyEmail}
      disabled={resending}
      className="mt-3 w-full py-2.5 text-xs font-black tracking-wide"
    >
      {resending
        ? 'ĐANG TẠO LINK...'
        : 'XÁC THỰC EMAIL'}
    </Button>
  </div>
)}

      <AuthFooter
         text="Chưa có tài khoản?"
  linkText="Đăng ký"
        to="/register"
      />
    </AuthLayout>
  );
};

export default LoginPage;