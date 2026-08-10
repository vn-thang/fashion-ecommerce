import React from 'react';
import HomeBanner from '../components/banner/HomeBanner';

import FlashSaleSection from '../components/flashSale/FlashSaleSection';
import FlashSaleCarousel from '../components/flashSale/FlashSaleCarousel';
import FlashSaleSkeleton from '../components/flashSale/FlashSaleSkeleton';

import BestSellerSection from '../components/bestSeller/BestSellerSection';
import BestSellerSkeleton from '../components/bestSeller/BestSellerSkeleton';

import NewestSection from '../components/newest/NewestSection';
import NewestSkeleton from '../components/newest/NewestSkeleton';

import { useHome } from '../hooks/useHome';

const HomePage = () => {
  const {
    loading,
    banners,
    flashSale,
    bestSellingProducts,
    newestProducts
  } = useHome();

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn">
      <HomeBanner
        loading={loading}
        banners={banners}
      />

      <section className="rounded-xl border border-gray-100 bg-white py-20 text-center shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800">
          Chào mừng đến với FashionHub
        </h2>

        <p className="mt-3 text-lg text-gray-500">
          Nơi hội tụ những xu hướng thời trang mới nhất dành cho bạn.
        </p>
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

      <section className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">
          📂 Danh mục nổi bật
        </h2>

        <p className="mt-2 text-gray-500">
          (Sẽ phát triển sau)
        </p>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">
          ❤️ Gợi ý cho bạn
        </h2>

        <p className="mt-2 text-gray-500">
          (Sẽ phát triển sau)
        </p>
      </section>
    </div>
  );
};

export default HomePage;