import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import {
  Navigation
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import FlashSaleCard from '../../../flashSale/components/customers/FlashSaleCard';

const FlashSaleCarousel = ({
  products = []
}) => {

  if (!products.length) {
    return (
      <div className="py-16 text-center text-gray-500">
        Chưa có sản phẩm Flash Sale.
      </div>
    );
  }

  return (
    <Swiper
      modules={[
        Navigation
      ]}
      navigation
      spaceBetween={20}
      breakpoints={{
        320: {
          slidesPerView: 2
        },

        640: {
          slidesPerView: 2
        },

        768: {
          slidesPerView: 3
        },

        1024: {
          slidesPerView: 4
        },

        1280: {
          slidesPerView: 5
        }
      }}
    >
      {products.map((product) => (
        <SwiperSlide
          key={product.flashSaleVariantId}
        >
          <FlashSaleCard
            product={product}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FlashSaleCarousel;