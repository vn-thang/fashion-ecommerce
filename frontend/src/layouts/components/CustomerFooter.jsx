import { Link } from 'react-router-dom';

const CustomerFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-4 border-[#ee4d2d] text-xs text-gray-500 pt-12">
      <div className="w-[95%] max-w-[1600px] mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-200">
        
        <div>
          <h3 className="mb-4 font-bold text-gray-700 uppercase tracking-wider">Chăm sóc khách hàng</h3>
          <ul className="space-y-2.5">
            <li><Link to="/help" className="hover:text-[#ee4d2d] transition-colors">Trung Tâm Trợ Giúp</Link></li>
            <li><Link to="/blog" className="hover:text-[#ee4d2d] transition-colors">FashionHub Blog</Link></li>
            <li><Link to="/how-to-buy" className="hover:text-[#ee4d2d] transition-colors">Hướng Dẫn Mua Hàng</Link></li>
            <li><Link to="/returns" className="hover:text-[#ee4d2d] transition-colors">Trả Hàng & Hoàn Tiền</Link></li>
            <li><Link to="/contact" className="hover:text-[#ee4d2d] transition-colors">Chăm Sóc Khách Hàng</Link></li>
            <li><Link to="/warranty" className="hover:text-[#ee4d2d] transition-colors">Chính Sách Bảo Hành</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-gray-700 uppercase tracking-wider">Về FashionHub</h3>
          <ul className="space-y-2.5">
            <li><Link to="/about" className="hover:text-[#ee4d2d] transition-colors">Giới Thiệu Về FashionHub</Link></li>
            <li><Link to="/careers" className="hover:text-[#ee4d2d] transition-colors">Tuyển Dụng</Link></li>
            <li><Link to="/terms" className="hover:text-[#ee4d2d] transition-colors">Điều Khoản FashionHub</Link></li>
            <li><Link to="/privacy" className="hover:text-[#ee4d2d] transition-colors">Chính Sách Bảo Mật</Link></li>
            <li><Link to="/mall" className="hover:text-[#ee4d2d] transition-colors">Chính Hãng</Link></li>
            <li><Link to="/media" className="hover:text-[#ee4d2d] transition-colors">Kênh Truyền Thông</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold text-gray-700 uppercase tracking-wider">Thanh toán</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="h-7 border border-gray-200 rounded-sm bg-white shadow-xs flex items-center justify-center font-semibold text-[10px] text-blue-800 tracking-tighter">VISA</div>
            <div className="h-7 border border-gray-200 rounded-sm bg-white shadow-xs flex items-center justify-center font-semibold text-[10px] text-orange-600">COD</div>
            <div className="h-7 border border-gray-200 rounded-sm bg-white shadow-xs flex items-center justify-center font-semibold text-[10px] text-blue-600">ATM</div>
          </div>
          
          <h3 className="mb-3 font-bold text-gray-700 uppercase tracking-wider">Đơn vị vận chuyển</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-7 border border-gray-200 rounded-sm bg-white shadow-xs flex items-center justify-center font-bold text-[10px] text-green-600">GHTK</div>
            <div className="h-7 border border-gray-200 rounded-sm bg-white shadow-xs flex items-center justify-center font-bold text-[10px] text-orange-500">GHN</div>
            <div className="h-7 border border-gray-200 rounded-sm bg-white shadow-xs flex items-center justify-center font-bold text-[10px] text-red-600">SPX</div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-gray-700 uppercase tracking-wider">Theo dõi chúng tôi</h3>
          <ul className="space-y-2.5">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors">
                <span className="text-sm">📘</span> Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors">
                <span className="text-sm">📸</span> Instagram
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors">
                <span className="text-sm">💼</span> LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-gray-700 uppercase tracking-wider">Tải ứng dụng FashionHub</h3>
          <div className="flex gap-3">
            <div className="h-20 w-20 border border-gray-200 rounded-sm p-1 bg-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-[10px] text-center text-gray-400 font-mono">QR CODE APP</span>
            </div>
            <div className="flex flex-col justify-between py-0.5">
              <div className="h-6 w-24 border border-gray-200 rounded-sm bg-white px-1.5 flex items-center gap-1 shadow-xs cursor-pointer hover:border-gray-400">
                <span className="text-[10px]">🤖</span>
                <span className="text-[8px] font-bold leading-none text-gray-700">Google Play</span>
              </div>
              <div className="h-6 w-24 border border-gray-200 rounded-sm bg-white px-1.5 flex items-center gap-1 shadow-xs cursor-pointer hover:border-gray-400">
                <span className="text-[10px]">🍏</span>
                <span className="text-[8px] font-bold leading-none text-gray-700">App Store</span>
              </div>
              <div className="h-6 w-24 border border-gray-200 rounded-sm bg-white px-1.5 flex items-center gap-1 shadow-xs cursor-pointer hover:border-gray-400">
                <span className="text-[10px]">🌌</span>
                <span className="text-[8px] font-bold leading-none text-gray-700">AppGallery</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-[#f5f5f5] py-10 text-center text-gray-500 border-t border-gray-200">
        <div className="w-[95%] max-w-[1600px] mx-auto px-4 space-y-6">
          
          <div className="flex justify-center items-center gap-6 text-gray-600 font-medium uppercase text-[11px]">
            <Link to="/privacy" className="hover:text-[#ee4d2d]">Chính sách bảo mật</Link>
            <span className="h-3 w-[1px] bg-gray-300"></span>
            <Link to="/terms" className="hover:text-[#ee4d2d]">Quy chế hoạt động</Link>
            <span className="h-3 w-[1px] bg-gray-300"></span>
            <Link to="/shipping-policy" className="hover:text-[#ee4d2d]">Chính sách vận chuyển</Link>
            <span className="h-3 w-[1px] bg-gray-300"></span>
            <Link to="/refund-policy" className="hover:text-[#ee4d2d]">Chính sách trả hàng và hoàn tiền</Link>
          </div>

          <div className="flex justify-center items-center gap-4">
            <div className="border border-red-300 text-red-500 font-bold px-3 py-1.5 rounded-sm tracking-tighter text-[10px] uppercase bg-red-50 select-none">
              ✓ Đã Đăng Ký Bộ Công Thương
            </div>
            <div className="border border-red-300 text-red-500 font-bold px-3 py-1.5 rounded-sm tracking-tighter text-[10px] uppercase bg-red-50 select-none">
              🛡 Chính Hãng 100%
            </div>
          </div>

          <div className="text-[11px] text-gray-400 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-gray-600 text-xs">Công ty TNHH E-Commerce FashionHub Việt Nam</p>
            <p>Địa chỉ: Tầng 28, Tòa nhà Trung tâm Tài chính ABC, số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam.</p>
            <p>Mã số doanh nghiệp: 0123456789 do Sở Kế hoạch & Đầu tư TP.HCM cấp lần đầu ngày 01/01/2025.</p>
            <p>Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Văn A - Điện thoại liên hệ: 028 7300 1234</p>
            <p>Email hỗ trợ: cskh@fashionhub.com.vn - Hotline: 1900 6789 (Hỗ trợ 24/7) - © {currentYear} FashionHub</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;