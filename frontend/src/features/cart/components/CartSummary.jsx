import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';

const CartSummary = ({ summaryData, formatPrice }) => {
  const navigate = useNavigate();
  const { totalItems, totalPrice, selectedItems } = summaryData; 

  const handleCheckout = () => {
    navigate('/checkout', { state: { itemsToCheckout: selectedItems } });
  };

  return (
    <div className="w-full lg:w-80 h-fit bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h3 className="text-sm font-medium text-gray-800 mb-4 border-b pb-4">Tóm tắt đơn hàng</h3>
      
      <div className="flex justify-between items-center mb-4 text-gray-600">
        <span>Tổng số lượng:</span>
        <span className="font-medium">{totalItems} sản phẩm</span>
      </div>
      
      <div className="flex justify-between items-center mb-6 text-gray-800">
        <span className="font-medium">Tạm tính:</span>
        <span className="text-sm font-bold text-[#ee4d2d]">{formatPrice(totalPrice)}</span>
      </div>

      <Button 
        variant="primary" 
        size="lg" 
        onClick={handleCheckout}
        disabled={totalItems === 0} 
        className={`w-full shadow-md ${
          totalItems === 0 
            ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
            : 'bg-[#ee4d2d] hover:bg-[#d74123]'
        }`}
      >
        Mua hàng
      </Button>
      <p className="text-xs text-center text-gray-500 mt-4">
        Phí vận chuyển sẽ được tính ở trang thanh toán
      </p>
    </div>
  );
};

export default CartSummary;