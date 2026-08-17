import { Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

import AdminSidebar from './components/AdminSidebar';
import Button from '../shared/components/Button';
import { useAuth } from '../features/auth/store/authContext';
import NotificationBell from '../features/notification/components/NotificationBell';

const AdminLayout = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoToStore = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-gray-900">
      <AdminSidebar />

      <main className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-xs text-gray-500">
              Xin chào,{' '}
              {user?.fullName || user?.username || 'Admin'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToStore}
            >
              <ShoppingBag size={16} />
              Xem cửa hàng
            </Button>

            <NotificationBell />

            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>

          </div>
        </header>

        <div className="flex-1 overflow-x-hidden p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;