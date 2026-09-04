import React from 'react';
import FlashSaleCountdown from './FlashSaleCountdown';

const FlashSaleBanner = ({ flashSale }) => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#f5b5a5] bg-gradient-to-r from-[#f97355] via-[#f86b4f] to-[#f47b63] px-8 py-8 shadow-sm">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-28 right-8 h-80 w-80 rounded-full bg-white/10" />
      <div className="absolute right-1/3 top-8 h-24 w-24 rounded-full bg-white/10" />

      <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">

        {/* LEFT */}
        <div className="flex items-start gap-5">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-5xl shadow-sm backdrop-blur-sm">
            ⚡
          </div>

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
              Đang diễn ra
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-wide text-white sm:text-5xl">
              FLASH SALE
            </h1>

            <p className="mt-2 text-lg font-semibold text-white/95">
              {flashSale?.name || 'Ưu đãi giới hạn trong thời gian ngắn'}
            </p>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">
              Hàng trăm sản phẩm chính hãng với mức giá ưu đãi hấp dẫn.
              Số lượng có hạn, đừng bỏ lỡ những sản phẩm yêu thích.
            </p>

          </div>
        </div>

        <div className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-white/90 px-8 py-6 shadow-lg backdrop-blur-sm">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#c95a42]">
              Kết thúc sau
            </div>

            <div className="mt-4">
              <FlashSaleCountdown
                endDate={flashSale?.endDate}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlashSaleBanner;