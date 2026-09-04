import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/store/authContext';
import { categoryApi } from '../../features/category/api/categoryApi';
import { useCart } from '../../features/cart/hooks/CartContext';
import { storeSettingApi } from '../../features/storeSetting/api/storeSettingApi';
import SearchBox from '../../features/search/components/SearchBox';
import NotificationBell from '../../features/notification/components/NotificationBell';
import { useSocket } from '../../features/chat/context/SocketContext';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { disconnectSocket } = useSocket();
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [store, setStore] = useState({
  storeName: 'FashionHub',
  logoUrl: ''});

  useEffect(() => {
  const fetchStore = async () => {
    try {
      const res = await storeSettingApi.get();
      const data = res.data || res;

      setStore({
        storeName: data.storeName,
        logoUrl: data.logoUrl
      });
    } catch (error) {
      console.error(error);
    }
  };

  fetchStore();
}, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        const rawData = res?.data || res;
        let safeCategories = [];
        if (Array.isArray(rawData)) {
          safeCategories = rawData;
        } else if (Array.isArray(rawData?.categories)) {
          safeCategories = rawData.categories;
        } else if (Array.isArray(rawData?.data)) {
          safeCategories = rawData.data;
        } else if (Array.isArray(rawData?.metadata)) {
          safeCategories = rawData.metadata;
        }

        setCategories(safeCategories);
      } catch (error) {
        console.error('Lỗi khi tải danh mục tại Header:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => { 
     disconnectSocket(); 
    logout();
    navigate('/login');
  };
 return (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-150 shadow-sm">
    <div className="w-[95%] max-w-[1600px] mx-auto py-3 md:py-4">
      <div className="flex flex-wrap items-center justify-between gap-3 md:flex-nowrap md:gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3 shrink-0"
        >
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.storeName}
              className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-100 border border-gray-200 text-xl md:text-2xl">
              🛍️
            </div>
          )}

          <div>
            <h1 className="text-base md:text-2xl font-extrabold text-[#ee4d2d]">
              {store.storeName}
            </h1>

            <p className="hidden sm:block text-xs text-gray-500">
              Official Store
            </p>
          </div>
        </Link>
        <div className="order-3 w-full md:order-none md:flex-1 md:max-w-4xl">
          <SearchBox />
        </div>
        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <Link
            to="/cart"
            className="relative flex items-center group"
          >
            <span className="text-2xl md:text-3xl text-gray-700 group-hover:text-[#ee4d2d] transition-colors">
              🛒
            </span>

            {cart?.totalItems > 0 && (
              <span className="absolute -right-2 -top-1 flex items-center justify-center w-5 h-5 text-[10px] md:text-[11px] font-bold text-white bg-[#ee4d2d] border-2 border-white rounded-full">
                {cart.totalItems > 99 ? "99+" : cart.totalItems}
              </span>
            )}
          </Link>

          {user && <NotificationBell />}
          {user ? (
  <div className="relative">
    <button
      type="button"
      onClick={() => setIsUserMenuOpen(prev => !prev)}
      className="flex cursor-pointer items-center gap-2"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
        {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
      </div>

      <span className="hidden max-w-[150px] truncate text-sm font-medium text-gray-700 md:inline">
        {user.fullName || user.username}
      </span>
    </button>

    {isUserMenuOpen && (
      <div className="absolute right-0 top-full z-50 w-48 pt-2">
        <div className="flex flex-col rounded-md border border-gray-100 bg-white py-1 text-gray-700 shadow-lg">
          <Link
            to="/account/profile"
            onClick={() => setIsUserMenuOpen(false)}
            className="px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#ee4d2d]"
          >
            Tài khoản của tôi
          </Link>

          <Link
            to="/account/orders"
            onClick={() => setIsUserMenuOpen(false)}
            className="px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#ee4d2d]"
          >
            Đơn mua
          </Link>

          {user.role === 'Admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsUserMenuOpen(false)}
              className="border-t border-gray-100 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Trang quản trị
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 hover:text-[#ee4d2d]"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    )}
  </div>
) : (
  <div className="flex items-center gap-2 md:gap-3">
    <Link
      to="/register"
      className="hidden text-sm font-medium text-gray-600 hover:text-[#ee4d2d] sm:block"
    >
      Đăng ký
    </Link>

    <span className="hidden h-4 w-px bg-gray-300 sm:block" />

    <Link
      to="/login"
      className="rounded-sm bg-[#ee4d2d] px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#d74123] md:px-4 md:text-sm"
    >
      Đăng nhập
    </Link>
  </div>
)}
        </div>
      </div>
    </div>
    <div className="bg-[#D5A6A6] text-white">
      <div className="w-[95%] max-w-[1600px] mx-auto flex items-center">
        <div
          className="relative shrink-0"
          onMouseEnter={() => setIsCategoryOpen(true)}
          onMouseLeave={() => setIsCategoryOpen(false)}
        >
          <div className="flex items-center gap-2 md:gap-3 w-auto md:w-64 px-3 md:px-6 py-3 md:py-3.5 bg-[#C28D8D] cursor-pointer font-semibold hover:bg-[#B98282] transition-colors">
            <span className="text-lg md:text-xl">☰</span>

            <span className="text-xs md:text-sm uppercase tracking-wide whitespace-nowrap">
              Danh Mục
              <span className="hidden sm:inline"> Sản Phẩm</span>
            </span>
          </div>
          {isCategoryOpen && (
            <div className="absolute left-0 top-full z-50 w-64 max-w-[90vw] bg-white text-gray-800 border-x border-b border-gray-100 rounded-b-sm shadow-xl">

              <ul className="flex flex-col py-1 max-h-[450px] overflow-y-auto custom-scrollbar">

                {categories.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-400 text-center italic">
                    Đang tải danh mục...
                  </li>
                ) : (
                  categories
                    .filter(category => !category.parentId)
                    .map(parent => {
                      const parentId = parent._id || parent.id;

                      const childs = categories.filter(
                        category => category.parentId === parentId
                      );

                      return (
                        <li
                          key={parentId}
                          className="relative group border-b border-gray-50 last:border-none"
                        >

                          <Link
                            to={`/products?category=${parentId}`}
                            onClick={() => setIsCategoryOpen(false)}
                            className="flex items-center justify-between gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ee4d2d]"
                          >
                            <span className="flex items-center gap-2 truncate">
                              📁 {parent.name}
                            </span>

                            {childs.length > 0 && (
                              <svg
                                className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-[#ee4d2d]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            )}
                          </Link>
                          {childs.length > 0 && (
                            <div className="absolute left-full top-0 hidden w-64 h-full pl-2 group-hover:block z-[60]">

                              <div className="h-full py-1 bg-white border border-gray-100 shadow-2xl">

                                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                  Nhóm {parent.name}
                                </div>

                                <ul className="flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">

                                  {childs.map(child => (
                                    <li key={child._id || child.id}>
                                      <Link
                                        to={`/products?category=${child._id || child.id}`}
                                        onClick={() => setIsCategoryOpen(false)}
                                        className="block px-5 py-2.5 text-sm text-gray-600 border-l-2 border-transparent hover:border-[#ee4d2d] hover:bg-gray-50 hover:text-[#ee4d2d]"
                                      >
                                        {child.name}
                                      </Link>
                                    </li>
                                  ))}

                                </ul>
                              </div>
                            </div>
                          )}

                        </li>
                      );
                    })
                )}

              </ul>
            </div>
          )}
        </div>
  <nav className="ml-4 flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide font-medium text-[11px] uppercase tracking-wide md:ml-8 md:gap-10 md:text-[13px]">

          <Link
            to="/"
            className="shrink-0 hover:text-white/80 transition-colors"
          >
            Trang chủ
          </Link>

          <Link
            to="/products"
            className="shrink-0 hover:text-white/80 transition-colors"
          >
            Sản phẩm
          </Link>

          <Link
            to="/flashSales"
            className="shrink-0 hover:text-white/80 transition-colors"
          >
            ⚡ Flash Sale
          </Link>

        </nav>
      </div>
    </div>
  </header>
);
};

export default CustomerHeader;