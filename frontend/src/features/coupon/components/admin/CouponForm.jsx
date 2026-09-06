import React from 'react';
import Input from '../../../../shared/components/Input';

const CouponForm = ({ form, setForm }) => {
  return (
    <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto px-1">
      <Input
        id="coupon-code"
        label="Mã Code (Tự động in hoa)"
        placeholder="VD: TET2024, SIEUSALE..."
        required={true}
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">Loại giảm giá</label>
          <select
            className="w-full text-xs outline-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          >
            <option value="PERCENTAGE">Giảm theo Phần trăm (%)</option>
            <option value="FIXED">Giảm Cố định (VNĐ)</option>
          </select>
        </div>

        <Input
          id="discount-value"
          type="number"
          label={form.discountType === 'PERCENTAGE' ? "Mức giảm (%)" : "Mức giảm (VNĐ)"}
          required={true}
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="min-order"
          type="number"
          label="Đơn tối thiểu (VNĐ)"
          value={form.minOrderAmount}
          onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
        />
        <Input
          id="max-discount"
          type="number"
          label="Giảm tối đa (VNĐ)"
          disabled={form.discountType === 'FIXED'} 
          value={form.discountType === 'FIXED' ? form.discountValue : form.maxDiscountAmount}
          onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
        />
      </div>

      <Input
        id="usage-limit"
        type="number"
        label="Tổng số lượt sử dụng"
        required={true}
        value={form.usageLimit}
        onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="start-date"
          type="datetime-local"
          label="Thời gian bắt đầu"
          required={true}
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <Input
          id="end-date"
          type="datetime-local"
          label="Thời gian kết thúc"
          required={true}
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="is-active"
          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        <label htmlFor="is-active" className="text-xs font-medium text-gray-700">
          Kích hoạt ngay (Có thể sử dụng)
        </label>
      </div>
    </div>
  );
};

export default CouponForm;