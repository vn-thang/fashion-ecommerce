import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';
import ReturnStatus from '../ReturnStatus';

const formatPrice = value =>
  Number(value || 0).toLocaleString('vi-VN') + 'đ';

const ReturnTable = ({
  returns = [],
  loading,
  pagination,
  onDetail,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-xs text-gray-500">
        Đang tải danh sách yêu cầu hoàn hàng...
      </div>
    );
  }

  if (returns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="mb-3 text-2xl">📦</div>
        <p className="font-medium">
          Không tìm thấy yêu cầu hoàn hàng nào.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
              <th className="px-6 py-4 text-left">
                Mã yêu cầu
              </th>
              <th className="px-6 py-4 text-left">
                Đơn hàng
              </th>
              <th className="px-6 py-4 text-left">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-right">
                Tiền hoàn
              </th>
              <th className="px-6 py-4 text-center">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {returns.map(item => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-800">
                    #{item.id.slice(0, 8)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-gray-700">
                    {item.order?.orderNumber || '—'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.user?.fullName || '—'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {item.user?.email || '—'}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="max-w-xs space-y-1">
                    {item.items?.map(returnItem => (
                      <div
                        key={returnItem.id}
                        className="text-xs text-gray-700"
                      >
                        {returnItem.orderItem?.productName}
                        {' × '}
                        {returnItem.quantity}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-orange-600">
                    {item.refundAmount
                      ? formatPrice(item.refundAmount)
                      : '—'}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <ReturnStatus status={item.status} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDetail(item.id)}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-100">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReturnTable;