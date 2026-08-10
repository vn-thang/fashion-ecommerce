import React, { useEffect, useRef, useState } from 'react';
import Input from '../../../../shared/components/Input';

const VariantSelector = ({
  value,
  keyword = '',
  variants = [],
  loading = false,
  onKeywordChange,
  onChange
}) => {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchKeyword = keyword ?? '';

  const selectedVariant = variants.find(
    item => item.id === value
  );

  useEffect(() => {
    const handleClickOutside = e => {
    if (
    wrapperRef.current &&
    !wrapperRef.current.contains(e.target)
) {
    setIsOpen(false);

    if (selectedVariant) {
        onKeywordChange(
            `${selectedVariant.product.name} (${selectedVariant.sku})`
        );
    }
}
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, [selectedVariant, onKeywordChange]);

  return (
    <div
      className="relative"
      ref={wrapperRef}
    >
     <Input
    label="Sản phẩm"
    value={searchKeyword}
    placeholder="Nhập tên sản phẩm hoặc SKU..."
    onFocus={() => setIsOpen(true)}
    onChange={e => {
        setIsOpen(true);

        onKeywordChange(e.target.value);
        onChange('');
    }}
/>

      {isOpen && searchKeyword.trim() !== '' && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto z-50">

          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Đang tìm kiếm...
            </div>
          ) : variants.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Không tìm thấy sản phẩm.
            </div>
          ) : (
            variants.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                onChange(item.id);

                onKeywordChange(
                    `${item.product.name} (${item.sku})`
                );

                setIsOpen(false);
            }}
                className="w-full px-4 py-3 text-left hover:bg-indigo-50 transition border-b border-gray-100 last:border-b-0"
              >
                <div className="flex gap-3">
                  <img
                    src={
                      item.product.thumbnailUrl ||
                      '/placeholder.png'
                    }
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover border"
                    onError={e => {
                      e.target.src = '/placeholder.png';
                    }}
                  />

                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {item.product.name}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      SKU: {item.sku}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.color} • {item.size}
                    </div>

                    <div className="text-xs text-emerald-600 font-semibold mt-1">
                      Tồn kho: {item.stockQuantity}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}

        </div>
      )}
    </div>
  );
};

export default VariantSelector;