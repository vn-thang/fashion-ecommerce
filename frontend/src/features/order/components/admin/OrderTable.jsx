import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const getStatusBadge = (status) => {
  const configs = {
    PENDING: 'bg-amber-50 border-amber-200 text-amber-700',
    PROCESSING: 'bg-blue-50 border-blue-200 text-blue-700', 
    SHIPPING: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    COMPLETED: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    CANCELLED: 'bg-rose-50 border-rose-200 text-rose-700',
    RETURN: 'bg-purple-50 border-purple-200 text-purple-700'
  };
  return configs[status] || 'bg-gray-50 border-gray-200 text-gray-700';
};

const getPaymentBadge = (status) => {
  return status === 'COMPLETED'
    ? 'bg-emerald-100 text-emerald-800'
    : 'bg-slate-100 text-slate-600';
};

const OrderTable = ({ orders, meta, onPageChange, onViewDetails, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-20 text-center shadow-sm">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Đang nạp danh sách dữ liệu vận đơn điện tử...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-16 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl border">📦</div>
        <h3 className="text-base font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Hệ thống không tìm thấy hóa đơn nào khớp với bộ lọc hiện tại của bạn.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50/70 border-b border-gray-200/60">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Mã Đơn Hàng</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Người Nhận & SĐT</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Ngày Đặt Hàng</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Tổng Tiền COD</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Trạng Thái Đơn</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">Thanh Toán</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider w-[10%]">Chi Tiết</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-150">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/40 transition-colors duration-150 group">
                <td className="px-6 py-4.5 font-mono text-xs font-bold text-indigo-600">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4.5">
                  <div className="text-xs font-semibold text-slate-800">{order.receiverName}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{order.phoneNumber}</div>
                </td>
                <td className="px-6 py-4.5 text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4.5 font-bold text-slate-900 text-xs">
                  {Number(order.totalAmount).toLocaleString('vi-VN')} đ
                </td>
                <td className="px-6 py-4.5">
                  <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-bold border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4.5">
                  <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md font-bold ${getPaymentBadge(order.payment?.status)}`}>
                    {order.payment?.status || 'PENDING'}
                  </span>
                </td>
                <td className="px-6 py-4.5 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 px-3"
                    onClick={() => onViewDetails(order.id)}
                  >
                    🔍 Xem
                  </Button>
                </td>
              </tr>
            ))}
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

export default OrderTable;