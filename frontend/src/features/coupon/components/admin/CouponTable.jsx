import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const formatCurrency = amount =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(amount) || 0);

const formatDate = dateStr =>
  dateStr
    ? new Date(dateStr).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '-';

const getStatus = coupon => {
  const now = new Date();
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);

  if (!coupon.isActive) {
    return {
      label: 'Đã tắt',
      className: 'bg-gray-100 text-gray-600'
    };
  }

  if (startDate > now) {
    return {
      label: 'Sắp diễn ra',
      className: 'bg-blue-50 text-blue-600'
    };
  }

  if (endDate < now) {
    return {
      label: 'Đã hết hạn',
      className: 'bg-red-50 text-red-600'
    };
  }

  return {
    label: 'Đang chạy',
    className: 'bg-emerald-50 text-emerald-600'
  };
};

const CouponTable = ({
  coupons = [],
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  if (!coupons.length) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white text-center">
        <div className="mb-3 text-2xl">🎟️</div>
        <h3 className="text-sm font-semibold text-slate-700">
          Chưa có mã giảm giá nào
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Không tìm thấy mã giảm giá phù hợp.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-gray-100 bg-slate-50/70">
            <tr>
              {[
                'Mã code',
                'Mức giảm',
                'Đơn tối thiểu',
                'Lượt dùng',
                'Thời gian',
                'Trạng thái',
                'Hành động'
              ].map(title => (
                <th
                  key={title}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {coupons.map(item => {
              const status = getStatus(item);
            const usedCount = item.usedCount || 0;

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-700">
                      {item.code}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                    {item.discountType === 'PERCENTAGE'
                      ? `${item.discountValue}%`
                      : formatCurrency(item.discountValue)}

                    {item.discountType === 'PERCENTAGE' && (
                      <p className="mt-1 text-xs font-normal text-gray-400">
                        Tối đa {formatCurrency(item.maxDiscountAmount)}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-600">
                    {formatCurrency(item.minOrderAmount)}
                  </td>

                  <td className="px-5 py-4 text-xs">
                   <span className="font-semibold text-slate-700">
                      {usedCount}
                    </span>

                    <span className="text-gray-400">
                      {' / '}
                      {item.usageLimit}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">
                    <p>Từ: {formatDate(item.startDate)}</p>
                    <p className="mt-1">Đến: {formatDate(item.endDate)}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(item)}
                        disabled={!item.isActive}
                      >
                        ✏️ Sửa
                      </Button>

                      {item.isActive && (
                       <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(item)}
                      >
                        ⏸ Tắt
                      </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-100 bg-slate-50/40 px-5 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CouponTable;