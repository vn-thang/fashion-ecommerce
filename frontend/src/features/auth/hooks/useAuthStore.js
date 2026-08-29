import { useEffect, useState } from 'react';

import { storeSettingApi } from '../../storeSetting/api/storeSettingApi';

export const useAuthStore = () => {
  const [storeName, setStoreName] = useState('FashionHub');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await storeSettingApi.get();

        const data = res.data?.data || res.data;

        setStoreName(data?.storeName || 'FashionHub');
        setLogoUrl(data?.logoUrl || '');
      } catch (error) {
        console.error(
          'Không thể tải thông tin cửa hàng:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  return {
    storeName,
    logoUrl,
    loading
  };
};