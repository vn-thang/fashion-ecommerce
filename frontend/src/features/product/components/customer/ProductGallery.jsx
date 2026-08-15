import React, { useEffect, useState } from 'react';
import ProductImageZoom from './ProductImageZoom';

const ProductGallery = ({
  product,
  activeImage,
  setActiveImage
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // =========================
  // PRODUCT IMAGES
  // =========================
  const productImages =
    product.images
      ?.slice()
      .sort(
        (a, b) =>
          (a.displayOrder ?? 0) -
          (b.displayOrder ?? 0)
      )
      .map((image) => image.imageUrl || image.url)
      .filter(Boolean) || [];

  const allImages = [
    product.thumbnailUrl,
    ...productImages
  ].filter(Boolean);

  // =========================
  // IMAGE ĐANG HIỂN THỊ
  // =========================
  const currentImage =
    activeImage || allImages[0];

  // =========================
  // ĐẢM BẢO ACTIVE IMAGE HỢP LỆ
  // =========================
  useEffect(() => {
    if (!activeImage && allImages.length > 0) {
      setActiveImage(allImages[0]);
    }
  }, [activeImage, allImages, setActiveImage]);

  // Không có ảnh
  if (!allImages.length) {
    return (
      <div className="w-full md:w-[50%]">
        <div
          className="
            aspect-square
            bg-gray-50
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-400
          "
        >
          Không có hình ảnh
        </div>
      </div>
    );
  }

  return (
    <>
      {/* =====================================
          GALLERY CONTAINER
      ====================================== */}
      <div className="w-full md:w-[50%] min-w-0">

        {/* =====================================
            MAIN IMAGE
        ====================================== */}
        <div
          className="
            relative
            w-full
            aspect-square
            bg-gray-50
            rounded-lg
            overflow-hidden
            cursor-zoom-in
            group
          "
          onClick={() => setIsZoomOpen(true)}
        >
          <img
            src={currentImage}
            alt={product.name}
            className="
              block
              w-full
              h-full
              object-contain
              transition-transform
              duration-300
            "
          />

          {/* Overlay khi hover */}
          <div
            className="
              absolute
              inset-0
              bg-black/0
              group-hover:bg-black/5
              transition-colors
              pointer-events-none
            "
          />

          {/* Nút / icon Zoom */}
          <div
            className="
              absolute
              bottom-4
              right-4
              px-3
              py-2
              rounded-lg
              bg-black/60
              text-white
              text-sm
              opacity-0
              group-hover:opacity-100
              transition-opacity
              pointer-events-none
            "
          >
            🔍 Phóng to
          </div>
        </div>

        {/* =====================================
            THUMBNAILS
        ====================================== */}
        <div
          className="
            flex
            gap-3
            overflow-x-auto
            custom-scrollbar
            pb-2
            mt-4
          "
        >
          {allImages.map((img, idx) => {
            const isActive = currentImage === img;

            return (
              <button
                type="button"
                key={`${img}-${idx}`}
                onClick={() => setActiveImage(img)}
                className={`
                  w-20
                  h-20
                  md:w-20
                  md:h-20
                  shrink-0
                  overflow-hidden
                  rounded-md
                  border-2
                  bg-gray-50
                  transition-all
                  ${
                    isActive
                      ? 'border-[#ee4d2d]'
                      : 'border-transparent hover:border-[#ee4d2d]'
                  }
                `}
              >
                <img
                  src={img}
                  alt={`${product.name} - ${idx + 1}`}
                  className="
                    block
                    w-full
                    h-full
                    object-cover
                  "
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================
          ZOOM MODAL
      ====================================== */}
      {isZoomOpen && (
        <ProductImageZoom
          image={currentImage}
          onClose={() => setIsZoomOpen(false)}
        />
      )}
    </>
  );
};

export default ProductGallery;