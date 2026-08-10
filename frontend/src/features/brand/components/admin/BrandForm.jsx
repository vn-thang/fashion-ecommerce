import React from 'react';
import Input from '../../../../shared/components/Input';
import ImageUpload from '../../../../shared/components/ImageUpload';

const BrandForm = ({ form, setForm, error }) => {
  return (
    <div className="space-y-5 py-2">
      <Input
        id="brand-name"
        label="Tên thương hiệu"
        placeholder="Ví dụ: Apple, Samsung, Sony..."
        required={true}
        value={form.name}
        error={error?.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <ImageUpload
        label="Logo thương hiệu"
        required={true}
        initialImage={form.logoPreview} 
        error={error?.logo}
        onChange={(file) => setForm({ ...form, logoFile: file })} 
      />
    </div>
  );
};

export default BrandForm;