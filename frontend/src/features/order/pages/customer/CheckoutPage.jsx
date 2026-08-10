import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCheckout';

import ShippingForm from '../../components/customer/ShippingForm';
import CheckoutItems from '../../components/customer/CheckoutItems';
import CouponSection from '../../components/customer/CouponSection';
import CheckoutSummary from '../../components/customer/CheckoutSummary';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal'; 
import AddressFormModal from '../../../profile/components/customer/AddressFormModal'; 

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const itemsToCheckout = location.state?.itemsToCheckout || [];
  const isBuyNow = location.state?.isBuyNow || false;
  
  const cartItemIds = useMemo(() => {
    return itemsToCheckout.map(item => item.id);
  }, [itemsToCheckout]);

  useEffect(() => {
    if (!isBuyNow && cartItemIds.length === 0) {
    navigate('/cart');
  }
}, [cartItemIds, isBuyNow, navigate]);

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

 const {
  shippingAddress,
  allAddresses,
  fetchAddresses,
  handleSelectAddress,
  note,
  setNote,
  couponInput,
  setCouponInput,
  appliedCoupon,
  setAppliedCoupon,
   paymentMethod,
  setPaymentMethod,
  previewData,
  isCalculated,
  isSubmitting,
  apiError,
  handlePlaceOrder,
  availableCoupons,
  subTotalAmount
} = useCheckout(
  cartItemIds,
  itemsToCheckout,
  isBuyNow
);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

  return (
    <div className="bg-gray-50 min-h-screen py-8 text-slate-800 font-sans">
      <div className="w-full">
  
        {apiError && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm rounded-r-lg shadow-sm">
            ⚠️ {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="space-y-6 h-full">
           <ShippingForm
            shippingAddress={shippingAddress}
            note={note}
            setNote={setNote}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onOpenSelectModal={() => setIsSelectModalOpen(true)}
          />
          </div>
          
          <div className="space-y-6 h-full flex flex-col">
            <CheckoutItems items={itemsToCheckout} formatPrice={formatPrice} />
            
            <CouponSection 
              couponInput={couponInput} 
              setCouponInput={setCouponInput} 
              appliedCoupon={appliedCoupon} 
              setAppliedCoupon={setAppliedCoupon}
              availableCoupons={availableCoupons}
              subTotalAmount={subTotalAmount}
              formatPrice={formatPrice}
            />
            
            <div className="flex-1 flex flex-col justify-end">
              <CheckoutSummary 
                previewData={previewData} 
                province={shippingAddress.province} 
                isCalculated={isCalculated} 
                isSubmitting={isSubmitting} 
                handlePlaceOrder={handlePlaceOrder} 
                formatPrice={formatPrice} 
              />
            </div>
          </div>

        </div>
      </div>

      <Modal isOpen={isSelectModalOpen} onClose={() => setIsSelectModalOpen(false)} title="Địa chỉ của tôi" size="lg">
         <div className="max-h-[60vh] overflow-y-auto pr-2">
           {allAddresses.length > 0 ? allAddresses.map((addr) => (
             <div key={addr.id} className="flex gap-4 p-4 border-b border-gray-100 last:border-none items-center">
                <input 
                  type="radio" 
                  name="address" 
                  className="w-4 h-4 accent-rose-500 cursor-pointer"
                  checked={shippingAddress?.id === addr.id}
                  onChange={() => {
                    handleSelectAddress(addr);
                    setIsSelectModalOpen(false);
                  }}
                />
                <div className="flex-1 cursor-pointer" onClick={() => { handleSelectAddress(addr); setIsSelectModalOpen(false); }}>
                  <p className="font-bold text-gray-800">{addr.receiverName} <span className="text-gray-500 font-normal ml-2 text-sm">| {addr.phoneNumber}</span></p>
                  <p className="text-sm text-gray-600 mt-1">{addr.addressLine}</p>
                  <p className="text-sm text-gray-600">{addr.ward}, {addr.province}</p>
                  {addr.isDefault && <span className="inline-block mt-2 px-2 py-0.5 text-xs text-rose-500 border border-rose-500 rounded">Mặc định</span>}
                </div>
             </div>
           )) : (
              <p className="text-center py-6 text-gray-500">Bạn chưa lưu địa chỉ nào.</p>
           )}
         </div>
         
         <div className="pt-4 mt-4 border-t flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => { setIsSelectModalOpen(false); setIsAddModalOpen(true); }}
            >
              + Thêm địa chỉ mới
            </Button>
            <Button 
              variant="danger" 
              onClick={() => setIsSelectModalOpen(false)}
            >
              Đóng
            </Button>
         </div>
      </Modal>

      <AddressFormModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => fetchAddresses()}
      />
    </div>
  );
};

export default CheckoutPage;