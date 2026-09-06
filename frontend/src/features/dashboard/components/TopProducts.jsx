import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';

const ProductSkeleton = () =>
  [...Array(5)].map((_, index) => (
    <div
      key={index}
      className="flex animate-pulse items-center gap-4 py-3"
    >
      <div className="h-16 w-16 rounded-lg bg-gray-200" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
      </div>

      <div className="space-y-2 text-right">
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>
    </div>
  ));

const TopProducts = ({
  products = [],
  loading
}) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Top 5 sản phẩm bán chạy
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sản phẩm có doanh số cao nhất trong khoảng thời gian đã chọn.
          </p>
        </div>

        <Package
          size={22}
          className="text-indigo-600"
        />
      </div>

      <div className="px-6 py-2">
        {loading ? (
          <ProductSkeleton />
        ) : products.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-gray-400">
            Không có dữ liệu.
          </div>
        ) : (
          products.map((item, index) => (
            <button
              key={item.productId}
              type="button"
              onClick={() =>
                navigate(`/admin/products`)
              }
              className="group flex w-full items-center gap-4 border-b border-gray-100 py-4 text-left transition last:border-none hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                {index + 1}
              </div>

              <img
                src={item.thumbnailUrl}
                alt={item.productName}
                className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 font-medium text-slate-800 transition group-hover:text-indigo-600">
                  {item.productName}
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {item.brand} · {item.color} · Size {item.size}
                </p>
              </div>

              <div className="hidden text-right md:block">
                <div className="font-semibold text-slate-800">
                  {item.soldQuantity} sản phẩm
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-500"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProducts;