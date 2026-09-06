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

<section className="relative overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-orange-50 px-6 py-10 text-center shadow-sm sm:py-12">
  <div className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-orange-200/30 blur-2xl" />
  <div className="pointer-events-none absolute -right-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-orange-100/40 blur-2xl" />

  <div className="relative mx-auto max-w-3xl">
    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ee4d2d]">
      FashionHub
    </span>

    <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
      Phong cách riêng,
      <span className="text-[#ee4d2d]"> dấu ấn riêng.</span>
    </h2>

    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
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