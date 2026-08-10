import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/store/authContext';

const AccountLayout = () => {
  const { user } = useAuth(); 
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors ${
      isActive 
        ? 'text-[#ee4d2d] font-semibold bg-gray-50' 
        : 'text-gray-600 hover:text-[#ee4d2d] hover:bg-gray-50'
    }`;

  return (
   <div className="w-full flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-60 shrink-0">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold text-lg border border-gray-300 uppercase shadow-sm">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-gray-800 truncate">{user?.fullName || user?.username || 'Tài khoản'}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  ✏️ Sửa hồ sơ
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <NavLink to="/account/profile" className={navLinkClass}>
                <span>👤</span> Hồ sơ của tôi
              </NavLink>
              <NavLink to="/account/addresses" className={navLinkClass}>
                <span>📍</span> Sổ địa chỉ
              </NavLink>
              <NavLink to="/account/orders" className={navLinkClass}>
                <span>📦</span> Đơn mua
              </NavLink>
            </nav>
          </div>

          <div className="flex-1 bg-white p-6 rounded-sm shadow-sm min-h-[500px]">
            <Outlet />
          </div>

        </div>
  );
};

export default AccountLayout;