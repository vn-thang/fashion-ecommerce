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
    handleForgotPassword,
    handleUseAnotherEmail
  } = useForgotPassword();

  return (
    <AuthLayout
      height="min-h-[500px]"
      brandDescription="Đừng lo lắng! Hãy nhập email đăng ký để nhận liên kết khôi phục mật khẩu tài khoản của bạn."
      arrow="‹"
    >
      <AuthHeader
        title="Đặt lại mật khẩu"
  subtitle="Khôi phục tài khoản của bạn"
        activeStep={3}
      />

      <AuthMessage type="error">
        {error}
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
          placeholder="Nhập địa chỉ Email"
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
  ? 'ĐANG TẠO LIÊN KẾT...'
  : 'TẠO LIÊN KẾT ĐẶT LẠI MẬT KHẨU'}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-5 text-center">
          <div className="rounded-2xl bg-slate-50 p-6">
            <div className="mb-3 text-4xl">
              ✉️
            </div>

            <p className="text-sm font-semibold text-slate-700">
              Nếu địa chỉ email đã đăng ký tài khoản, hướng dẫn đặt lại mật khẩu sẽ được gửi đến bạn.
            </p>

            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Vui lòng kiểm tra hộp thư, sau đó làm theo hướng dẫn trong email để tạo mật khẩu mới.
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Liên kết đặt lại mật khẩu có hiệu lực trong 15 phút.
            </p>
          </div>

          <button
            type="button"
            onClick={handleUseAnotherEmail}
            className="text-xs font-semibold text-slate-400 transition hover:text-[#c36374]"
          >
            Sử dụng email khác
          </button>
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

export default ForgotPasswordPage;