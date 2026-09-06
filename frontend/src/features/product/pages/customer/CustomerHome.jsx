import React from 'react';
import { useCustomerHome } from '../../hooks/useCustomerHome';
import ProductCard from '../../components/customer/ProductCard';
import ProductFilter from '../../components/customer/ProductFilter';
import Pagination from '../../../../shared/components/Pagination';

const CustomerHome = () => {
  const {
    products,
    categories,
    brands,
    isLoading,
    sortBy,
    handleSortToggle,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedCategories,
    handleCategoryChange,
    selectedBrands,
    handleBrandChange,
    priceRange,
    setPriceRange,
    handleApplyFilter,
    handleClearFilters,
    urlCategory,
    activeParentId,
    setSearchParams
  } = useCustomerHome();

return (
  <div className="w-full">
   <div className="flex flex-col gap-6 md:flex-row">
  <aside className="w-full shrink-0 md:w-[220px] lg:w-[230px]">
    <ProductFilter
      categories={categories}
      brands={brands}
      selectedCategories={selectedCategories}
      selectedBrands={selectedBrands}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      handleCategoryChange={handleCategoryChange}
      handleBrandChange={handleBrandChange}
      handleApplyFilter={handleApplyFilter}
      handleClearFilters={handleClearFilters}
      urlCategory={urlCategory}
      activeParentId={activeParentId}
      setSearchParams={setSearchParams}
    />
  </aside>

  <main className="min-w-0 flex-1">
        <div className="mb-6 rounded-sm bg-[#ededed] px-3 py-3 shadow-sm sm:px-5 sm:py-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <span className="hidden shrink-0 text-sm font-medium text-gray-600 md:inline">
              Sắp xếp theo
            </span>

            <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto">
              <button
                onClick={() => handleSortToggle('newest')}
                className={`rounded-sm px-2 py-2 text-xs transition-colors sm:px-5 sm:text-sm ${
                  sortBy === 'newest'
                    ? 'bg-[#ee4d2d] text-white shadow-sm'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                Mới nhất
              </button>

              <button
                onClick={() => handleSortToggle('bestSeller')}
                className={`rounded-sm px-2 py-2 text-xs transition-colors sm:px-5 sm:text-sm ${
                  sortBy === 'bestSeller'
                    ? 'bg-[#ee4d2d] text-white shadow-sm'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="sm:hidden">Bán chạy</span>
                <span className="hidden sm:inline">Bán chạy nhất</span>
              </button>

               <button
              onClick={() => handleSortToggle('highestRated')}
              className={`rounded-sm px-2 py-2 text-xs transition-colors sm:px-5 sm:text-sm ${
                sortBy === 'highestRated'
                  ? 'bg-[#ee4d2d] text-white shadow-sm'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
              >
                <span className="sm:hidden">Đánh giá</span>
                <span className="hidden sm:inline">Đánh giá cao</span>
              </button>

              <select
                value={
                  sortBy === 'price_asc' || sortBy === 'price_desc'
                    ? sortBy
                    : 'default'
                }
                onChange={e => handleSortToggle(e.target.value)}
                className={`min-w-0 rounded-sm border px-2 py-2 text-xs outline-none transition-colors sm:px-4 sm:text-sm ${
                  sortBy === 'price_asc' || sortBy === 'price_desc'
                    ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white'
                    : 'border-transparent bg-white text-gray-800'
                }`}
              >
                <option value="default">Giá</option>
                <option value="price_asc">Thấp → Cao</option>
                <option value="price_desc">Cao → Thấp</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#ee4d2d]" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center rounded-sm bg-white p-8 text-center shadow-sm sm:p-16">
            <p className="text-sm text-gray-500 sm:text-lg">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
          </div>
        ) : (
          <>
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <ProductCard
              key={product.id || product._id}
              product={product}
            />
          ))}
        </div>

            <div className="mt-6 flex justify-center overflow-x-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </main>
    </div>
  </div>
);
};

export default CustomerHome;