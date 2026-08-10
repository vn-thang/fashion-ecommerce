import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { authApi } from '../api/authApi';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!token) {
      setError('Link đặt lại mật khẩu không hợp lệ!');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.resetPassword(
        token,
        newPassword
      );

      setMessage(
        data?.message ||
        'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
        'Đặt lại mật khẩu thất bại!'
      );
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl shadow-lg">
              🔐
            </div>

            <h1 className="text-3xl font-black uppercase tracking-widest">
              KING
            </h1>

            <p className="max-w-[220px] text-[12px] leading-relaxed text-slate-300">
              Tạo mật khẩu mới để tiếp tục sử dụng tài khoản KING.
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
              New Password
            </h2>

            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Create a new password
            </p>

            <div className="mt-2 flex justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#c36374]" />
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

          {!message && (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-4"
            >
              <Input
                variant="auth"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                disabled={loading}
              />

              <Input
                variant="auth"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
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
                  ? 'RESETTING...'
                  : 'RESET PASSWORD'}
              </Button>
            </form>
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

export default ResetPasswordPage;