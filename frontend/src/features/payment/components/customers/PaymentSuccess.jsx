import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../cart/hooks/CartContext';
import Button from '../../../../shared/components/Button';

const PaymentSuccess = ({ payment }) => {
  const { fetchCart } = useCart();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"><span className="text-4xl text-emerald-600">✓</span></div>
        <h1 className="mt-5 text-2xl font-bold text-gray-900">Thanh toán thành công</h1>
        <p className="mt-2 text-gray-500">Giao dịch của bạn đã được xác nhận.</p>
      </div>

      <div className="mt-8 divide-y divide-gray-100">
        <div className="flex justify-between py-3"><span className="text-gray-500">Mã đơn hàng</span><span className="font-semibold">{payment.orderNumber}</span></div>
        <div className="flex justify-between py-3"><span className="text-gray-500">Số tiền</span><span className="font-semibold text-emerald-600">{Number(payment.amount).toLocaleString('vi-VN')}₫</span></div>
      </div>

      <div className="flex gap-3 mt-8">
        <Link to={`/account/orders/${payment.orderId}`} className="flex-1"><Button className="w-full">Xem đơn hàng</Button></Link>
        <Link to="/" className="flex-1"><Button variant="outline" className="w-full">Về trang chủ</Button></Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;