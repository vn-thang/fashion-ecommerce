import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const ProductImageZoom = ({ image, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!image) {
    return null;
  }

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        bg-black/90
        flex
        items-center
        justify-center
      "
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="
          absolute
          top-5
          right-5
          z-20
          w-11
          h-11
          rounded-full
          bg-white/10
          hover:bg-white/20
          text-white
          text-2xl
          flex
          items-center
          justify-center
          transition
        "
        aria-label="Đóng ảnh"
      >
        ×
      </button>
      <div
        className="
          w-[90vw]
          h-[90vh]
          flex
          items-center
          justify-center
        "
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={image}
          alt="Product preview"
          className="
            w-full
            h-full
            object-contain
            rounded-lg
            select-none
          "
        />
      </div>
    </div>,
    document.body
  );
};

export default ProductImageZoom;