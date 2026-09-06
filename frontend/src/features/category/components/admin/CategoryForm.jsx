import React from 'react';
import Input from '../../../../shared/components/Input';

const CategoryForm = ({ form, setForm, categories = [], editingId }) => {
  return (
    <div className="space-y-5 py-2">
      <Input
        id="category-name"
        label="Tên danh mục sản phẩm"
        placeholder="Ví dụ: Điện thoại, Máy tính bảng..."
        required={true}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <div className="w-full text-left space-y-1.5">
        <label htmlFor="parent-category" className="block text-xs font-semibold text-gray-700">
          Danh mục cha (Tùy chọn)
        </label>
        <select
          id="parent-category"
          className="w-full text-xs transition-all duration-200 outline-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
          value={form.parentId || ''}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
        >
          <option value="">-- Không có (Làm danh mục gốc) --</option>
          
          {categories
            .filter(cat => cat.id !== editingId) 
            .map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="category-desc"
        label="Mô tả tóm tắt"
        placeholder="Nhập vài dòng mô tả ngắn về nhóm sản phẩm này..."
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </div>
  );
};

export default CategoryForm;