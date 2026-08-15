import React from 'react';

const AuditLogHeader = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Nhật ký hoạt động
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Theo dõi và tra cứu các thao tác quan trọng được thực hiện trong hệ thống.
        </p>
      </div>
    </div>
  );
};

export default AuditLogHeader;