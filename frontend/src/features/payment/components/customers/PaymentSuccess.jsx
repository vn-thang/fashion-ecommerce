import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../cart/hooks/CartContext';
import Button from '../../../../shared/components/Button';

const PaymentSuccess = ({ payment }) => {
  const { fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const formatPrice = price =>
    Number(price || 0).toLocaleString('vi-VN') + '₫';

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-4xl text-emerald-600">✓</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Thanh toán thành công
        </h1>

        <p className="mt-2 text-gray-500">
          Giao dịch của bạn đã được xác nhận.
        </p>
      </div>

      <div className="mt-8 space-y-4 rounded-xl bg-gray-50 p-5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Mã đơn hàng</span>
          <span className="font-semibold text-indigo-600">
            {payment.orderNumber}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Phương thức</span>
          <span className="font-medium text-gray-800">
            VNPay
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="text-gray-500">Thông tin nhận hàng</div>

          <div className="mt-2 font-semibold text-gray-900">
            {payment.receiverName}
          </div>

          <div className="mt-1 text-gray-600">
            {payment.phoneNumber}
          </div>

          <div className="mt-1 leading-5 text-gray-600">
            {payment.address}
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Tạm tính</span>
            <span>{formatPrice(payment.subtotal)}</span>
          </div>

          {Number(payment.discountAmount) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Giảm giá</span>
              <span className="text-red-500">
                -{formatPrice(payment.discountAmount)}
              </span>
            </div>
          )}

          {Number(payment.shippingFee) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span>{formatPrice(payment.shippingFee)}</span>
            </div>
          )}

          <div className="flex justify-between border-t pt-3">
            <span className="font-bold text-gray-900">
              Tổng tiền đơn hàng
            </span>
            <span className="text-lg font-bold text-emerald-600">
              {formatPrice(payment.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          to={`/account/orders/${payment.orderId}`}
          className="flex-1"
        >
          <Button className="w-full">
            Xem đơn hàng
          </Button>
        </Link>

        <Link to="/" className="flex-1">
          <Button variant="outline" className="w-full">
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;