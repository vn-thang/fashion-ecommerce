import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/store/authContext';
import { categoryApi } from '../../features/category/api/categoryApi';
import { useCart } from '../../features/cart/hooks/CartContext';
import { storeSettingApi } from '../../features/storeSetting/api/storeSettingApi';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);

const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [store, setStore] = useState({
  storeName: 'FashionHub',
  logoUrl: ''});

  useEffect(() => {
    setKeyword(searchParams.get('search') || '');
  }, [searchParams]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("👉 HEADER: Đã bấm tìm kiếm! Từ khóa đang gõ là:", keyword);
    
    if (keyword.trim()) {
      const searchUrl = `/products?search=${encodeURIComponent(keyword.trim())}`;
      console.log("👉 HEADER: Đang chuyển hướng sang URL:", searchUrl);
      
      navigate(searchUrl); 
    } else {
      console.log("👉 HEADER: Từ khóa rỗng, đẩy về trang products gốc.");
      navigate('/products');
    }
  };

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
    logout();
    navigate('/login');
  };


  return (
    <header className="bg-white border-b border-gray-150 sticky top-0 z-50 shadow-sm">
      <div className="w-[95%] max-w-[1600px] mx-auto flex items-center justify-between gap-8 py-4">
      <Link
  to="/"
  className="flex items-center gap-3"
>
  {store.logoUrl ? (
  <img
    src={store.logoUrl}
    alt={store.storeName}
    className="w-14 h-14 rounded-full object-cover border border-gray-200"
  />
) : (
  <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl">
    🛍️
  </div>
)}

  <div>
      <h1 className="text-2xl font-extrabold text-[#ee4d2d]">
          {store.storeName}
      </h1>

      <p className="text-xs text-gray-500">
          Official Store
      </p>
  </div>
</Link>
        <div className="flex-1 max-w-4xl">
        <form onSubmit={handleSearchSubmit} className="flex h-11 w-full items-center rounded-sm border-2 border-[#ee4d2d] bg-white overflow-hidden shadow-sm">
        <input
          type="text"
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)} 
          placeholder="Tìm kiếm áo thun, quần jean, voucher giảm 50%..."
          className="h-full flex-1 bg-transparent px-4 text-sm text-gray-700 outline-none"
        />
        <button
          type="submit"
          className="flex h-full px-8 items-center justify-center bg-[#ee4d2d] text-white hover:bg-[#d74123] transition-colors font-medium"
        >
          Tìm Kiếm
        </button>
      </form>
        </div>
        <div className="flex items-center gap-8 shrink-0">
          <Link to="/cart" className="relative cursor-pointer group flex items-center">
        <span className="text-3xl text-gray-700 group-hover:text-[#ee4d2d] transition-colors">🛒</span>
        
        {cart?.totalItems > 0 && (
          <span className="absolute -right-2 -top-1 flex h-5 w-6 items-center justify-center rounded-full border-2 border-white bg-[#ee4d2d] text-[11px] font-bold text-white">
            {cart.totalItems > 99 ? '99+' : cart.totalItems}
          </span>
        )}
      </Link>

{user ? (
  <div className="group relative flex cursor-pointer items-center gap-2 pb-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">
      {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-[#ee4d2d] transition-colors">
      {user.fullName || user.username}
    </span>
    <div className="absolute right-0 top-full z-50 hidden pt-2 group-hover:block">
      <div className="flex w-48 flex-col rounded-md bg-white py-1 text-gray-700 shadow-lg border border-gray-100">
        <Link to="/account/profile" className="px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#ee4d2d]">
          Tài khoản của tôi
        </Link>
        
        <Link to="/account/orders" className="px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#ee4d2d]">
          Đơn mua
        </Link>
        
        <button onClick={handleLogout} className="text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#ee4d2d]">
          Đăng xuất
        </button>
      </div>

    </div>
  </div>
) : (
  <div className="flex items-center gap-3">
    <Link to="/register" className="text-sm font-medium text-gray-600 hover:text-[#ee4d2d] transition-colors">Đăng ký</Link>
    <span className="h-4 w-[1px] bg-gray-300"></span>
    <Link to="/login" className="rounded-sm bg-[#ee4d2d] px-4 py-2 text-sm font-medium text-white hover:bg-[#d74123] transition-colors shadow-sm">Đăng nhập</Link>
  </div>
)}
        </div>
      </div>
      <div className="bg-[#ee4d2d] text-white">
        <div className="w-[95%] max-w-[1600px] px-4 mx-auto flex items-center">
          
          <div 
            className="relative"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <div className="flex items-center gap-3 bg-[#d74123] px-6 py-3.5 font-semibold cursor-pointer w-64">
              <span className="text-xl">☰</span> 
              <span className="uppercase text-sm tracking-wide">Danh Mục Sản Phẩm</span>
            </div>
            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl border-x border-b border-gray-100 z-50 text-gray-800 rounded-b-sm">
                
                <ul className="flex flex-col py-1 max-h-[450px] overflow-y-auto custom-scrollbar">
                  {categories.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-gray-400 italic text-center">
                      Đang tải danh mục...
                    </li>
                  ) : (
                    categories
                      .filter((c) => !c.parentId)
                      .map((parent) => {
                        const parentId = parent._id || parent.id;
                        const childs = categories.filter((c) => c.parentId === parentId);

                        return (
                          <li 
                            key={parentId} 
                            className="group border-b border-gray-50 last:border-none block w-full"
                          >
                            <Link 
                              to={`/products?category=${parentId}`}
                              onClick={() => setIsCategoryOpen(false)}
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 hover:text-[#ee4d2d] transition-colors text-sm font-normal text-gray-700"
                            >
                              <span className="flex items-center gap-2 truncate">
                                📁 {parent.name}
                              </span>
                              
                              {childs.length > 0 && (
                                <svg 
                                  className="w-3 h-3 text-gray-400 group-hover:text-[#ee4d2d] group-hover:translate-x-1 transition-all duration-300" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </Link>
                            {childs.length > 0 && (
                              <div className="absolute left-full top-0 hidden group-hover:block w-64 h-full z-[60] -ml-6 pl-6">
                            
                                <div className="bg-white shadow-2xl border-y border-r border-gray-100 h-full py-1">
                                  <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Nhóm {parent.name}
                                  </div>
                                  <ul className="flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {childs.map((child) => (
                                      <li key={child._id || child.id} className="block w-full">
                                        <Link
                                          to={`/products?category=${child._id || child.id}`}
                                          onClick={() => setIsCategoryOpen(false)}
                                          className="block px-5 py-2.5 hover:bg-gray-50 hover:text-[#ee4d2d] text-sm text-gray-600 transition-colors font-normal border-l-2 border-transparent hover:border-[#ee4d2d]"
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

          <nav className="flex items-center gap-8 ml-8 font-medium text-[13px] uppercase tracking-wide">
            <Link to="/" className="hover:text-white/80 transition-colors">Trang chủ</Link>
            <Link to="/products" className="hover:text-white/80 transition-colors">Sản phẩm</Link>
            <Link to="/flashSales" className="hover:text-white/80 transition-colors">⚡ Flash Sale</Link>
            <Link to="/vouchers" className="hover:text-white/80 transition-colors">Mã Giảm Giá</Link>
            <Link to="/news" className="hover:text-white/80 transition-colors">Tin tức Mới</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;