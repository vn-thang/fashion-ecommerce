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
  <aside className="w-full shrink-0 md:w-[220px] lg:w-[230px]">
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Bộ lọc tìm kiếm
        </h2>
      </div>

      <div className="border-b border-gray-100 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            Danh mục
          </h3>

          {isFilteringByParent && (
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-[#ee4d2d] transition-colors hover:underline"
            >
              Tất cả
            </button>
          )}
        </div>

        {isFilteringByParent && (
          <div className="mb-3 flex items-center gap-1.5 rounded-md bg-orange-50 px-2.5 py-1.5">
            <span className="text-xs text-gray-500">Nhóm:</span>
            <span className="truncate text-xs font-medium text-[#ee4d2d]">
              {currentParentObj?.name}
            </span>
          </div>
        )}

        <ul className="space-y-2">
          {displayedCategories.length > 0 ? (
            displayedCategories.map(cat => {
              const catId = cat.id || cat._id;
              const isParentOnly =
                isFilteringByParent && childCategories.length === 0;

              return (
                <li key={catId}>
                  {isFilteringByParent && !isParentOnly ? (
                    <label className="group flex cursor-pointer select-none items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={
                          selectedCategories.includes(catId) ||
                          urlCategory === catId
                        }
                        onChange={() => handleCategoryChange(catId)}
                        className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-[#ee4d2d] focus:ring-2 focus:ring-orange-100"
                      />

                      <span className="text-sm text-gray-600 transition-colors group-hover:text-[#ee4d2d]">
                        {cat.name}
                      </span>
                    </label>
                  ) : (
                    <button
                      onClick={() =>
                        setSearchParams({ category: catId })
                      }
                      className="group flex w-full items-center gap-2 text-left text-sm text-gray-600 transition-colors hover:text-[#ee4d2d]"
                    >
                      <span className="text-gray-400 transition-colors group-hover:text-[#ee4d2d]">
                        ›
                      </span>

                      <span className="truncate">{cat.name}</span>
                    </button>
                  )}
                </li>
              );
            })
          ) : (
            <li>
              <p className="text-xs italic text-gray-400">
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
            className="mt-3 text-xs font-medium text-[#ee4d2d] transition-colors hover:text-[#d74123]"
          >
            {showAllCategories
              ? 'Thu gọn ↑'
              : `Xem thêm (${finalCategoriesToRender.length - 5}) ↓`}
          </button>
        )}
      </div>

      <div className="border-b border-gray-100 px-4 py-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">
          Thương hiệu
        </h3>

        <ul className="space-y-2">
          {brands.length > 0 ? (
            (showAllBrands ? brands : brands.slice(0, 5)).map(brand => {
              const brandId = brand._id || brand.id;

              return (
                <li key={brandId}>
                  <label className="group flex cursor-pointer select-none items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brandId)}
                      onChange={() => handleBrandChange(brandId)}
                      className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-[#ee4d2d] focus:ring-2 focus:ring-orange-100"
                    />

                    <span className="truncate text-sm text-gray-600 transition-colors group-hover:text-[#ee4d2d]">
                      {brand.name}
                    </span>
                  </label>
                </li>
              );
            })
          ) : (
            <li>
              <p className="text-xs italic text-gray-400">
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
            className="mt-3 text-xs font-medium text-[#ee4d2d] transition-colors hover:text-[#d74123]"
          >
            {showAllBrands
              ? 'Thu gọn ↑'
              : `Xem thêm (${brands.length - 5}) ↓`}
          </button>
        )}
      </div>

      <div className="border-b border-gray-100 px-4 py-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">
          Khoảng giá
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
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
              className="w-full rounded-md border border-gray-200 py-1.5 pl-5 pr-1.5 text-[11px] text-gray-700 outline-none transition-all focus:border-[#ee4d2d] focus:ring-1 focus:ring-orange-100"
            />
          </div>

          <span className="shrink-0 text-xs text-gray-300">
            —
          </span>

          <div className="relative min-w-0 flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
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
              className="w-full rounded-md border border-gray-200 py-1.5 pl-5 pr-1.5 text-[11px] text-gray-700 outline-none transition-all focus:border-[#ee4d2d] focus:ring-1 focus:ring-orange-100"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={handleApplyFilter}
          className="w-full rounded-md bg-[#ee4d2d] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#d74123]"
        >
          ÁP DỤNG
        </button>

        <button
          onClick={handleClearFilters}
          className="mt-2 w-full rounded-md border border-gray-200 bg-white py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          XÓA TẤT CẢ
        </button>
      </div>
    </div>
  </aside>
);
};

export default ProductFilter;
