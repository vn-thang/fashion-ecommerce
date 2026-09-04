import React from 'react';
import HomeBanner from '../components/banner/HomeBanner';
import FlashSaleSection from '../components/flashSale/FlashSaleSection';
import FlashSaleCarousel from '../components/flashSale/FlashSaleCarousel';
import FlashSaleSkeleton from '../components/flashSale/FlashSaleSkeleton';
import BestSellerSection from '../components/bestSeller/BestSellerSection';
import BestSellerSkeleton from '../components/bestSeller/BestSellerSkeleton';
import NewestSection from '../components/newest/NewestSection';
import NewestSkeleton from '../components/newest/NewestSkeleton';
import RecentlyViewed from '../../product/components/customer/RecentlyViewed';
import HighlyRatedSection from '../components/highlyRated/HighlyRatedSection';
import HighlyRatedSkeleton from '../components/highlyRated/HighlyRatedSkeleton';

import { useHome } from '../hooks/useHome';

const HomePage = () => {
  const {
    loading,
    banners,
    flashSale,
    bestSellingProducts,
    newestProducts,
    highlyRatedProducts
  } = useHome();

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn">
      <HomeBanner
        loading={loading}
        banners={banners}
      />

    <section className="relative overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 text-center shadow-sm">
      <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-orange-200/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-orange-100/50 blur-2xl" />

      <div className="relative">
        <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#ee4d2d]">
          FashionHub
        </span>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Phong cách riêng,
          <span className="text-[#ee4d2d]"> dấu ấn riêng.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl px-4 text-base leading-7 text-gray-500 sm:text-lg">
          Khám phá những xu hướng thời trang mới nhất,
          được tuyển chọn để đồng hành cùng phong cách của bạn.
        </p>
      </div>
    </section>

      {loading ? (
        <FlashSaleSkeleton />
      ) : flashSale ? (
        <FlashSaleSection flashSale={flashSale}>
          <FlashSaleCarousel
            products={flashSale.products}
          />
        </FlashSaleSection>
      ) : null}

      {loading ? (
        <BestSellerSkeleton />
      ) : (
        <BestSellerSection
          products={bestSellingProducts}
        />
      )}

      {loading ? (
        <NewestSkeleton />
      ) : (
        <NewestSection
          products={newestProducts}
        />
      )}

      {loading ? (
      <HighlyRatedSkeleton />
      ) : (
        <HighlyRatedSection
          products={highlyRatedProducts}
        />
      )}

      <RecentlyViewed />
    </div>
  );
};

export default HomePage;