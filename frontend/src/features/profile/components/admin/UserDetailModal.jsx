import React from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const InfoItem = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-2 text-xs font-semibold text-slate-700 break-all">
      {value || '---'}
    </p>
  </div>
);

const UserDetailModal = ({
  isOpen,
  onClose,
  user
}) => {
  const navigate = useNavigate();

  if (!user) return null;

  const handleViewOrders = () => {
    onClose();

   navigate(
  `/admin/sales/orders?customerId=${user.id}&customerName=${encodeURIComponent(user.fullName)}`
);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết khách hàng"
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleViewOrders}
          >
            Xem tất cả đơn hàng
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="flex items-center gap-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">
          <img
            src={
              user.avatarUrl ||
              'https://placehold.co/120x120'
            }
            alt=""
            className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl"
          />

          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {user.fullName || 'Chưa cập nhật'}
            </h2>

            <p className="mt-1 text-blue-100">
              {user.email}
            </p>

            <p className="mt-1 text-blue-100">
              {user.phoneNumber || '---'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                {user.role}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {user.isActive
                  ? 'Đang hoạt động'
                  : 'Đã khóa'}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-700">
            Thông tin tài khoản
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem
              label="Họ và tên"
              value={user.fullName}
            />

            <InfoItem
              label="Email"
              value={user.email}
            />

            <InfoItem
              label="Số điện thoại"
              value={user.phoneNumber}
            />

            <InfoItem
              label="Vai trò"
              value={user.role}
            />

            <InfoItem
              label="Điểm tích lũy"
              value={user.totalPoints}
            />

            <InfoItem
              label="Tổng đơn hàng"
              value={user._count?.orders || 0}
            />

            <InfoItem
              label="Trạng thái"
              value={
                user.isActive
                  ? 'Hoạt động'
                  : 'Đã khóa'
              }
            />

            <InfoItem
              label="Ngày tham gia"
              value={new Date(
                user.createdAt
              ).toLocaleString('vi-VN')}
            />
          </div>
        </div>

        {user.addresses?.length > 0 && (
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-700">
              Danh sách địa chỉ
            </h3>

            <div className="space-y-3">
              {user.addresses.map(address => (
                <div
                  key={address.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">
                        {address.receiverName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {address.phoneNumber}
                      </p>
                    </div>

                    {address.isDefault && (
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        Mặc định
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-gray-600">
                    {address.addressLine},{' '}
                    {address.ward},{' '}
                    {address.province}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserDetailModal;