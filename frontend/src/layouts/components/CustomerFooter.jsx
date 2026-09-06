import React from 'react';
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
 <footer className="border-t border-gray-200 bg-white">
  <div className="mx-auto h-64 w-[85%] max-w-[1200px] animate-pulse py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-4/5 rounded bg-gray-200" />
                <div className="h-3 w-3/5 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
   <footer className="border-t border-gray-200 bg-white text-base text-gray-500">
  <div className="mx-auto grid w-[85%] max-w-[1200px] grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-12">

        {/* Store information */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-900">
            {storeName || 'FashionHub'}
          </h3>

          <p className="mb-5 max-w-xs leading-6">
            {description ||
              'Thời trang chất lượng, phong cách hiện đại và trải nghiệm mua sắm tiện lợi dành cho bạn.'}
          </p>

          <div className="space-y-3">
            {address && (
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#ee4d2d]" />
                <span className="leading-5">{address}</span>
              </div>
            )}

            {openingHours && (
              <div className="flex items-start gap-3">
                <FaClock className="mt-1 shrink-0 text-[#ee4d2d]" />
                <span>{openingHours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer support */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-900">
            Hỗ trợ khách hàng
          </h3>

          <ul className="space-y-3">
            <li>
              <Link to="/help" className="transition hover:text-[#ee4d2d]">
                Trung tâm trợ giúp
              </Link>
            </li>

            <li>
              <Link
                to="/account/orders"
                className="transition hover:text-[#ee4d2d]"
              >
                Đơn mua
              </Link>
            </li>

            <li>
              <Link
                to="/shipping-policy"
                className="transition hover:text-[#ee4d2d]"
              >
                Chính sách vận chuyển
              </Link>
            </li>

            <li>
              <Link
                to="/refund-policy"
                className="transition hover:text-[#ee4d2d]"
              >
                Trả hàng & hoàn tiền
              </Link>
            </li>

            <li>
              <Link
                to="/privacy"
                className="transition hover:text-[#ee4d2d]"
              >
                Chính sách bảo mật
              </Link>
            </li>

            <li>
              <Link
                to="/terms"
                className="transition hover:text-[#ee4d2d]"
              >
                Điều khoản sử dụng
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-900">
            Liên hệ
          </h3>

          <div className="space-y-4">
            {hotline && (
              <a
                href={`tel:${hotline}`}
                className="flex items-center gap-3 transition hover:text-[#ee4d2d]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#ee4d2d]">
                  <FaPhoneAlt size={13} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Hotline</p>
                  <p className="font-semibold text-gray-700">{hotline}</p>
                </div>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="flex min-w-0 items-center gap-3 transition hover:text-[#ee4d2d]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#ee4d2d]">
                  <FaEnvelope size={13} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="truncate font-medium text-gray-700">
                    {email}
                  </p>
                </div>
              </a>
            )}

            {zalo && (
              <a
                href={`https://zalo.me/${zalo}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-[#ee4d2d]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#ee4d2d]">
                  Z
                </div>

                <div>
                  <p className="text-xs text-gray-400">Zalo</p>
                  <p className="font-medium text-gray-700">{zalo}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-900">
            Kết nối với chúng tôi
          </h3>

          <p className="mb-5 max-w-xs leading-6">
            Theo dõi {storeName || 'FashionHub'} để cập nhật sản phẩm và chương
            trình ưu đãi mới nhất.
          </p>

          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white"
            >
              <FaFacebookF size={15} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white"
            >
              <FaInstagram size={17} />
            </a>

            <a
              href="#"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white"
            >
              <FaTiktok size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex w-[95%] max-w-[1400px] items-center justify-center py-5">
          <p className="text-sm text-gray-400">
            © {currentYear} {storeName || 'FashionHub'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;