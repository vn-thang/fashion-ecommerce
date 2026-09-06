import React from 'react';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

import AuthLayout from '../components/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import AuthMessage from '../components/AuthMessage';
import AuthFooter from '../components/AuthFooter';

import { useRegister } from '../hooks/useRegister';

const RegisterPage = () => {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleRegister
  } = useRegister();

  return (
    <AuthLayout
      height="h-[580px]"
      brandDescription="Bắt đầu hành trình định hình phong cách của riêng bạn. Đăng ký ngay để khám phá những xu hướng thời trang mới nhất và ưu đãi đặc biệt."
      arrow="›"
    >
      <AuthHeader
       title="Tạo tài khoản"
  subtitle="Đăng ký để bắt đầu mua sắm"
        activeStep={1}
      />

      <AuthMessage type="error">
        {error}
      </AuthMessage>

      <form
        onSubmit={handleRegister}
        className="flex w-full flex-col gap-3"
      >
        <Input
          variant="auth"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e =>
            setFullName(e.target.value)
          }
        />

        <Input
          variant="auth"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e =>
            setEmail(e.target.value)
          }
        />

        <Input
          variant="auth"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e =>
            setPassword(e.target.value)
          }
        />

        <Button
          type="submit"
          variant="auth"
          disabled={loading}
          className="mt-2 w-full py-3 text-sm font-black tracking-wide"
        >
         {loading
  ? 'ĐANG TẠO TÀI KHOẢN...'
  : 'ĐĂNG KÝ'}
        </Button>
      </form>

      <AuthFooter
         text="Đã có tài khoản?"
  linkText="Đăng nhập"
        to="/login"
      />
    </AuthLayout>
  );
};

export default RegisterPage;
