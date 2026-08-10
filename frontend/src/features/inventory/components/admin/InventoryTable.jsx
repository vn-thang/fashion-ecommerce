import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const InventoryTable = ({
  transactions = [],
  pagination = {},
  onPageChange,
  onViewDetail
}) => {
  const formatDate = date => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const getTypeBadge = type => {
    switch (type) {
      case 'Import':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            Nhập kho
          </span>
        );

      case 'Adjustment':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            Điều chỉnh
          </span>
        );

      case 'Export':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
            Xuất kho
          </span>
        );

      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50 border-b border-gray-200">

            <tr className="text-left text-sm font-semibold text-gray-700">

              <th className="px-6 py-4">
                Sản phẩm
              </th>

              <th className="px-4 py-4">
                SKU
              </th>

              <th className="px-4 py-4">
                Loại
              </th>

              <th className="px-4 py-4 text-center">
                Số lượng
              </th>

              <th className="px-4 py-4 text-center">
                Tồn sau GD
              </th>

              <th className="px-4 py-4">
                Người thực hiện
              </th>

              <th className="px-4 py-4">
                Thời gian
              </th>

              <th className="px-4 py-4 text-center">
                Thao tác
              </th>

            </tr>

          </thead>

          <tbody>

            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-gray-500"
                >
                  Không có dữ liệu.
                </td>
              </tr>
            )}

            {transactions.map(item => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >

                <td className="px-6 py-4">

                  <div className="font-medium text-gray-800">
                    {item.variant.product.name}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {item.variant.color} • {item.variant.size}
                  </div>

                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {item.variant.sku}
                </td>

                <td className="px-4 py-4">
                  {getTypeBadge(item.type)}
                </td>

                <td className="px-4 py-4 text-center">

                  <span
                    className={`font-semibold ${
                      item.quantity > 0
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {item.quantity > 0 ? '+' : ''}
                    {item.quantity}
                  </span>

                </td>

                <td className="px-4 py-4 text-center font-semibold text-gray-800">
                  {item.balanceAfter}
                </td>

                <td className="px-4 py-4">

                  <div className="text-sm text-gray-800">
                    {item.user.fullName}
                  </div>

                  <div className="text-xs text-gray-500">
                    {item.user.email}
                  </div>

                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {formatDate(item.createdAt)}
                </td>

                <td className="px-4 py-4 text-center">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(item.id)}
                  >
                    Chi tiết
                  </Button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />

    </div>
  );
};

export default InventoryTable;