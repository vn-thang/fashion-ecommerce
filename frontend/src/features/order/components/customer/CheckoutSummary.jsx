import React from 'react';
import Button from '../../../../shared/components/Button';

const CheckoutSummary = ({ previewData, province, isCalculated, isSubmitting, handlePlaceOrder, formatPrice }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Tổng tiền hàng:</span>
        <span className="font-medium text-gray-800">{formatPrice(previewData?.subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Phí vận chuyển </span>
        <span className="font-medium text-gray-800">{formatPrice(previewData?.shippingFee)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Giảm giá:</span>
        <span className="font-medium text-rose-600">-{formatPrice(previewData?.discountAmount)}</span>
      </div>
      <div className="border-t border-gray-150 pt-3 flex justify-between items-center">
        <span className="text-base font-bold text-gray-800">Tổng thanh toán:</span>
        <span className="text-2xl font-black text-[#ee4d2d]">{formatPrice(previewData?.totalAmount)}</span>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={handlePlaceOrder}
        isLoading={isSubmitting}
        disabled={!isCalculated}
        className="w-full mt-4 bg-[#ee4d2d] hover:bg-[#d74123] text-white shadow-lg text-base font-bold"
      >
        Đặt hàng ngay
      </Button>
    </div>
  );
};

export default CheckoutSummary;