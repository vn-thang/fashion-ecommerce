import React from 'react';
import ImageUpload from '../../../../shared/components/ImageUpload';
import { useProductImages } from '../../hooks/useProductImages';

const ProductImageGallery = ({ productId }) => {
  const {
    images,
    isLoading,
    isUploading,
    deletingImageId,
    uploadImages,
    deleteImage
  } = useProductImages(productId);

  return (
    <div>
      <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
        Ảnh đã tải lên ({images.length})
      </h4>

      <div className="mb-5">
        <ImageUpload
          multiple
          onChange={uploadImages}
          disabled={isUploading}
        />

        {isUploading && (
          <p className="mt-2 text-xs text-indigo-600">
            Đang tải ảnh lên...
          </p>
        )}
      </div>
      {isLoading ? (
        <div className="text-center p-6 text-gray-400">
          Đang tải danh sách ảnh...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center p-6 bg-slate-50 border border-gray-100 rounded-xl text-gray-400 text-xs italic">
          Chưa có ảnh nào trong album
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50"
            >
              <img
                src={img.imageUrl}
                alt="Product"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => deleteImage(img.id)}
                  disabled={deletingImageId === img.id}
                  className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 transition-colors shadow"
                  title="Xóa ảnh"
                >
                  {deletingImageId === img.id
                    ? '...'
                    : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;