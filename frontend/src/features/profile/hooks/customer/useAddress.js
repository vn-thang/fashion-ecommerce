import { useState, useEffect, useCallback } from 'react';
import { addressApi } from '../../api/addressApi';

export const useAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await addressApi.getAddresses();
      setAddresses(response.data || response || []);
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const deleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await addressApi.deleteAddress(id);
      fetchAddresses(); 
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await addressApi.setDefault(id);
      fetchAddresses();
    } catch (error) {
      console.error('Lỗi khi set mặc định:', error);
    }
  };

  return {
    addresses,
    isLoading,
    fetchAddresses,
    deleteAddress,
    setDefaultAddress
  };
};