import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';
import FlashSaleStatusBadge from './FlashSaleStatusBadge';

const FlashSaleTable = ({
  flashSales,
  currentPage,
  totalPages,
  onPageChange,
  onDisable,
  onEdit,
  onManageVariants
}) => {

  if (!flashSales.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <h3 className="text-sm font-semibold text-slate-700">
          Chưa có chương trình Flash Sale nào
        </h3>
        <p className="text-xs text-gray-500 mt-2">
          Hãy tạo Flash Sale đầu tiên.
        </p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs uppercase font-bold text-gray-500">
                Chương trình
              </th>
              <th className="px-6 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Thời gian
              </th>
              <th className="px-6 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-xs uppercase font-bold text-gray-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {flashSales.map(item => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition">
                <td className="px-6 py-5">
                  <div className="font-semibold text-slate-800">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {item.id.slice(0,8)}...
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="text-xs">
                    <div>
                      {new Date(item.startDate).toLocaleString('vi-VN')}
                    </div>
                    <div className="text-gray-400 mt-1">
                      ↓
                    </div>
                    <div>
                      {new Date(item.endDate).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="font-semibold text-indigo-600">
                    {item._count?.flashSaleVariants || 0}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <FlashSaleStatusBadge
                    status={item.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                     <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onManageVariants(item)}
                    >
                      Sản phẩm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}>
                      Sửa
                    </Button>
                    {item.status !== 'Đã tắt' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDisable(item.id)}>
                        Tắt
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="border-t border-gray-200 p-5 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}/>
        </div>
      )}
    </div>
  );
};

export default FlashSaleTable;