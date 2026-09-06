import React from 'react';
import Button from '../../../../shared/components/Button';
import ReturnStatus from '../ReturnStatus';

const ReturnList = ({ returns, onDetail, formatPrice }) => {
  if (!returns.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="mb-3 text-2xl">📦</div>
        <p className="font-medium">Bạn chưa có yêu cầu trả hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <th className="px-6 py-4 text-left">Mã yêu cầu</th>
            <th className="px-6 py-4 text-left">Đơn hàng</th>
            <th className="px-6 py-4 text-left">Sản phẩm</th>
            <th className="px-6 py-4 text-right">Tiền hoàn</th>
            <th className="px-6 py-4 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {returns.map(returnRequest => (
            <tr key={returnRequest.id} className="transition-colors hover:bg-slate-50">
              <td className="px-6 py-4">
                <span className="font-semibold text-slate-800">
                  #{returnRequest.id.slice(0, 8)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-medium text-gray-700">
                  {returnRequest.order?.orderNumber}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs space-y-1">
                  {returnRequest.items?.map(item => (
                    <div key={item.id} className="text-xs text-gray-700">
                      {item.orderItem?.productName} × {item.quantity}
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-semibold text-orange-600">
                  {formatPrice(returnRequest.refundAmount)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <ReturnStatus status={returnRequest.status} />
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => onDetail(returnRequest.id)}>
                    Chi tiết
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnList;