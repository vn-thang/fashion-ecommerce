import React from 'react';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthMessage from '../components/AuthMessage';
import AuthFooter from '../components/AuthFooter';

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
    <AuthLayout
      height="min-h-[500px]"
      brandDescription="Đừng lo lắng! Hãy nhập email đăng ký để nhận liên kết khôi phục mật khẩu tài khoản của bạn."
      arrow="‹"
    >
      <AuthHeader
        title="Reset Password"
        subtitle="Recover your account"
        activeStep={3}
      />

      <AuthMessage type="error">
        {error}
      </AuthMessage>

      <AuthMessage type="success">
        {message}
      </AuthMessage>

      {!message ? (
        <form
          onSubmit={handleForgotPassword}
          className="flex w-full flex-col gap-4"
        >
          <p className="px-1 text-xs font-medium leading-relaxed text-slate-500">
            Nhập địa chỉ Email đã đăng ký. Hệ thống sẽ
            gửi một liên kết bảo mật để thiết lập lại
            mật khẩu mới.
          </p>

          <Input
            variant="auth"
            type="email"
            placeholder="Enter your Email address"
            value={email}
            onChange={e =>
              setEmail(e.target.value)
            }
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
            Vui lòng kiểm tra hộp thư Email của anh và
            nhấn vào liên kết để đặt lại mật khẩu.
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Liên kết chỉ có hiệu lực trong 15 phút.
          </p>
        </div>
      )}

      <AuthFooter
        text="Remembered your password?"
        linkText="Back to Sign In"
        to="/login"
      />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
