import React from 'react';
import Button from '../../../../shared/components/Button';

const BannerCard = ({
  banner,
  onEdit,
  onDelete,
  onPreview
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">

      <div
        className="cursor-pointer"
        onClick={() => onPreview(banner)}
      >
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-52 object-cover"
        />
      </div>

      <div className="p-5 space-y-3">

        <div className="flex justify-between items-start">
          <div>

            <h3 className="font-bold text-sm text-slate-800">
              {banner.title || 'Không có tiêu đề'}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {banner.description || 'Không có mô tả'}
            </p>

          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              banner.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {banner.isActive ? 'Hiển thị' : 'Đã ẩn'}
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500">

          <span>
            Thứ tự: <b>{banner.displayOrder}</b>
          </span>

        </div>

        <div className="flex gap-2 pt-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(banner)}
          >
            Xem
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(banner)}
          >
            Sửa
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(banner)}
          >
            Xóa
          </Button>

        </div>

      </div>

    </div>
  );
};

export default BannerCard;