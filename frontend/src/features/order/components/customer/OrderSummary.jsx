import React from 'react';

const PAYMENT_STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ thanh toán',
    color: 'text-orange-600'
  },
  SUCCESS: {
    label: 'Đã thanh toán',
    color: 'text-emerald-600'
  },
  FAILED: {
    label: 'Thanh toán thất bại',
    color: 'text-rose-600'
  },
  CANCELLED: {
    label: 'Đã hủy thanh toán',
    color: 'text-gray-500'
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    color: 'text-blue-600'
  }
};

const OrderSummary = ({ order, formatPrice }) => {
  const paymentMethodText =
    order.payment?.paymentMethod === 'COD'
      ? 'Thanh toán khi nhận hàng (COD)'
      : order.payment?.paymentMethod === 'VNPAY'
      ? 'Thanh toán qua VNPAY'
      : 'Chưa xác định';

  const paymentStatus =
    order.payment?.paymentMethod === 'COD' &&
    order.payment?.status === 'PENDING'
      ? {
          label: 'Thanh toán khi nhận hàng',
          color: 'text-orange-600'
        }
      : PAYMENT_STATUS_CONFIG[order.payment?.status] || {
          label: 'Không xác định',
          color: 'text-gray-500'
        };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
      <div className="space-y-3 text-xs text-gray-600 border-b border-gray-100 pb-4 mb-4">
        <div className="flex justify-between">
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(order.shippingFee)}</span>
        </div>

        {Number(order.discountAmount) > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Giảm giá</span>
            <span>- {formatPrice(order.discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold text-gray-800 text-base">
            Tổng thanh toán
          </span>

          <span className="text-xl font-bold text-rose-600">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">
            Phương thức thanh toán
          </span>

          <span className="font-medium text-gray-800">
            {paymentMethodText}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">
            Trạng thái thanh toán
          </span>

          <span className={`font-semibold ${paymentStatus.color}`}>
            {paymentStatus.label}
          </span>
        </div>
      </div>
      {order.status === 'CANCELLED' && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">❌</span>
            <h3 className="font-semibold text-red-700">
              Thông tin hủy đơn
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Người hủy</span>

              <span className="font-medium text-gray-800">
                {order.cancelledBy === 'CUSTOMER'
                  ? 'Khách hàng'
                  : order.cancelledBy === 'ADMIN'
                  ? 'Quản trị viên'
                  : order.cancelledBy === 'SYSTEM'
                  ? 'Hệ thống'
                  : 'Không xác định'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Thời gian hủy</span>

              <span className="font-medium text-gray-800">
                {order.cancelledAt
                  ? new Date(order.cancelledAt).toLocaleString('vi-VN')
                  : '--'}
              </span>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Lý do hủy</p>

              <div className="rounded-lg border border-red-100 bg-white px-3 py-2 text-gray-700">
                {order.cancelReason || 'Không có lý do'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;