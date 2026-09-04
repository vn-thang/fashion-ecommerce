import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Menu,
  ShoppingBag,
  X,
  ChevronDown,
  LockKeyhole,
  LogOut
} from 'lucide-react';

import AdminSidebar from './components/AdminSidebar';
import Button from '../shared/components/Button';
import { useAuth } from '../features/auth/store/authContext';
import NotificationBell from '../features/notification/components/NotificationBell';
import { useSocket } from '../features/chat/context/SocketContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { disconnectSocket } = useSocket();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const accountRef = useRef(null);

  const handleLogout = () => {
    setIsAccountOpen(false);
     disconnectSocket();
    logout();
    navigate('/login');
  };

  const handleGoToStore = () => {
    navigate('/');
  };

  const handleChangePassword = () => {
    setIsAccountOpen(false);
    navigate('/admin/change-password');
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const displayName =
    user?.fullName || user?.username || 'Admin';

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-gray-900">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Mở menu"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-gray-800 sm:text-lg">
                Admin Dashboard
              </h1>

              <p className="truncate text-xs text-gray-500">
                Quản lý hệ thống cửa hàng
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToStore}
              className="hidden sm:flex"
            >
              <ShoppingBag size={16} />
              <span className="hidden md:inline">
                Xem cửa hàng
              </span>
            </Button>

            <NotificationBell />

            <div
              ref={accountRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setIsAccountOpen(prev => !prev)
                }
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                  {displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                    {displayName}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Quản trị viên
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`hidden text-gray-500 transition-transform md:block ${
                    isAccountOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

              {isAccountOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                  role="menu"
                >
              
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    role="menuitem"
                  >
                    <LockKeyhole
                      size={17}
                      className="text-gray-500"
                    />

                    <span>Đổi mật khẩu</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
                    role="menuitem"
                  >
                    <LogOut size={17} />

                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;