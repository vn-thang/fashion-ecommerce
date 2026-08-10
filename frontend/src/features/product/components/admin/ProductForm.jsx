import React from 'react';
import Input from '../../../../shared/components/Input';
import ImageUpload from '../../../../shared/components/ImageUpload';

const ProductForm = ({ form, setForm, categories = [], brands = [], isEditing }) => {
  return (
    <div className="space-y-5 py-2">
      <Input
        id="product-name"
        label="Tên sản phẩm"
        placeholder="Nhập tên sản phẩm..."
        required={true}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
         <div className="w-full text-left space-y-1.5">
           <label className="block text-sm font-semibold text-gray-700">Danh mục <span className="text-red-500">*</span></label>
           <select
            className="w-full text-sm transition-all duration-200 outline-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full text-left space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Thương hiệu <span className="text-red-500">*</span></label>
          <select
            className="w-full text-sm transition-all duration-200 outline-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            value={form.brandId}
            onChange={(e) => setForm({ ...form, brandId: e.target.value })}
          >
             <option value="">-- Chọn thương hiệu --</option>
             {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Input
        id="product-desc"
        label="Mô tả tóm tắt"
        placeholder="Nhập mô tả sản phẩm..."
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

           <div className="grid grid-cols-2 gap-4">
         TRẠNG THÁI
         <div className="w-full text-left space-y-1.5">
           <label className="block text-sm font-semibold text-gray-700">Trạng thái</label>
           <select
            className="w-full text-sm transition-all duration-200 outline-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="ACTIVE">Hoạt động (Hiển thị)</option>
            <option value="INACTIVE">Đã ẩn (Nháp)</option>
          </select>
        </div>
        <ImageUpload
          label="Ảnh đại diện"
          required={!isEditing}
          initialImage={form.thumbnailPreview || ''} 
          onChange={(file) => 
            { console.log("FILE_SELECTED:", file);
            setForm({ ...form, thumbnail: file })}}
        />
      </div>
    </div>
  );
};

export default ProductForm;