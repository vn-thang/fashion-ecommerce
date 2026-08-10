import { bannerApi } from '../../banner/api/bannerApi';
import { flashSaleApi } from '../../flashSale/api/flashSaleApi';
import { productApi } from '../../product/api/productApi';

export const homeApi = {
  getBanners: async () => {
    return await bannerApi.getActive();
  },

   getFlashSale: () => {
    return flashSaleApi.getActive();
  },
    getBestSellingProducts: async () => {
    return await productApi.getBestSellingProducts();
  },
    getNewestProducts: async () => {
    return await productApi.getNewestProducts();
  }
};