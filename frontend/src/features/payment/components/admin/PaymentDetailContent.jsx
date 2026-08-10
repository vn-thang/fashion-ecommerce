import React from 'react';

const PAYMENT_METHOD = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  VNPAY: 'Thanh toán qua VNPAY'
};

const PAYMENT_STATUS = {
  PENDING: {
    label: 'Chờ thanh toán',
    className: 'bg-amber-100 text-amber-700'
  },
  SUCCESS: {
    label: 'Đã thanh toán',
    className: 'bg-emerald-100 text-emerald-700'
  },
  FAILED: {
    label: 'Thanh toán thất bại',
    className: 'bg-red-100 text-red-700'
  },
  CANCELLED: {
    label: 'Đã hủy thanh toán',
    className: 'bg-gray-100 text-gray-700'
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    className: 'bg-sky-100 text-sky-700'
  }
};

const ORDER_STATUS = {
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  RETURN: 'Hoàn trả'
};

const formatPrice = value =>
  Number(value || 0).toLocaleString('vi-VN') + ' đ';

const formatDate = value => {
  if (!value) return '--';
  return new Date(value).toLocaleString('vi-VN');
};

const PaymentDetailContent = ({ payment }) => {
  if (!payment) return null;

  const paymentStatus =
    PAYMENT_STATUS[payment.status] || {
      label: payment.status,
      className: 'bg-gray-100 text-gray-700'
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-800">

      <div className="space-y-5">

        <div className="bg-slate-50 rounded-xl border border-gray-200 p-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            💳 Thông tin giao dịch
          </h4>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">Phương thức</span>
              <span className="font-semibold">
                {PAYMENT_METHOD[payment.paymentMethod] || '--'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Trạng thái</span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatus.className}`}
              >
                {paymentStatus.label}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Số tiền</span>
              <span className="font-bold text-indigo-600">
                {formatPrice(payment.amount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Transaction Ref</span>
              <span className="font-mono text-xs">
                {payment.transactionRef || '--'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Transaction No</span>
              <span className="font-mono text-xs">
                {payment.transactionNo || '--'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span>{formatDate(payment.createdAt)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Ngày thanh toán</span>
              <span>{formatDate(payment.paidAt)}</span>
            </div>

          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border border-gray-200 p-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            👤 Thông tin khách hàng
          </h4>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">Họ tên</span>
              <span className="font-semibold">
                {payment.order?.receiverName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>
                {payment.order?.user?.email}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Số điện thoại</span>
              <span>
                {payment.order?.phoneNumber}
              </span>
            </div>

            <div className="pt-2 border-t text-sm">
              <span className="text-gray-500">Địa chỉ</span>

              <p className="mt-1">
                {payment.order?.addressLine}, {payment.order?.ward}, {payment.order?.province}
              </p>
            </div>

          </div>
        </div>

      </div>

      <div className="space-y-5">

        <div className="bg-slate-50 rounded-xl border border-gray-200 p-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            📦 Thông tin đơn hàng
          </h4>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">Mã đơn hàng</span>
              <span className="font-mono font-semibold">
                {payment.order?.orderNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái đơn</span>
              <span className="font-semibold">
                {ORDER_STATUS[payment.order?.status] || '--'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Tạm tính</span>
              <span>
                {formatPrice(payment.order?.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span>
                {formatPrice(payment.order?.shippingFee)}
              </span>
            </div>

            <div className="flex justify-between text-rose-600">
              <span>Giảm giá</span>
              <span>
                -{formatPrice(payment.order?.discountAmount)}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between text-base font-bold">
              <span>Tổng thanh toán</span>

              <span className="text-indigo-600">
                {formatPrice(payment.order?.totalAmount)}
              </span>
            </div>

          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border border-gray-200 p-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            🛍️ Sản phẩm
          </h4>

          <div className="space-y-4">

            {payment.order?.items?.map(item => (
              <div
                key={item.id}
                className="flex justify-between border-b border-gray-200 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold">
                    {item.productName}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.color} / Size {item.size}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    SL: {item.quantity}
                  </p>
                </div>

                <div className="font-semibold text-indigo-600">
                  {formatPrice(item.unitPrice)}
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
};

export default PaymentDetailContent;