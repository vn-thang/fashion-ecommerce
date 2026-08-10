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
  PENDING: {
    label: '⏳ Chờ xác nhận',
    className: 'bg-amber-100 text-amber-700'
  },
  PROCESSING: {
    label: '📦 Đang xử lý',
    className: 'bg-blue-100 text-blue-700'
  },
  SHIPPING: {
    label: '🚚 Đang giao hàng',
    className: 'bg-indigo-100 text-indigo-700'
  },
  COMPLETED: {
    label: '✅ Hoàn thành',
    className: 'bg-emerald-100 text-emerald-700'
  },
  CANCELLED: {
    label: '❌ Đã hủy',
    className: 'bg-red-100 text-red-700'
  },
  RETURN: {
    label: '↩️ Hoàn trả',
    className: 'bg-violet-100 text-violet-700'
  }
};

const OrderDetailContent = ({ order, onUpdateStatus, onOpenCancel }) => {
  if (!order) return null;

  const payment = order.payment || {};

const paymentMethod =
  PAYMENT_METHOD[payment.paymentMethod] || 'Chưa xác định';

const paymentStatus =
  PAYMENT_STATUS[payment.status] || {
    label: 'Chưa xác định',
    className: 'bg-gray-100 text-gray-700'
  };

  const orderStatus =
  ORDER_STATUS[order.status] || {
    label: 'Không xác định',
    className: 'bg-gray-100 text-gray-700'
  };

  return (
     <div className="space-y-5 text-slate-800">

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
  <div className="flex flex-wrap items-center justify-between gap-3">

    <div>
      <p className="text-xs uppercase text-gray-400 font-semibold">
        Mã đơn hàng
      </p>
      <p className="font-mono font-semibold text-slate-800">
        {order.orderNumber}
      </p>
    </div>

    <div className="text-right">
      <p className="text-xs uppercase text-gray-400 font-semibold mb-1">
        Trạng thái đơn
      </p>

      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderStatus.className}`}
      >
        {orderStatus.label}
      </span>
    </div>

  </div>
</div>
      <div className="space-y-5">
        <div className="bg-slate-50 p-4 rounded-xl border border-gray-150">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">📦 Sản phẩm đặt mua</h4>
          <div className="divide-y divide-gray-200">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-lg">👕</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Phân loại: <span className="font-semibold text-gray-700">{item.color || 'N/A'}</span> / Size <span className="font-semibold text-gray-700">{item.size || 'N/A'}</span>
                  </p>
                </div>
              <div className="text-right flex-shrink-0">
                {Number(item.originalPrice) > Number(item.unitPrice) ? (
                  <>
                    <p className="text-xs text-gray-400 line-through">
                      {Number(item.originalPrice).toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-sm font-bold text-red-500">
                      {Number(item.unitPrice).toLocaleString('vi-VN')}đ
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold">
                    {Number(item.unitPrice).toLocaleString('vi-VN')}đ
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  SL: x{item.quantity}
                </p>
              </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-gray-150 space-y-2">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">📍 Địa chỉ nhận hàng</h4>
          <p className="text-sm"><span className="font-semibold text-gray-500">Người nhận:</span> {order.receiverName}</p>
          <p className="text-sm"><span className="font-semibold text-gray-500">Số điện thoại:</span> {order.phoneNumber}</p>
          <p className="text-sm"><span className="font-semibold text-gray-500">Địa chỉ detail:</span> {order.addressLine}, {order.ward}, {order.province}</p>
          {order.note && (
            <p className="text-sm bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-800 mt-2 text-xs">
              📌 <strong>Khách chú thích:</strong> {order.note}
            </p>
          )}
        </div>

        <div className="space-y-3">
  <label className="block text-xs font-semibold text-gray-400">
    Chuyển trạng thái đơn:
  </label>

  <select
    className="w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    value={order.status}
    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
  >
    <option value="PENDING">⏳ Chờ xác nhận</option>
    <option value="PROCESSING">📦 Đang xử lý</option>
    <option value="SHIPPING">🚚 Đang giao</option>
    <option value="COMPLETED">✅ Hoàn thành</option>
    <option value="RETURN">↩️ Hoàn trả</option>
  </select>

  {order.status !== 'COMPLETED' &&
    order.status !== 'CANCELLED' &&
    order.status !== 'RETURN' && (
      <button
        type="button"
        onClick={onOpenCancel}
        className="
          flex w-full items-center justify-center gap-2
          rounded-lg border border-red-200
          bg-red-50 px-4 py-2.5
          text-sm font-semibold text-red-600
          transition-all
          hover:bg-red-600
          hover:text-white
          hover:border-red-600
        "
      >
        <span>🗑️</span>
        <span>Hủy đơn hàng</span>
      </button>
    )}
</div>
      </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-gray-150 space-y-2.5">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">🧾 Tóm tắt tài chính</h4>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tạm tính sản phẩm:</span>
            <span>{Number(order.subtotal).toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Phí giao hàng:</span>
            <span>+{Number(order.shippingFee).toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-sm text-rose-600">
            <span>Mã giảm giá ({order.couponCode || 'Không áp dụng'}):</span>
            <span>-{Number(order.discountAmount).toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-slate-900 text-base">
            <span>Tổng thanh toán:</span>
            <span className="text-indigo-600">{Number(order.totalAmount).toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phương thức thanh toán:</span>
            <span className="font-semibold">
              {paymentMethod}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Trạng thái thanh toán:</span>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentStatus.className}`}
            >
              {paymentStatus.label}
            </span>
          </div>

{order.status === 'CANCELLED' && (
  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
    <h5 className="font-semibold text-red-700 flex items-center gap-2">
      ❌ Thông tin hủy đơn
    </h5>

    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Người hủy</span>
      <span className="font-medium">
        {order.cancelledBy === 'CUSTOMER'
          ? 'Khách hàng'
          : order.cancelledBy === 'ADMIN'
          ? 'Quản trị viên'
          : order.cancelledBy || 'Không xác định'}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Thời gian hủy</span>
      <span className="font-medium">
        {order.cancelledAt
          ? new Date(order.cancelledAt).toLocaleString('vi-VN')
          : '--'}
      </span>
    </div>

    <div className="text-sm">
      <p className="text-gray-500 mb-1">Lý do hủy</p>

      <div className="rounded-md bg-white border border-red-100 p-3 text-gray-700">
        {order.cancelReason || 'Không có lý do'}
      </div>
    </div>
  </div>
)}

          <div className="border-t border-gray-200 pt-3 space-y-1 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Mã đơn hàng</span>
            <span className="font-mono">{order.orderNumber}</span>
          </div>

          {payment.paidAt && (
            <div className="flex justify-between">
              <span>Thời gian thanh toán</span>
              <span>
                {new Date(payment.paidAt).toLocaleString('vi-VN')}
              </span>
            </div>
          )}
        </div>
        </div>

      </div>
  );
};

export default OrderDetailContent;