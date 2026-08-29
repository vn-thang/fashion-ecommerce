import React from 'react';
import Input from '../../../shared/components/Input/index';
import Button from '../../../shared/components/Button/index';
import { useChangePassword } from '../hooks/useChangePassword';

const ChangePassword = () => {
  const {
    pwdData,
    error,
    isLoading,
    handleChange,
    handleSubmit
  } = useChangePassword();

  return (
    <div className="text-left max-w-xl">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-800">
          Đổi mật khẩu
        </h3>

        <p className="text-sm text-gray-500 mt-0.5">
          Để bảo mật tài khoản, vui lòng không chia sẻ
          mật khẩu cho người khác.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && (
          <div className="p-3 bg-rose-50 text-rose-500 rounded-lg text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <Input
          label="Mật khẩu hiện tại"
          type="password"
          required
          placeholder="Nhập mật khẩu hiện tại"
          value={pwdData.currentPassword}
          onChange={e =>
            handleChange(
              'currentPassword',
              e.target.value
            )
          }
        />

        <Input
          label="Mật khẩu mới"
          type="password"
          required
          placeholder="Nhập mật khẩu mới"
          value={pwdData.newPassword}
          onChange={e =>
            handleChange(
              'newPassword',
              e.target.value
            )
          }
        />

        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          required
          placeholder="Nhập lại mật khẩu mới"
          value={pwdData.confirmPassword}
          onChange={e =>
            handleChange(
              'confirmPassword',
              e.target.value
            )
          }
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="bg-[#ee4d2d] hover:bg-[#d74123] border-none text-white px-6"
          >
            Xác nhận
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;