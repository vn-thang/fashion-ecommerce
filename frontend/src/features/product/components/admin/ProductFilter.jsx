import React from 'react';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

const ProductFilter = ({
  filters,
  categories,
  brands,
  onChange,
  onSearch
}) => {
  const renderCategories = items => {
    return items.map(item => (
      <React.Fragment key={item.id}>
        <option value={item.id}>
          {item.parentId ? `— ${item.name}` : item.name}
        </option>

        {item.children?.length > 0 &&
          renderCategories(item.children)}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

        <Input
          label="Tìm kiếm"
          name="keyword"
          value={filters.keyword}
          onChange={onChange}
          placeholder="Tên sản phẩm..."
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Danh mục
          </label>

          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Tất cả
            </option>

            {renderCategories(categories)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Thương hiệu
          </label>

          <select
            name="brandId"
            value={filters.brandId}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Tất cả
            </option>

            {brands.map(item => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Trạng thái
          </label>

          <select
            name="status"
            value={filters.status}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Tất cả
            </option>

            <option value="ACTIVE">
              Đang bán
            </option>

            <option value="INACTIVE">
              Ngừng bán
            </option>
          </select>
        </div>

        <div className="flex items-end">
          <Button
            className="w-full"
            onClick={onSearch}
          >
            Tìm kiếm
          </Button>
        </div>

      </div>

    </div>
  );
};

export default ProductFilter;