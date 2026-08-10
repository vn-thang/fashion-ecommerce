import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { homeApi } from '../api/homeApi';

export const useHome = () => {
  const [loading, setLoading] = useState(true);

  const [banners, setBanners] = useState([]);
  const [flashSale, setFlashSale] = useState(null);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [recommendProducts, setRecommendProducts] = useState([]);

  const fetchHomeData = async () => {
    setLoading(true);

    try {
      const [
        bannerRes,
        flashSaleRes,
        bestSellerRes,
        newestRes
      ] = await Promise.all([
        homeApi.getBanners(),
        homeApi.getFlashSale(),
        homeApi.getBestSellingProducts(),
        homeApi.getNewestProducts()
      ]);

      const bannerData = bannerRes.data || bannerRes;
      const flashSaleData = flashSaleRes.data || flashSaleRes;
      const bestSellerData = bestSellerRes.data || bestSellerRes;
      const newestData = newestRes.data || newestRes;

      setBanners(
        Array.isArray(bannerData)
          ? bannerData
          : []
      );

      setFlashSale(flashSaleData || null);

      setBestSellingProducts(
        bestSellerData.products || []
      );

      setNewestProducts(
        newestData.products || []
      );

    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu trang chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return {
    loading,
    banners,
    flashSale,
    bestSellingProducts,
    newestProducts,
    categories,
    recommendProducts,
    refreshHome: fetchHomeData
  };
};