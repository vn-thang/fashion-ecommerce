import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const paymentMethodMap = {
  COD: 'COD',
  VNPAY: 'VNPAY'
};

const paymentStatusMap = {
  PENDING: {
    label: 'Chờ thanh toán',
    className: 'bg-amber-100 text-amber-700'
  },
  SUCCESS: {
    label: 'Đã thanh toán',
    className: 'bg-emerald-100 text-emerald-700'
  },
  FAILED: {
    label: 'Thất bại',
    className: 'bg-red-100 text-red-700'
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'bg-gray-100 text-gray-700'
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    className: 'bg-sky-100 text-sky-700'
  }
};

const orderStatusMap = {
  PENDING: {
    label: 'Chờ xác nhận',
    className: 'bg-yellow-100 text-yellow-700'
  },
  PROCESSING: {
    label: 'Đang xử lý',
    className: 'bg-indigo-100 text-indigo-700'
  },
  SHIPPING: {
    label: 'Đang giao',
    className: 'bg-blue-100 text-blue-700'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    className: 'bg-green-100 text-green-700'
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'bg-red-100 text-red-700'
  },
  RETURN: {
    label: 'Hoàn trả',
    className: 'bg-orange-100 text-orange-700'
  }
};

const formatPrice = value =>
  Number(value || 0).toLocaleString('vi-VN') + ' đ';

const formatDate = value => {
  if (!value) return '--';
  return new Date(value).toLocaleString('vi-VN');
};

const PaymentTable = ({
  payments,
  meta,
  loading,
  onPageChange,
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[1500px] w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr className="text-xs uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3 text-left">Mã đơn</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">SĐT</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3 text-center">Phương thức</th>
              <th className="px-4 py-3 text-center">TT thanh toán</th>
              <th className="px-4 py-3 text-center">TT đơn hàng</th>
              <th className="px-4 py-3 text-center">Ngày thanh toán</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-12 text-center text-gray-400"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-12 text-center text-gray-400"
                >
                  Không có dữ liệu thanh toán.
                </td>
              </tr>
            ) : (
              payments.map(payment => {
                const paymentStatus =
                  paymentStatusMap[payment.status] || {
                    label: payment.status,
                    className: 'bg-gray-100 text-gray-700'
                  };

                const orderStatus =
                  orderStatusMap[payment.order?.status] || {
                    label: payment.order?.status || '--',
                    className: 'bg-gray-100 text-gray-700'
                  };

                return (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">
                        {payment.order?.orderNumber}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">
                          {payment.order?.receiverName}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-gray-600">
                      {payment.order?.user?.email}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {payment.order?.phoneNumber}
                    </td>

                    <td className="px-4 py-4 text-right font-semibold text-indigo-600">
                      {formatPrice(payment.order?.totalAmount)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="font-medium">
                        {paymentMethodMap[payment.paymentMethod]}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${paymentStatus.className}`}
                      >
                        {paymentStatus.label}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${orderStatus.className}`}
                      >
                        {orderStatus.label}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center text-sm text-gray-600">
                      {formatDate(payment.paidAt)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(payment.id)}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PaymentTable;