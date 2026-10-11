import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/store/authContext';
import { MapPin, PackageCheck, RotateCcw, UserRound } from 'lucide-react';

const AccountLayout = () => {
  const { user } = useAuth();
  const navLinkClass = ({ isActive }) =>
    `flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3.5 py-3 text-sm font-medium transition-colors md:w-full ${
      isActive
        ? 'bg-white text-[#c64b35] shadow-sm ring-1 ring-inset ring-[#f1ddd6]'
        : 'text-slate-600 hover:bg-white/70 hover:text-[#c64b35]'
    }`;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-[256px_minmax(0,1fr)] md:gap-6 lg:gap-8">
      <aside className="h-fit overflow-hidden rounded-2xl border border-[#eadfdc] bg-[#fbf8f7] p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-white px-3 py-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-12 w-12 shrink-0 rounded-full border border-[#f1e5e1] object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8e5df] text-base font-semibold uppercase text-[#a94431] ring-1 ring-inset ring-[#f1d8cf]">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.fullName || user?.username || 'Tài khoản'}
            </p>
            <NavLink
              to="/account/profile"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-[#c64b35]"
            >
              Chỉnh sửa hồ sơ
            </NavLink>
          </div>
        </div>

        <p className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Tài khoản
        </p>
        <nav
          aria-label="Điều hướng tài khoản"
          className="flex gap-1 overflow-x-auto px-1 pb-1 md:flex-col"
        >
          <NavLink to="/account/profile" className={navLinkClass}>
            <UserRound size={17} strokeWidth={1.8} />
            <span>Hồ sơ của tôi</span>
          </NavLink>
          <NavLink to="/account/addresses" className={navLinkClass}>
            <MapPin size={17} strokeWidth={1.8} />
            <span>Địa chỉ</span>
          </NavLink>
          <NavLink to="/account/orders" className={navLinkClass}>
            <PackageCheck size={17} strokeWidth={1.8} />
            <span>Đơn mua</span>
          </NavLink>
          <NavLink to="/account/returns" className={navLinkClass}>
            <RotateCcw size={17} strokeWidth={1.8} />
            <span>Đổi trả hàng</span>
          </NavLink>
        </nav>
      </aside>

      <section className="min-h-[500px] min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
        <Outlet />
      </section>
    </div>
  );
};

export default AccountLayout;