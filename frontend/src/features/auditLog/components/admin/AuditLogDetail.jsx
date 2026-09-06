import React from 'react';

const FIELD_LABELS = {
  quantity: 'Số lượng',
  stockQuantity: 'Số lượng tồn kho',
  isHidden: 'Trạng thái ẩn',
  reply: 'Phản hồi',
  rating: 'Đánh giá',
  comment: 'Nội dung',
  status: 'Trạng thái',
  isActive: 'Trạng thái hoạt động',
  name: 'Tên',
  email: 'Email',
  fullName: 'Họ và tên',
  phoneNumber: 'Số điện thoại',
  price: 'Giá',
  totalAmount: 'Tổng tiền'
};

const formatFieldName = key => {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, char => char.toUpperCase());
};

const formatValue = value => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Có' : 'Không';
  }

  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const parseValues = values => {
  if (values === null || values === undefined) {
    return null;
  }

  if (typeof values === 'string') {
    try {
      return JSON.parse(values);
    } catch {
      return { value: values };
    }
  }

  return values;
};

const ValuesCard = ({ values, type }) => {
  const parsedValues = parseValues(values);

  if (!parsedValues) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-400">
        Không có dữ liệu
      </div>
    );
  }

  if (typeof parsedValues !== 'object' || Array.isArray(parsedValues)) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-slate-700">
        {formatValue(parsedValues)}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      {Object.entries(parsedValues).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0"
        >
          <span className="text-xs font-medium text-gray-500">
            {formatFieldName(key)}
          </span>

          <span
            className={`text-right text-xs font-semibold ${
              type === 'new'
                ? 'text-emerald-600'
                : 'text-slate-700'
            }`}
          >
            {formatValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const AuditLogDetail = ({ detail, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-xs text-gray-500">
        Đang tải chi tiết audit log...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="py-12 text-center text-xs text-gray-500">
        Không có dữ liệu audit log.
      </div>
    );
  }

  const formatDate = value => {
    if (!value) return '—';

    return new Date(value).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Người thực hiện
          </p>

          <p className="mt-1 font-semibold text-slate-800">
            {detail.user?.fullName ||
              detail.user?.email ||
              detail.userId ||
              'Không xác định'}
          </p>

          {detail.user?.email && (
            <p className="mt-1 text-xs text-gray-500">
              {detail.user.email}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Thời gian
          </p>

          <p className="mt-1 font-semibold text-slate-800">
            {formatDate(detail.createdAt)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Hành động
          </p>

          <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {detail.action}
          </span>
        </div>

        <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Đối tượng
          </p>

          <p className="mt-1 font-semibold text-slate-800">
            {detail.entityName || '—'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Entity ID
          </p>

          <p className="mt-1 break-all font-mono text-xs text-slate-600">
            {detail.entityId || '—'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-400" />

            <p className="text-xs font-semibold text-slate-700">
              Giá trị trước thay đổi
            </p>
          </div>

          <ValuesCard
            values={detail.oldValues}
            type="old"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <p className="text-xs font-semibold text-slate-700">
              Giá trị sau thay đổi
            </p>
          </div>

          <ValuesCard
            values={detail.newValues}
            type="new"
          />
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetail;