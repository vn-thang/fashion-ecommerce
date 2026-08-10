import React from 'react';
import BannerCard from './BannerCard';

const BannerList = ({
  banners,
  onEdit,
  onDelete,
  onPreview
}) => {

  if (banners.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">

        <div className="text-6xl mb-4">
          🖼️
        </div>

        <h2 className="text-xl font-bold text-slate-700">
          Chưa có Banner nào
        </h2>

        <p className="text-gray-500 mt-2">
          Hãy thêm banner đầu tiên cho cửa hàng.
        </p>

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {banners.map((banner) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
        />
      ))}

    </div>
  );
};

export default BannerList;