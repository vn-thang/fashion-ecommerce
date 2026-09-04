import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useCart } from '../../../cart/hooks/CartContext';
import Button from '../../../../shared/components/Button';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { fetchCart } = useCart();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!orderDetails) return <Navigate to="/" replace />;

  const {
    orderNumber,
    receiverName,
    phoneNumber,
    address,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    paymentMethod
  } = orderDetails;

  const formatPrice = price =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);

  const formatPaymentMethod = method => ({
    COD: 'Thanh toán khi nhận hàng (COD)',
    VNPAY: 'Thanh toán qua VNPay'
  }[method] || 'Chưa xác định');

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
          🎉
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Đặt hàng thành công!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Mã đơn hàng</span>
            <span className="font-bold text-indigo-600">
              {orderNumber}
            </span>
          </div>

          <div>
            <div className="text-gray-500">Thông tin nhận hàng</div>
            <div className="mt-1 font-semibold text-gray-800">
              {receiverName}
            </div>
            <div className="mt-1 text-gray-600">
              {phoneNumber}
            </div>
            <div className="mt-1 leading-5 text-gray-600">
              {address}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Thanh toán</span>
            <span
              className={`font-semibold ${
                paymentMethod === 'VNPAY'
                  ? 'text-blue-600'
                  : 'text-emerald-600'
              }`}
            >
              {formatPaymentMethod(paymentMethod)}
            </span>
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

          {Number(discountAmount) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Giảm giá</span>
              <span className="text-red-500">
                -{formatPrice(discountAmount)}
              </span>
            </div>
          )}

          {Number(shippingFee) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
          )}

            <div className="flex justify-between border-t pt-2">
              <span className="font-bold">Tổng tiền</span>
              <span className="text-lg font-extrabold text-[#ee4d2d]">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Tiếp tục mua sắm
            </Button>
          </Link>

          <Link to="/account/orders" className="flex-1">
            <Button variant="secondary" className="w-full">
              Xem đơn hàng
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;