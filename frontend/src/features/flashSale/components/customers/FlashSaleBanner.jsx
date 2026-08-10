import React from 'react';
import FlashSaleCountdown from './FlashSaleCountdown';

const FlashSaleBanner = ({ flashSale }) => {
  return (
   <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 px-8 py-8 mb-8">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute -bottom-24 right-10 w-80 h-80 bg-white/10 rounded-full" />
      <div className="absolute top-10 right-1/3 w-20 h-20 bg-white/10 rounded-full" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">

        {/* LEFT */}
        <div className="flex items-start gap-5">

          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">
            ⚡
          </div>

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">

              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              Đang diễn ra

            </div>

            <h1 className="mt-4 text-5xl font-extrabold tracking-wide text-white">
              FLASH SALE
            </h1>

            <p className="mt-2 text-lg text-red-100">
              {flashSale?.name || 'Ưu đãi giới hạn trong thời gian ngắn'}
            </p>

            <p className="mt-4 text-sm text-red-100/90 max-w-xl leading-6">
              Hàng trăm sản phẩm chính hãng với mức giá ưu đãi cực sốc.
              Số lượng có hạn, ưu tiên cho những đơn hàng thanh toán sớm.
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-8 py-6 shadow-2xl">

          <div className="text-center">

            <div className="text-sm uppercase tracking-wider text-red-100">
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