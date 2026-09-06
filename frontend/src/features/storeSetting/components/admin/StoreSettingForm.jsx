import React from 'react';
import Input from '../../../../shared/components/Input';
import ImageUpload from '../../../../shared/components/ImageUpload';

const StoreSettingForm = ({
  form,
  handleChange,
  handleLogoChange,
  saving
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          id="storeName"
          name="storeName"
          label="Tên cửa hàng"
          required
          value={form.storeName}
          onChange={handleChange}
          placeholder="FashionHub"
        />

        <Input
          id="hotline"
          name="hotline"
          label="Hotline"
          value={form.hotline}
          onChange={handleChange}
          placeholder="0901234567"
        />

        <Input
          id="zalo"
          name="zalo"
          label="Zalo"
          value={form.zalo}
          onChange={handleChange}
          placeholder="0901234567"
        />

        <Input
          id="email"
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          placeholder="fashionhub@gmail.com"
        />

        <Input
          id="openingHours"
          name="openingHours"
          label="Giờ mở cửa"
          value={form.openingHours}
          onChange={handleChange}
          placeholder="08:00 - 22:00"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Địa chỉ cửa hàng
        </label>

        <textarea
          name="address"
          rows={3}
          value={form.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ cửa hàng..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Mô tả cửa hàng
        </label>

        <textarea
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          placeholder="Giới thiệu ngắn về cửa hàng..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <ImageUpload
        label="Logo cửa hàng"
        initialImage={form.logoUrl}
        onChange={handleLogoChange}
        isUploading={saving}
        helperText="Logo sẽ hiển thị trên Header, Footer, Email và trang giới thiệu. Khuyến nghị ảnh vuông 300x300 hoặc 500x500."
        imageClassName="w-40 h-40"
        className="max-w-lg"
      />

    </div>
  );
};

export default StoreSettingForm;