import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/store/authContext';

const AdminSidebar = () => {
const location = useLocation();
const { user } = useAuth();
const [openMenu, setOpenMenu] = useState('settings');

const menuItems = [
{
title: 'Tổng quan',
path: '/admin/dashboard',
icon: '📊',
},
 {
    title: 'Hỗ trợ khách hàng',
    path: '/admin/chat',
    icon: '💬'
  },
{
title: 'Quản lý Danh mục',
path: '/admin/categories',
icon: '📁',
},
{
title: 'Quản lý Thương hiệu',
path: '/admin/brands',
icon: '⭐',
},
{
title: 'Quản lý Sản phẩm',
path: '/admin/products',
icon: '📦',
},
 {
    title: 'Giảm giá & KM',
    icon: '🏷️',
    children: [
      {
        title: 'Mã giảm giá',
        path: '/admin/coupons'
      },
      {
        title: 'Flash Sale',
        path: '/admin/flashSales'
      }
    ]
  },
{
  title: 'Quản lý bán hàng',
  icon: '🧾',
  children: [
    {
      title: 'Đơn hàng',
      path: '/admin/sales/orders'
    },
    {
      title: 'Thanh toán',
      path: '/admin/sales/payments'
    }
  ]
},

{
  title: 'Quản lý kho',
  path: '/admin/inventory',
  icon: '🏬'
},

{
  title: 'Quản lý người dùng',
  path: '/admin/users',
  icon: '👥'
},

{
title: 'Quản lý đánh giá',
path: '/admin/reviews',
    icon: '⭐',
},
{
  title: 'Nhật ký hệ thống',
  path: '/admin/audit-logs',
  icon: '📋'
},
 {
    title: 'Cài đặt',
    icon: '⚙️',
    children: [
      {
        title: 'Thông tin cửa hàng',
        path: '/admin/settings/store'
      },
      {
        title: 'Banner',
        path: '/admin/settings/banners'
      }
    ]
  }
];

return ( <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-[#1e2738] text-gray-300 shadow-xl">
<div className="flex items-center gap-4 border-b border-gray-700/50 p-6"> <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-md ring-2 ring-indigo-500/30">
{(user?.fullName || user?.username || 'A')
.charAt(0)
.toUpperCase()} </div>

    <div>
      <h3 className="text-sm font-bold tracking-wide text-white">
        {user?.fullName || user?.username || 'Admin'}
      </h3>

      <div className="mt-1 flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
        </span>

        <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
          Đang hoạt động
        </span>
      </div>
    </div>
  </div>
  <nav className="custom-scrollbar flex-1 overflow-y-auto py-6">
    <ul className="space-y-1.5 px-3">
     {menuItems.map((item) => {
  if (item.children) {
    const isOpen = openMenu === item.title;

    const hasActiveChild = item.children.some(child =>
      location.pathname.startsWith(child.path)
    );

    return (
      <li key={item.title}>
        <button
          onClick={() =>
            setOpenMenu(isOpen ? '' : item.title)
          }
        className={`group w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 ${
            hasActiveChild
              ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{item.icon}</span>
            {item.title}
          </div>

         <div
  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300
  ${
    hasActiveChild
      ? 'bg-indigo-500/15 text-indigo-400'
      : 'text-gray-500 group-hover:text-gray-300'
  }`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-4 h-4 transition-transform duration-300 ${
      isOpen ? 'rotate-180' : ''
    }`}
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
</div>
        </button>

        {isOpen && (
         <ul className="relative ml-6 mt-2 space-y-1 border-l border-gray-700 pl-4">
            {item.children.map(child => {
              const active =
                location.pathname === child.path;

              return (
                <li key={child.path}>
                  <Link
                    to={child.path}
                    className={`relative flex items-center rounded-lg px-4 py-2 text-sm transition-all duration-200 before:absolute before:-left-[21px] before:top-1/2 before:h-px before:w-3 before:bg-gray-700 ${
                      active
                      ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {child.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  const isActive =
    location.pathname === item.path ||
    location.pathname.startsWith(item.path + '/');

  return (
    <li key={item.path}>
      <Link
        to={item.path}
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-sm'
            : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        }`}
      >
        <span
          className={`text-xl ${
            isActive ? 'scale-110' : ''
          }`}
        >
          {item.icon}
        </span>

        {item.title}
      </Link>
    </li>
  );
})}
    </ul>
  </nav>
</aside>

);
};

export default AdminSidebar;
