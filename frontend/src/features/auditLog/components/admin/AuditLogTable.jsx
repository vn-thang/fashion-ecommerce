import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const ACTION_CONFIG = {
  CREATE: {
    label: 'Tạo mới',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  UPDATE: {
    label: 'Cập nhật',
    className: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  },
  DELETE: {
    label: 'Xóa',
    className: 'bg-rose-50 text-rose-600 border-rose-200'
  },
  ACTIVATE: {
    label: 'Kích hoạt',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  DEACTIVATE: {
    label: 'Vô hiệu hóa',
    className: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  IMPORT: {
    label: 'Nhập kho',
    className: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  ADJUST: {
    label: 'Điều chỉnh',
    className: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  ADJUST_STOCK: {
    label: 'Điều chỉnh kho',
    className: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  REPLY_REVIEW: {
    label: 'Trả lời đánh giá',
    className: 'bg-sky-50 text-sky-600 border-sky-200'
  },
  HIDE_REVIEW: {
    label: 'Ẩn đánh giá',
    className: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  RESTORE_REVIEW: {
    label: 'Hiện đánh giá',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  }
};

const ENTITY_LABELS = {
  User: 'Người dùng',
  Product: 'Sản phẩm',
  ProductVariant: 'Biến thể sản phẩm',
  Brand: 'Thương hiệu',
  Category: 'Danh mục',
  Order: 'Đơn hàng',
  Review: 'Đánh giá',
  InventoryTransaction: 'Giao dịch kho',
  Coupon: 'Mã giảm giá',
  FlashSale: 'Flash Sale'
};

const getActionConfig = action => {
  return ACTION_CONFIG[action] || {
    label: action || 'Không xác định',
    className: 'bg-slate-100 text-slate-600 border-slate-200'
  };
};

const getEntityLabel = entityName => {
  return ENTITY_LABELS[entityName] || entityName || '—';
};

const getInitial = user => {
  const name = user?.fullName || user?.email;

  if (!name) return '?';

  return name.charAt(0).toUpperCase();
};

const formatDate = value => {
  if (!value) return '—';

  const date = new Date(value);

  return (
    <div>
      <p className="whitespace-nowrap text-sm font-medium text-slate-700">
        {date.toLocaleDateString('vi-VN')}
      </p>
      <p className="mt-0.5 whitespace-nowrap text-xs text-gray-400">
        {date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  );
};

const AuditLogTable = ({
  auditLogs = [],
  loading,
  pagination,
  onViewDetail,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-center py-16 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Đang tải danh sách audit log...
          </div>
        </div>
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
            📋
          </div>
          <p className="font-semibold text-slate-600">
            Không tìm thấy audit log
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="w-16 px-5 py-4 text-center">
                #
              </th>
              <th className="px-5 py-4 text-left">
                Thời gian
              </th>
              <th className="px-5 py-4 text-left">
                Người thực hiện
              </th>
              <th className="px-5 py-4 text-center">
                Hành động
              </th>
              <th className="px-5 py-4 text-left">
                Đối tượng
              </th>
              <th className="px-5 py-4 text-left">
                Entity ID
              </th>
              <th className="w-32 px-5 py-4 text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {auditLogs.map((log, index) => {
              const action = getActionConfig(log.action);
              const userName =
                log.user?.fullName ||
                log.user?.email ||
                'Không xác định';

              const rowNumber =
                (pagination.currentPage - 1) * pagination.limit +
                index +
                1;

              return (
                <tr
                  key={log.id}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4 text-center text-xs font-medium text-gray-400">
                    {rowNumber}
                  </td>

                  <td className="px-5 py-4">
                    {formatDate(log.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                        {getInitial(log.user)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {userName}
                        </p>

                        {log.user?.email && (
                          <p className="mt-0.5 max-w-[180px] truncate text-xs text-gray-400">
                            {log.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${action.className}`}
                    >
                      {action.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                      {getEntityLabel(log.entityName)}
                    </span>
                  </td>

                  <td className="max-w-[220px] px-5 py-4">
                    <span
                      className="block max-w-[220px] truncate rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-gray-500"
                      title={log.entityId || ''}
                    >
                      {log.entityId || '—'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(log.id)}
                      className="group-hover:border-indigo-200 group-hover:text-indigo-600"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              );
            })}
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

export default AuditLogTable;