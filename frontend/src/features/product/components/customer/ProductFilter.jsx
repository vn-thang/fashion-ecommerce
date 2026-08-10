import React from 'react';

const ProductFilter = ({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  setPriceRange,
  handleCategoryChange,
  handleBrandChange,
  handleApplyFilter,
  handleClearFilters,
  urlCategory,
  activeParentId,
  setSearchParams
}) => {
  const [showAllCategories, setShowAllCategories] = React.useState(false);
  const [showAllBrands, setShowAllBrands] = React.useState(false);

const currentParentObj = categories.find(
  c => (c.id || c._id) === activeParentId
);

const parentCategories = categories.filter(
  c => !c.parentId
);

const childCategories = categories.filter(
  c => c.parentId === activeParentId
);

const isFilteringByParent = Boolean(
  activeParentId && currentParentObj
);

const finalCategoriesToRender = isFilteringByParent
  ? childCategories.length > 0
    ? childCategories
    : [currentParentObj]
  : parentCategories;

const displayedCategories = showAllCategories
  ? finalCategoriesToRender
  : finalCategoriesToRender.slice(0, 5);

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <span className="text-base">⚙️</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Bộ lọc tìm kiếm
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Lọc sản phẩm theo nhu cầu
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Danh mục
            </h3>
            {isFilteringByParent && (
              <button
                onClick={() => setSearchParams({})}
                className="text-xs text-[#ee4d2d] hover:underline transition-colors"
              >
                Tất cả
              </button>
            )}
          </div>

          {isFilteringByParent && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-orange-50 rounded-md">
              <span className="text-xs text-gray-500">
                Nhóm:
              </span>
              <span className="text-xs font-medium text-[#ee4d2d] truncate">
                {currentParentObj?.name}
              </span>
            </div>
          )}

          <ul className="space-y-2.5">
           {displayedCategories.length > 0 ? (
            displayedCategories.map(cat => {
              const catId = cat.id || cat._id;
              const isParentOnly =
                isFilteringByParent && childCategories.length === 0;

              return (
                <li key={catId}>
                  {isFilteringByParent && !isParentOnly ? (
                    <label className="group flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={
                          selectedCategories.includes(catId) ||
                          urlCategory === catId
                        }
                        onChange={() => handleCategoryChange(catId)}
                        className="w-4 h-4 rounded border-gray-300 text-[#ee4d2d] focus:ring-2 focus:ring-orange-100 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-[#ee4d2d] transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ) : (
                    <button
                      onClick={() =>
                        setSearchParams({ category: catId })
                      }
                      className="group flex items-center gap-2.5 w-full text-left text-sm text-gray-600 hover:text-[#ee4d2d] transition-colors"
                    >
                      <span className="text-gray-400 group-hover:text-[#ee4d2d] transition-colors">
                        ›
                      </span>
                      <span>{cat.name}</span>
                    </button>
                  )}
                </li>
              );
            })
          ) : (
            <li className="py-2">
              <p className="text-xs text-gray-400 italic">
                Không có danh mục phù hợp
              </p>
            </li>
          )}
          </ul>

          {finalCategoriesToRender.length > 5 && (
            <button
              type="button"
              onClick={() =>
                setShowAllCategories(prev => !prev)
              }
              className="mt-4 text-xs font-medium text-[#ee4d2d] hover:text-[#d74123] transition-colors"
            >
              {showAllCategories
                ? 'Thu gọn ↑'
                : `Xem thêm (${finalCategoriesToRender.length - 5}) ↓`}
            </button>
          )}
        </div>

        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Thương hiệu
            </h3>
          </div>

          <ul className="space-y-2.5">
            {brands.length > 0 ? (
              (showAllBrands
                ? brands
                : brands.slice(0, 5)
              ).map(brand => {
                const brandId = brand._id || brand.id;

                return (
                  <li key={brandId}>
                    <label className="group flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brandId)}
                        onChange={() =>
                          handleBrandChange(brandId)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-[#ee4d2d] focus:ring-2 focus:ring-orange-100 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-[#ee4d2d] transition-colors truncate">
                        {brand.name}
                      </span>
                    </label>
                  </li>
                );
              })
            ) : (
              <li className="py-2">
                <p className="text-xs text-gray-400 italic">
                  Đang tải...
                </p>
              </li>
            )}
          </ul>

          {brands.length > 5 && (
            <button
              type="button"
              onClick={() =>
                setShowAllBrands(prev => !prev)
              }
              className="mt-4 text-xs font-medium text-[#ee4d2d] hover:text-[#d74123] transition-colors"
            >
              {showAllBrands
                ? 'Thu gọn ↑'
                : `Xem thêm (${brands.length - 5}) ↓`}
            </button>
          )}
        </div>

        <div className="px-5 py-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Khoảng giá
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                ₫
              </span>
              <input
                type="number"
                min="0"
                placeholder="Từ"
                value={priceRange.min}
                onChange={e =>
                  setPriceRange({
                    ...priceRange,
                    min: e.target.value
                  })
                }
                className="w-full border border-gray-200 rounded-md pl-6 pr-2 py-2 text-xs text-gray-700 outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-orange-100 transition-all"
              />
            </div>

            <span className="text-gray-300">—</span>

            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                ₫
              </span>
              <input
                type="number"
                min="0"
                placeholder="Đến"
                value={priceRange.max}
                onChange={e =>
                  setPriceRange({
                    ...priceRange,
                    max: e.target.value
                  })
                }
                className="w-full border border-gray-200 rounded-md pl-6 pr-2 py-2 text-xs text-gray-700 outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-orange-100 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <button
            onClick={handleApplyFilter}
            className="w-full bg-[#ee4d2d] hover:bg-[#d74123] text-white py-2.5 rounded-md text-sm font-semibold shadow-sm hover:shadow transition-all"
          >
            ÁP DỤNG
          </button>

          <button
            onClick={handleClearFilters}
            className="w-full mt-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 py-2.5 rounded-md text-sm font-medium transition-all"
          >
            XÓA TẤT CẢ
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilter;
