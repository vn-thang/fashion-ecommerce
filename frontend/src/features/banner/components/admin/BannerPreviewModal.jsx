import React from 'react';
import Modal from '../../../../shared/components/Modal';

const BannerPreviewModal = ({
  isOpen,
  onClose,
  banner
}) => {
  if (!banner) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      title={banner.title}
    >
      <div className="w-full aspect-[16/6] overflow-hidden rounded-xl border bg-gray-100">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-6 space-y-3">
        <div>
          <h2 className="font-bold text-xl">
            {banner.title}
          </h2>
        </div>

        <p className="text-gray-600">
          {banner.description}
        </p>

        <div className="flex gap-3">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">
            Thứ tự: {banner.displayOrder}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm ${
              banner.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {banner.isActive
              ? 'Đang hiển thị'
              : 'Đã ẩn'}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default BannerPreviewModal;