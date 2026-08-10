import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../../shared/components/Button';

const PaymentFailed = ({ payment }) => {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">

      <div className="flex flex-col items-center">

        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center">
          <span className="text-4xl text-rose-600">
            ✕
          </span>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Thanh toán thất bại
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Giao dịch chưa được thực hiện.
          <br />
          Bạn có thể thanh toán lại.
        </p>

      </div>

      <div className="flex gap-3 mt-8">

        <Link
          to={`/account/orders/${payment.orderId}`}
          className="flex-1"
        >
          <Button className="w-full">
            Quay lại đơn hàng
          </Button>
        </Link>

        <Link
          to="/"
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full"
          >
            Trang chủ
          </Button>
        </Link>

      </div>

    </div>
  );
};

export default PaymentFailed;