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
  <div className="flex flex-col md:flex-row gap-5">
        <div className="flex flex-col md:flex-row gap-5">
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

          <main className="flex-1 min-w-0">
            <div className="bg-[#ededed] rounded-sm px-5 py-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-3 text-sm text-gray-600 w-full sm:w-auto">
                <span className="hidden md:inline font-medium">
                  Sắp xếp theo
                </span>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleSortToggle('newest')}
                    className={`px-5 py-2 rounded-sm flex-1 sm:flex-none transition-colors ${
                      sortBy === 'newest'
                        ? 'bg-[#ee4d2d] text-white shadow-sm'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Mới nhất
                  </button>

                  <button
                    onClick={() => handleSortToggle('bestSeller')}
                    className={`px-5 py-2 rounded-sm flex-1 sm:flex-none transition-colors ${
                      sortBy === 'bestSeller'
                        ? 'bg-[#ee4d2d] text-white shadow-sm'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Bán chạy nhất
                  </button>

                  <select
                    value={
                      sortBy === 'price_asc' ||
                      sortBy === 'price_desc'
                        ? sortBy
                        : 'default'
                    }
                    onChange={e =>
                      handleSortToggle(e.target.value)
                    }
                    className={`border rounded-sm px-4 py-2 outline-none cursor-pointer flex-1 sm:flex-none transition-colors ${
                      sortBy === 'price_asc' ||
                      sortBy === 'price_desc'
                        ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]'
                        : 'bg-white text-gray-800 border-transparent'
                    }`}
                  >
                    <option
                      value="default"
                      className="bg-white text-black"
                    >
                      Giá (Mặc định)
                    </option>
                    <option
                      value="price_asc"
                      className="bg-white text-black"
                    >
                      Giá: Thấp đến Cao
                    </option>
                    <option
                      value="price_desc"
                      className="bg-white text-black"
                    >
                      Giá: Cao đến Thấp
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ee4d2d]" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm p-16 text-center flex flex-col items-center">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-10">
                  {products.map(product => (
                    <ProductCard
                      key={product.id || product._id}
                      product={product}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-6">
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
    </div>
  );
};

export default CustomerHome;