import React from 'react';
import { Link } from 'react-router-dom';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { useForgotPassword } from '../hooks/useForgotPassword';

const ForgotPasswordPage = () => {
  const {
    email,
    setEmail,
    message,
    error,
    loading,
    handleForgotPassword
  } = useForgotPassword();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaecf0] p-4">
      <div className="relative flex w-full max-w-4xl min-h-[500px] overflow-hidden rounded-2xl shadow-2xl">
        <div
          className="relative z-10 flex w-[45%] flex-col items-center justify-center bg-[#1f2438] p-10 text-center text-white"
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)'
          }}
        >
          <div className="flex flex-col items-center gap-4 pr-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl text-white shadow-lg">
              👑
            </div>

            <h1 className="text-3xl font-black uppercase tracking-widest">
              KING
            </h1>

            <p className="max-w-[220px] text-[12px] leading-relaxed text-slate-300">
              Đừng lo lắng! Hãy nhập email đăng ký để nhận liên kết
              khôi phục mật khẩu tài khoản của bạn.
            </p>
          </div>
        </div>

        <div className="absolute left-[42.5%] top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#eaecf0] bg-[#c36374] text-white shadow-xl">
          <span className="mb-0.5 text-lg font-black leading-none">
            ‹
          </span>
        </div>

        <div className="relative z-20 flex w-[55%] flex-col justify-center bg-[#eaecf0] py-8 pl-16 pr-12">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black tracking-tight text-[#1f2438]">
              Reset Password
            </h2>

            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Recover your account
            </p>

            <div className="mt-2 flex justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#c36374]" />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-100 p-2.5 text-center text-xs font-bold text-red-600">
              ⚠️ {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-100 p-2.5 text-center text-xs font-bold text-green-700">
              🎉 {message}
            </div>
          )}

          {!message ? (
            <form
              onSubmit={handleForgotPassword}
              className="flex w-full flex-col gap-4"
            >
              <p className="px-1 text-xs font-medium leading-relaxed text-slate-500">
                Nhập địa chỉ Email đã đăng ký. Hệ thống sẽ gửi một
                liên kết bảo mật để thiết lập lại mật khẩu mới.
              </p>

              <Input
                variant="auth"
                type="email"
                placeholder="Enter your Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                variant="auth"
                disabled={loading}
                className="mt-2 w-full py-3 text-sm font-black tracking-wide"
              >
                {loading
                  ? 'SENDING LINK...'
                  : 'SEND RESET LINK'}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                Vui lòng kiểm tra hộp thư Email của anh và nhấn vào
                liên kết để đặt lại mật khẩu.
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Liên kết chỉ có hiệu lực trong 15 phút.
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-[11px] font-bold tracking-wide text-slate-500">
            Remembered your password?

            <Link
              to="/login"
              className="ml-1 font-extrabold text-[#c36374] hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;