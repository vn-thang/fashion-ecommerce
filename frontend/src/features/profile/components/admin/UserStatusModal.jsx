import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const UserStatusModal = ({
  isOpen,
  onClose,
  user,
  onConfirm
}) => {
  if (!user) return null;

  const willLock = user.isActive;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        willLock
          ? 'Khóa tài khoản'
          : 'Mở khóa tài khoản'
      }
      size="md"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>

          <Button
            variant={
              willLock
                ? 'danger'
                : 'primary'
            }
            onClick={() =>
              onConfirm(!user.isActive)
            }
          >
            {willLock
              ? 'Khóa tài khoản'
              : 'Mở khóa'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              willLock
                ? 'bg-red-100'
                : 'bg-emerald-100'
            }`}
          >
            <span className="text-4xl">
              {willLock ? '🔒' : '🔓'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={
              user.avatarUrl ||
              'https://placehold.co/100'
            }
            alt=""
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />

          <h3 className="mt-3 text-sm font-bold text-slate-800">
            {user.fullName || 'Chưa cập nhật'}
          </h3>

          <p className="text-xs text-gray-500">
            {user.email}
          </p>
        </div>
        <div
          className={`rounded-xl border p-5 ${
            willLock
              ? 'border-red-200 bg-red-50'
              : 'border-emerald-200 bg-emerald-50'
          }`}
        >
          <h4
            className={`font-semibold ${
              willLock
                ? 'text-red-700'
                : 'text-emerald-700'
            }`}
          >
            {willLock
              ? 'Bạn sắp khóa tài khoản này'
              : 'Bạn sắp mở khóa tài khoản này'}
          </h4>

          <p className="mt-3 text-xs leading-6 text-gray-600">
            {willLock
              ? 'Khách hàng sẽ không thể đăng nhập, đặt hàng hoặc sử dụng bất kỳ chức năng nào của hệ thống cho đến khi tài khoản được mở khóa.'
              : 'Khách hàng sẽ có thể đăng nhập và tiếp tục sử dụng tất cả các chức năng của hệ thống.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-lg border bg-gray-50 p-3">
            <p className="text-xs text-gray-400">
              Vai trò
            </p>

            <p className="font-semibold">
              {user.role}
            </p>
          </div>

          <div className="rounded-lg border bg-gray-50 p-3">
            <p className="text-xs text-gray-400">
              Trạng thái hiện tại
            </p>

            <p
              className={`font-semibold ${
                user.isActive
                  ? 'text-emerald-600'
                  : 'text-red-600'
              }`}
            >
              {user.isActive
                ? 'Hoạt động'
                : 'Đã khóa'}
            </p>
          </div>

        </div>

      </div>
    </Modal>
  );
};

export default UserStatusModal;