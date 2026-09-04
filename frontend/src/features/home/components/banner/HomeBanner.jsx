import React from 'react';
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

const HomeBanner = ({ loading, banners }) => {
  if (loading) {
    return (
      <div className="w-full aspect-[16/6] rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full aspect-[16/6] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
        Chưa có banner nào.
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg">
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
        speed={1000}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true
        }}
        navigation
        className="w-full aspect-[16/6]"
      >
        {banners.map(banner => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full overflow-hidden group">
              <img
                src={banner.imageUrl}
                alt={banner.title || 'Banner'}
                className="
                  w-full h-full
                  object-cover
                  transition-transform
                  duration-[5000ms]
                  ease-out
                  group-hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeBanner;