import React from 'react';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthMessage from '../components/AuthMessage';
import AuthFooter from '../components/AuthFooter';

import { useResetPassword } from '../hooks/useResetPassword';

const ResetPasswordPage = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    loading,
    handleResetPassword
  } = useResetPassword();

  return (
    <AuthLayout
      height="min-h-[500px]"
      brandIcon="🔐"
      brandDescription="Thiết lập mật khẩu mới để bảo vệ tài khoản và tiếp tục trải nghiệm mua sắm thời trang cùng chúng tôi."
      arrow="‹"
    >
      <AuthHeader
        title="Mật khẩu mới"
  subtitle="Thiết lập mật khẩu mới"
        activeStep={2}
      />

      <AuthMessage type="error">
        {error}
      </AuthMessage>

      <AuthMessage type="success">
        {message}
      </AuthMessage>

      {!message && (
        <form
          onSubmit={handleResetPassword}
          className="flex w-full flex-col gap-4"
        >
          <Input
            variant="auth"
            type="password"
              placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={e =>
              setNewPassword(e.target.value)
            }
            disabled={loading}
          />

          <Input
            variant="auth"
            type="password"
           placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={e =>
              setConfirmPassword(e.target.value)
            }
            disabled={loading}
          />

          <p className="px-1 text-xs font-medium leading-relaxed text-slate-500">
            Mật khẩu phải có ít nhất 8 ký tự.
          </p>

          <Button
            type="submit"
            variant="auth"
            disabled={loading}
            className="mt-2 w-full py-3 text-sm font-black tracking-wide"
          >
        {loading
  ? 'ĐANG CẬP NHẬT...'
  : 'ĐỔI MẬT KHẨU'}
          </Button>
        </form>
      )}

      {message && (
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Mật khẩu của bạn đã được cập nhật thành công.
          </p>
        </div>
      )}

      <AuthFooter
         text="Bạn đã nhớ mật khẩu?"
  linkText="Quay lại đăng nhập"
        to="/login"
      />
    </AuthLayout>
  );
};

export default ResetPasswordPage;