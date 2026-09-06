import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';
import ImageUpload from '../../../../shared/components/ImageUpload';

const BannerForm = ({
  isOpen,
  onClose,
  form,
  handleChange,
  handleImageChange,
  handleSubmit,
  editingBanner,
  saving
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        editingBanner
          ? 'Cập nhật Banner'
          : 'Thêm Banner'
      }
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>

          <Button
            onClick={handleSubmit}
            isLoading={saving}
          >
            {editingBanner
              ? 'Cập nhật'
              : 'Thêm Banner'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        <ImageUpload
          label="Ảnh Banner"
          initialImage={form.imageUrl}
          onChange={handleImageChange}
          isUploading={saving}
          imageClassName="w-full h-56 object-cover"
          helperText="Khuyến nghị ảnh 1600 x 500"
        />

        <Input
          label="Tiêu đề"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <div>

          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Mô tả
          </label>

          <textarea
            rows={4}
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

        </div>

        <div className="grid grid-cols-2 gap-6">

          <Input
            type="number"
            label="Thứ tự hiển thị"
            name="displayOrder"
            value={form.displayOrder}
            onChange={handleChange}
          />

          <div className="flex items-end">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-5 h-5"
              />

              <span className="font-medium">
                Hiển thị Banner
              </span>

            </label>

          </div>

        </div>

      </div>
    </Modal>
  );
};

export default BannerForm;