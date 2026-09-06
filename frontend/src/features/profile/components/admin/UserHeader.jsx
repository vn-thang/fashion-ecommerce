import React from 'react';

const UserHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-black text-slate-800">
          Quản lý khách hàng
        </h1>

        <p className="text-gray-500 mt-1">
          Quản lý danh sách tài khoản khách hàng trong hệ thống.
        </p>
      </div>
    </div>
  );
};

export default UserHeader;