import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import { useStoreSetting } from '../../features/storeSetting/hooks/useStoreSetting';

const footerLinks = [
  { to: '/help', label: 'Trung tâm trợ giúp' },
  { to: '/account/orders', label: 'Đơn mua' },
  { to: '/shipping-policy', label: 'Chính sách vận chuyển' },
  { to: '/refund-policy', label: 'Trả hàng & hoàn tiền' },
  { to: '/privacy', label: 'Chính sách bảo mật' },
  { to: '/terms', label: 'Điều khoản sử dụng' }
];

const sectionHeadingClass =
  'mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-900';

const contactLinkClass =
  'group flex min-w-0 items-center gap-3 rounded-xl border border-[#eadfdd] bg-white/80 px-3 py-3 shadow-sm transition-colors hover:border-[#c98f8f] hover:bg-white';

const CustomerFooter = () => {
  const { form, loading } = useStoreSetting();
  const currentYear = new Date().getFullYear();

  const {
    storeName,
    description,
    hotline,
    email,
    zalo,
    address,
    openingHours
  } = form;

  if (loading) {
    return (
      <footer className="mt-auto border-t border-[#eee5e2] bg-white">
        <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="h-3 w-32 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-4/5 rounded bg-slate-100" />
                <div className="h-3 w-3/5 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-[#eee5e2] bg-gradient-to-b from-white via-white to-[#fffdfc] text-[13px] leading-6 text-slate-600 shadow-[0_-8px_30px_rgba(76,45,39,0.035)]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-10 gap-y-9 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-12 lg:grid-cols-[1.25fr_0.9fr_1fr_1fr] lg:gap-x-12 lg:px-8 lg:py-14">
        <section>
          <h2 className="text-lg font-semibold leading-7 tracking-tight text-slate-900">
            {storeName || 'FashionHub'}
          </h2>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-[#c98f8f]" />
          <p className="mt-4 max-w-sm text-[13px] leading-6 text-slate-600">
            {description ||
              'Thời trang chất lượng, phong cách hiện đại và trải nghiệm mua sắm tiện lợi dành cho bạn.'}
          </p>

          <div className="mt-5 space-y-3 text-[12px] leading-5 text-slate-600">
            {address && (
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#b97878]" />
                <span>{address}</span>
              </div>
            )}
            {openingHours && (
              <div className="flex items-start gap-3">
                <FaClock className="mt-1 shrink-0 text-[#b97878]" />
                <span>{openingHours}</span>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className={sectionHeadingClass}>Hỗ trợ khách hàng</h2>
          <ul className="space-y-2">
            {footerLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-flex py-0.5 text-[13px] leading-5 text-slate-600 transition-colors hover:text-[#a85d5d]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={sectionHeadingClass}>Liên hệ</h2>
          <div className="space-y-2.5">
            {hotline && (
              <a href={`tel:${hotline}`} className={contactLinkClass}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e4e1] text-[#a85d5d]">
                  <FaPhoneAlt size={13} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] leading-4 text-slate-500">
                    Hotline
                  </span>
                  <span className="block truncate text-[13px] font-medium leading-5 text-slate-800">
                    {hotline}
                  </span>
                </span>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className={contactLinkClass}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e4e1] text-[#a85d5d]">
                  <FaEnvelope size={13} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] leading-4 text-slate-500">
                    Email
                  </span>
                  <span className="block truncate text-[13px] font-medium leading-5 text-slate-800">
                    {email}
                  </span>
                </span>
              </a>
            )}
            {zalo && (
              <a
                href={`https://zalo.me/${zalo}`}
                target="_blank"
                rel="noreferrer"
                className={contactLinkClass}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e4e1] text-xs font-bold text-[#a85d5d]">
                  Z
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] leading-4 text-slate-500">
                    Zalo
                  </span>
                  <span className="block truncate text-[13px] font-medium leading-5 text-slate-800">
                    {zalo}
                  </span>
                </span>
              </a>
            )}
          </div>
        </section>

        <section>
          <h2 className={sectionHeadingClass}>Kết nối với chúng tôi</h2>
          <p className="max-w-xs text-[13px] leading-6 text-slate-600">
            Theo dõi {storeName || 'FashionHub'} để cập nhật sản phẩm và chương
            trình ưu đãi mới nhất.
          </p>
          <div className="mt-5 flex gap-2.5">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ead7d3] bg-white text-slate-600 shadow-sm transition-colors hover:border-[#c98f8f] hover:bg-[#c98f8f] hover:text-white"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ead7d3] bg-white text-slate-600 shadow-sm transition-colors hover:border-[#c98f8f] hover:bg-[#c98f8f] hover:text-white"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ead7d3] bg-white text-slate-600 shadow-sm transition-colors hover:border-[#c98f8f] hover:bg-[#c98f8f] hover:text-white"
            >
              <FaTiktok size={14} />
            </a>
          </div>
        </section>
      </div>

      <div className="border-t border-[#f0e9e7] bg-[#fdfaf9]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-1 px-4 py-4 text-center text-[11px] leading-5 text-slate-500 sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>
            © {currentYear} {storeName || 'FashionHub'}. All rights reserved.
          </p>
          <p>Thiết kế dành cho trải nghiệm mua sắm tốt hơn.</p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
