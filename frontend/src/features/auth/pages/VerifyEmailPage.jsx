import React from 'react';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthMessage from '../components/AuthMessage';
import AuthFooter from '../components/AuthFooter';

import { useVerifyEmail } from '../hooks/useVerifyEmail';

const VerifyEmailPage = () => {
  const {
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
  } = useVerifyEmail();

  return (
    <AuthLayout
      height="min-h-[500px]"
      brandDescription="Xác thực email để hoàn tất đăng ký và bắt đầu hành trình khám phá phong cách thời trang của riêng bạn."
      arrow="‹"
    >
      <AuthHeader
        title={success ? 'Email Verified' : 'Verify Email'}
        subtitle={
         success
  ? 'Tài khoản của bạn đã sẵn sàng'
  : 'Xác thực địa chỉ email của bạn'
        }
        activeStep={2}
      />

      <AuthMessage type="error">
        {error}
      </AuthMessage>

      {loading && (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Đang xác thực email...
          </p>
        </div>
      )}

      {!loading && success && (
        <div className="flex flex-col gap-4 text-center">
          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-sm font-semibold text-green-700">
              Email của bạn đã được xác thực thành công.
            </p>

            <p className="mt-2 text-xs text-green-600">
              Bây giờ bạn có thể đăng nhập vào tài khoản.
            </p>
          </div>

          <Button
            type="button"
            variant="auth"
            onClick={handleLogin}
            className="w-full py-3 text-sm font-black tracking-wide"
          >
          ĐĂNG NHẬP
          </Button>
        </div>
      )}

      {!loading && !success && waiting && (
        <div className="flex flex-col gap-5 text-center">
          <div className="rounded-2xl bg-slate-50 p-6">
            <div className="mb-3 text-4xl">
              ✉️
            </div>

            <p className="text-sm font-semibold text-slate-700">
              Xác thực email của bạn
            </p>

            {email && (
              <>
                <p className="mt-2 text-xs text-slate-500">
                  Chúng tôi đã gửi liên kết xác thực đến
                </p>

                <p className="mt-1 break-all text-sm font-bold text-[#c36374]">
                  {email}
                </p>
              </>
            )}

            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Vui lòng kiểm tra hộp thư và nhấn vào
              liên kết xác thực để hoàn tất đăng ký tài khoản.
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Liên kết xác thực có hiệu lực trong 15 phút.
            </p>
          </div>

          {verificationLink && (
            <Button
              type="button"
              variant="auth"
              onClick={handleVerifyDemo}
              className="w-full py-3 text-sm font-black tracking-wide"
            >
              XÁC THỰC TÀI KHOẢN
            </Button>
          )}

          <div className="border-t border-slate-200 pt-4">
            <p className="mb-3 text-xs text-slate-500">
              Không nhận được email?
            </p>

            <div className="flex flex-col gap-3">
              <Input
                variant="auth"
                type="email"
                placeholder="Enter your Email address"
                value={email}
                onChange={e =>
                  setEmail(e.target.value)
                }
                disabled={resending}
              />

              <Button
                type="button"
                variant="auth"
                disabled={resending}
                onClick={handleResend}
                className="w-full py-3 text-sm font-black tracking-wide"
              >
             {resending
  ? 'ĐANG TẠO LIÊN KẾT...'
  : 'TẠO LIÊN KẾT XÁC THỰC MỚI'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!loading && !success && !waiting && (
        <div className="flex flex-col gap-4 text-center">
          <AuthMessage type="error">
            {error}
          </AuthMessage>

          <p className="text-sm font-medium leading-relaxed text-slate-600">
            Liên kết xác thực không hợp lệ hoặc đã hết hạn.
          </p>

          <p className="text-xs leading-relaxed text-slate-400">
            Nhập email đã đăng ký để nhận một liên kết xác thực mới.
          </p>

          <Input
            variant="auth"
            type="email"
           placeholder="Nhập địa chỉ Email"
            value={email}
            onChange={e =>
              setEmail(e.target.value)
            }
            disabled={resending}
          />

          <Button
            type="button"
            variant="auth"
            disabled={resending}
            onClick={handleResend}
            className="w-full py-3 text-sm font-black tracking-wide"
          >
            {resending
              ? 'SENDING EMAIL...'
              : 'RESEND VERIFICATION EMAIL'}
          </Button>
        </div>
      )}

      <AuthFooter
         text="Đã xác thực?"
  linkText="Đăng nhập"
        to="/login"
      />
    </AuthLayout>
  );
};

export default VerifyEmailPage;