import React from 'react';

const ProductGallery = ({ product, activeImage, setActiveImage }) => {
  const allImages = [product.thumbnailUrl, ...(product.images?.map(i => i.imageUrl || i.url) || [])].filter(Boolean);

  return (
    <div className="w-full md:w-[40%] shrink-0">
      <div className="w-full aspect-square border border-gray-200 mb-4 rounded-sm overflow-hidden bg-gray-50">
        <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
        {allImages.map((img, idx) => (
          <div 
            key={idx}
            onMouseEnter={() => setActiveImage(img)}
            className={`w-20 h-20 shrink-0 border-2 cursor-pointer rounded-sm bg-gray-50 transition-all ${
              activeImage === img ? 'border-[#ee4d2d]' : 'border-transparent hover:border-[#ee4d2d]'
            }`}
          >
            <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;