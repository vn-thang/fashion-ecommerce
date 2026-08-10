import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCart } from '../hooks/CartContext';
import EmptyCart from '../components/EmptyCart';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

const CartPage = () => {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();
  
  const [selectedIds, setSelectedIds] = useState([]);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!cart?.items) return;

    if (isFirstLoad.current && cart.items.length > 0) {
      setSelectedIds(cart.items.map(item => item.id));
      isFirstLoad.current = false; 
    } else {
      const currentIds = cart.items.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => currentIds.includes(id)));
    }
  }, [cart?.items]);

  const handleToggleItem = (itemId) => {
    setSelectedIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId] 
    );
  };

  const handleToggleAll = () => {
    if (selectedIds.length === cart.items.length) {
      setSelectedIds([]); 
    } else {
      setSelectedIds(cart.items.map(item => item.id)); 
    }
  };

  const summaryData = useMemo(() => {
    const selectedItems = cart?.items?.filter(item => selectedIds.includes(item.id)) || [];
    const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.itemTotal, 0);
    
    return { selectedItems, totalItems, totalPrice };
  }, [cart, selectedIds]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Đang tải giỏ hàng...</div>;
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">

       <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600 text-center">
              <div className="col-span-5 text-left flex items-center gap-4">
              
                <input 
                  type="checkbox" 
                  className="w-4 h-4 cursor-pointer accent-[#ee4d2d]" 
                  checked={cart.items.length > 0 && selectedIds.length === cart.items.length}
                  onChange={handleToggleAll}
                />
                <span>Sản phẩm</span>
              </div>
              <div className="col-span-2">Đơn giá</div>
              <div className="col-span-2">Số lượng</div>
              <div className="col-span-2">Số tiền</div>
              <div className="col-span-1">Thao tác</div>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeItem={removeItem} 
                  formatPrice={formatPrice}
                  isSelected={selectedIds.includes(item.id)}
                  onToggle={() => handleToggleItem(item.id)}
                />
              ))}
            </div>
          </div>
          <CartSummary summaryData={summaryData} formatPrice={formatPrice} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;