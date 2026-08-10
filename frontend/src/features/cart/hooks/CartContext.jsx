import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from '../../auth/store/authContext'; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ totalItems: 0, totalPrice: 0, items: [] });
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useAuth(); 

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await cartApi.getCart();
      if (res.success) setCart(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart({ totalItems: 0, totalPrice: 0, items: [] });
    }
  }, [token, fetchCart]); 
  
  const addToCart = async (productVariantId, quantity) => {
    try {
      setIsLoading(true);
      const res = await cartApi.addToCart({ productVariantId, quantity });
      
      if (res.success) {
        setCart(res.data); 
        return { success: true };
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Có lỗi xảy ra!' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartApi.updateQuantity(itemId, quantity);
      if (res.success) setCart(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật số lượng');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await cartApi.removeItem(itemId);
      if (res.success) setCart(res.data);
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm');
    }
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, fetchCart, updateQuantity, removeItem, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);