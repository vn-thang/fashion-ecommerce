import React from 'react';
import Button from '../../../../shared/components/Button';

const ReviewHeader = ({
  totalCount = 0,
  filters,
  onFilterChange,
  onSearch,
  onReset
}) => {
  return (
    <div className="space-y-5 border-b border-gray-200/60 pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Quản lý Đánh giá
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Theo dõi, ẩn/hiện hoặc phản hồi đánh giá của
          khách hàng ({totalCount} đánh giá).
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Tìm kiếm
            </label>

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                />
              </svg>

              <input
                type="text"
                value={filters.search}
                onChange={e =>
                  onFilterChange(
                    'search',
                    e.target.value
                  )
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    onSearch();
                  }
                }}
                placeholder="Tên khách hàng, email, sản phẩm..."
                className="
                  h-10 w-full rounded-lg border border-gray-300
                  bg-white pl-9 pr-3 text-sm text-slate-700
                  outline-none transition
                  placeholder:text-gray-400
                  focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-100
                "
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Số sao
            </label>

            <select
              value={filters.rating}
              onChange={e =>
                onFilterChange(
                  'rating',
                  e.target.value
                )
              }
              className="
                h-10 w-full rounded-lg border border-gray-300
                bg-white px-3 text-sm text-slate-700
                outline-none transition
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-100
              "
            >
              <option value="">Tất cả số sao</option>
              <option value="5">★★★★★ 5 sao</option>
              <option value="4">★★★★ 4 sao</option>
              <option value="3">★★★ 3 sao</option>
              <option value="2">★★ 2 sao</option>
              <option value="1">★ 1 sao</option>
            </select>
          </div>

          {/* STATUS */}

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Trạng thái
            </label>

            <select
              value={filters.status}
              onChange={e =>
                onFilterChange(
                  'status',
                  e.target.value
                )
              }
              className="
                h-10 w-full rounded-lg border border-gray-300
                bg-white px-3 text-sm text-slate-700
                outline-none transition
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-100
              "
            >
              <option value="">
                Tất cả trạng thái
              </option>

              <option value="REPLIED">
                Đã trả lời
              </option>

              <option value="NOT_REPLIED">
                Chưa trả lời
              </option>

              <option value="VISIBLE">
                Đang hiển thị
              </option>

              <option value="HIDDEN">
                Đã ẩn
              </option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Từ ngày
            </label>

            <input
              type="date"
              value={filters.fromDate}
              onChange={e =>
                onFilterChange(
                  'fromDate',
                  e.target.value
                )
              }
              className="
                h-10 w-full rounded-lg border border-gray-300
                bg-white px-3 text-sm text-slate-700
                outline-none transition
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-100
              "
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Đến ngày
            </label>

            <input
              type="date"
              value={filters.toDate}
              onChange={e =>
                onFilterChange(
                  'toDate',
                  e.target.value
                )
              }
              className="
                h-10 w-full rounded-lg border border-gray-300
                bg-white px-3 text-sm text-slate-700
                outline-none transition
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-100
              "
            />
          </div>

        </div>
        <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">

          <Button
            variant="outline"
            onClick={onReset}
            className="h-10 px-4"
          >
            Đặt lại
          </Button>

          <Button
            variant="primary"
            onClick={onSearch}
            className="h-10 px-5"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              />
            </svg>

            Tìm kiếm
          </Button>

        </div>

      </div>
    </div>
  );
};

export default ReviewHeader;