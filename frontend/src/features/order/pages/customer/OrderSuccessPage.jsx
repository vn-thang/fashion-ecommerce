import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useCart } from '../../../cart/hooks/CartContext';
import Button from '../../../../shared/components/Button';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { fetchCart } = useCart();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => { fetchCart(); }, [fetchCart]);

  if (!orderDetails) return <Navigate to="/" replace />;

  const formatPrice = p => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

  const formatPaymentMethod = method => {
    switch (method) {
      case 'COD': return 'Thanh toán khi nhận hàng (COD)';
      case 'VNPAY': return 'Thanh toán qua VNPAY';
      default: return 'Chưa xác định';
    }
  };

  const paymentMethod = orderDetails.payment?.paymentMethod || orderDetails.paymentMethod;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-4xl text-emerald-500 animate-bounce">🎉</div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Đặt hàng thành công!</h1>
          <p className="mt-2 text-sm text-gray-500">Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-3 text-left">
          <div className="flex justify-between"><span className="text-gray-500">Mã đơn hàng</span><span className="font-bold text-indigo-600 uppercase">{orderDetails.orderNumber}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Người nhận</span><span className="font-semibold">{orderDetails.receiverName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Thanh toán</span><span className={`font-semibold ${paymentMethod === 'VNPAY' ? 'text-blue-600' : 'text-emerald-600'}`}>{formatPaymentMethod(paymentMethod)}</span></div>
          <div className="border-t pt-3 flex justify-between"><span className="font-bold">Tổng tiền</span><span className="font-extrabold text-[#ee4d2d]">{formatPrice(orderDetails.totalAmount)}</span></div>
        </div>

        <div className="flex gap-3">
          <Link to="/" className="flex-1"><Button variant="outline" className="w-full">Tiếp tục mua sắm</Button></Link>
          <Link to="/account/orders" className="flex-1"><Button variant="secondary" className="w-full">Lịch sử đơn</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;