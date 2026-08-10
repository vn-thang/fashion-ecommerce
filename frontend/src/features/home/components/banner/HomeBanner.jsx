import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HomeBanner = ({
  loading,
  banners
}) => {

  if (loading) {
    return (
      <div className="w-full h-[260px] md:h-[380px] lg:h-[500px] rounded-xl overflow-hidden bg-gray-200 animate-pulse" />
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full h-[260px] md:h-[380px] lg:h-[500px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
        Chưa có banner nào.
      </div>
    );
  }

  return (
    <Swiper
      modules={[
        Autoplay,
        Pagination,
        Navigation,
        EffectFade
      ]}
      effect="fade"
      fadeEffect={{
        crossFade: true
      }}
      loop
      speed={900}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false
      }}
      pagination={{
        clickable: true
      }}
      navigation
      className="w-full h-[260px] md:h-[380px] lg:h-[500px] rounded-xl overflow-hidden shadow-md"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <div className="relative w-full h-full">

            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />

            <div
    className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent"/>

            <div className="absolute inset-0 flex items-center">

              <div className="ml-10 md:ml-16 max-w-xl text-white">

                <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                  {banner.title}
                </h2>

                {banner.description && (
                  <p className="mt-4 text-lg md:text-xl text-gray-100 leading-relaxed">
                    {banner.description}
                  </p>
                )}

                <Link
                  to="/products"
                  className="inline-block mt-8 bg-[#ee4d2d] hover:bg-[#d94422] transition-all px-8 py-3 rounded-lg text-white font-semibold shadow-lg"
                >
                  Mua ngay
                </Link>

              </div>

            </div>

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeBanner;