import React, { useState, useEffect } from 'react';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal';

const CouponSection = ({ 
  couponInput, 
  setCouponInput, 
  appliedCoupon, 
  setAppliedCoupon,
  availableCoupons = [],
  subTotalAmount = 0,    
  formatPrice            
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedCoupon, setTempSelectedCoupon] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedCoupon(appliedCoupon);
    }
  }, [isModalOpen, appliedCoupon]);

const handleApplyManualCode = () => {
  if (!couponInput.trim()) return;

  const code = couponInput.trim().toUpperCase();

  const foundCoupon = availableCoupons.find(
    c => c.code.toUpperCase() === code
  );

  if (!foundCoupon) {
    alert('Mã giảm giá không tồn tại hoặc không khả dụng.');
    return;
  }

  if (foundCoupon.isUsed) {
    alert('Bạn đã sử dụng mã giảm giá này rồi.');
    return;
  }

  if (foundCoupon.isOutOfStock) {
    alert('Mã giảm giá này đã hết lượt sử dụng.');
    return;
  }

  const now = new Date();

  if (
    new Date(foundCoupon.startDate) > now ||
    new Date(foundCoupon.endDate) < now ||
    !foundCoupon.isActive
  ) {
    alert('Mã giảm giá hiện không còn hiệu lực.');
    return;
  }

  const minOrder = Number(foundCoupon.minOrderAmount);

  if (subTotalAmount < minOrder) {
    alert(
      `Mã này yêu cầu đơn hàng tối thiểu từ ${formatPrice(minOrder)}`
    );
    return;
  }

  setTempSelectedCoupon(code);
  setAppliedCoupon(code);
  setIsModalOpen(false);
};

  const handleCancelVoucher = () => {
    setCouponInput('');
    setAppliedCoupon('');
    setTempSelectedCoupon('');
  };

  const handleConfirmSelection = () => {
    setAppliedCoupon(tempSelectedCoupon);
    setCouponInput(tempSelectedCoupon);
    setIsModalOpen(false);
  };

  const formatDateShopee = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const modalFooter = (
    <div className="w-full flex justify-between items-center px-1">
      <div className="text-xs text-gray-700">
        {tempSelectedCoupon ? (
          <span>1 Voucher đã được chọn</span>
        ) : (
          <span className="text-gray-400">Chưa chọn Voucher nào</span>
        )}
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="text-gray-600 px-6 py-2 border-gray-300 hover:bg-gray-50 uppercase text-xs font-semibold tracking-wider rounded-sm"
          onClick={() => setIsModalOpen(false)}
        >
          TRỞ LẠI
        </Button>
        <Button 
          variant="danger" 
          className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-8 py-2 font-semibold uppercase text-xs tracking-wider rounded-sm shadow-sm"
          onClick={handleConfirmSelection}
        >
          ĐỒNG Ý
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold text-gray-700">Mã giảm giá (Coupon)</h3>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Chọn Mã Giảm Giá
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ví dụ: GIAM20K"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          disabled={!!appliedCoupon}
          className="flex-1 text-xs px-4 py-2 bg-gray-50 border border-gray-300 rounded focus:bg-white outline-none focus:border-[#ee4d2d] disabled:bg-gray-100 uppercase font-medium"
        />
        {!appliedCoupon ? (
          <Button variant="outline" size="sm" onClick={handleApplyManualCode} disabled={!couponInput.trim()} className="rounded">
            Áp dụng
          </Button>
        ) : (
          <Button variant="danger" size="sm" className="bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded" onClick={handleCancelVoucher}>
            Hủy
          </Button>
        )}
      </div>

      {appliedCoupon && (
        <p className="text-xs text-emerald-600 font-semibold text-left mt-2 flex items-center gap-1">
          ✓ Đã áp dụng thành công mã: <span className="underline font-bold text-xs">{appliedCoupon}</span>
        </p>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={<span className="text-gray-800 font-normal text-sm">Chọn Shopee Voucher</span>} 
        size="lg"
        footer={modalFooter}
        className="bg-[#f5f5f5]" 
      >
        <div className="-mx-6 -mt-5 flex flex-col h-full bg-[#f5f5f5]">
          
          <div className="bg-[#f8f8f8] p-4 flex items-center gap-4 border-b border-gray-100 shadow-sm z-10">
            <span className="text-xs font-normal text-gray-700 whitespace-nowrap">
              Mã Voucher
            </span>
            <input 
              type="text" 
              placeholder="Mã Shopee Voucher" 
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2.5 border border-gray-300 rounded-sm outline-none focus:border-[#ee4d2d] uppercase bg-white placeholder:text-gray-300"
            />
          <button
            onClick={handleApplyManualCode}
            disabled={!couponInput.trim()}
            className={`px-6 py-2.5 rounded-sm text-xs font-normal transition ${
              couponInput.trim()
                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-gray-50 text-gray-300 border border-gray-200 cursor-not-allowed'
            }`}
          >
            ÁP DỤNG
          </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-4 max-h-[50vh]">
            <h4 className="text-xs font-normal text-gray-700 mb-1">Mã Khuyến Mãi Khả Dụng</h4>
            
            {availableCoupons.length === 0 ? (
              <div className="text-center py-10 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-400">Không tìm thấy mã giảm giá nào phù hợp.</p>
              </div>
            ) : (
              availableCoupons.map((coupon) => {
                const code = coupon.code;
                const type = coupon.discountType;
                const value = Number(coupon.discountValue);
                const minOrder = Number(coupon.minOrderAmount);
                const maxDiscount = Number(coupon.maxDiscountAmount);
                const endDate = coupon.endDate;
                const isUsed = coupon.isUsed; 
                const isOutOfStock = coupon.isOutOfStock;

                let discountTitle = '';
                if (type?.toUpperCase() === 'PERCENTAGE') {
                  discountTitle = `Giảm ${value}%`;
                  if (maxDiscount > 0) {
                    discountTitle += ` Giảm tối đa ${formatPrice(maxDiscount)}`;
                  }
                } else {
                  discountTitle = `Giảm ${formatPrice(value)}`;
                }

                const isEligible = subTotalAmount >= minOrder;
                const canSelect = isEligible && !isUsed && !isOutOfStock; 
                
                const isSelected = tempSelectedCoupon === code;

                return (
                  <div key={coupon.id} className="bg-white rounded-sm overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.05)] border border-gray-200/80">
                    <div 
                      onClick={() => canSelect && setTempSelectedCoupon(code)}
                      className={`flex min-h-[105px] relative transition-all ${
                        canSelect ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-[115px] flex flex-col items-center justify-center text-white border-r border-dashed border-gray-200 relative z-0 shrink-0 ${
                        canSelect ? 'bg-[#ee4d2d]' : 'bg-gray-400'
                      }`}>
                        <div className="absolute -left-1 top-0 bottom-0 w-2 flex flex-col justify-between overflow-hidden">
                           {[...Array(7)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#f5f5f5] rounded-full -ml-0.5"></div>)}
                        </div>
                        
                        <div className="w-11 h-11 border border-white/60 rounded-sm flex flex-col items-center justify-center mb-1 bg-white/10">
                          <span className="text-[10px] font-bold tracking-tighter leading-none">FASHION</span>
                          <span className="text-[10px] font-bold tracking-tighter leading-none mt-0.5">HUB</span>
                        </div>
                        <span className="text-[9px] font-light tracking-wide opacity-90 truncate max-w-[90%]">{code}</span>
                      </div>

                      <div className="flex-1 p-3.5 pl-4 flex items-center justify-between relative bg-white">
                        <div className="flex flex-col h-full justify-center pr-2">
                          <h5 className="font-normal text-gray-800 text-[15px] leading-snug line-clamp-2">{discountTitle}</h5>
                          <p className="text-gray-500 text-xs mt-1">Đơn Tối Thiểu {formatPrice(minOrder)}</p>
                          <div className="flex items-center gap-2 mt-2.5 text-[11px] text-gray-400">
                            <span>HSD: {formatDateShopee(endDate)}</span>
                            <span className="text-blue-500 hover:underline cursor-pointer">Điều Kiện</span>
                          </div>
                        </div>

                        <div className="pl-2 pr-1 flex items-center shrink-0">
                          <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#ee4d2d] bg-[#ee4d2d]' : 'border-gray-300 bg-white'
                          } ${!canSelect ? 'opacity-30' : ''}`}>
                            {isSelected && (
                              <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isUsed ? (
                      <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2 flex justify-center items-center border-t border-gray-200">
                        Bạn đã sử dụng mã giảm giá này.
                      </div>
                    ) : isOutOfStock ? (
                      <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2 flex justify-center items-center border-t border-gray-200">
                        Mã giảm giá này đã hết lượt sử dụng.
                      </div>
                    ) : !isEligible ? (
                      <div className="bg-[#fff8e4] text-[#ee4d2d] text-xs px-4 py-2 flex justify-between items-center border-t border-orange-100/70">
                        <span className="flex items-center gap-1">
                          ⚠️ Mua thêm {formatPrice(minOrder - subTotalAmount)} để sử dụng Voucher
                        </span>
                        <span className="font-medium hover:underline flex items-center cursor-pointer text-orange-700">
                          Mua Thêm &gt;
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CouponSection;