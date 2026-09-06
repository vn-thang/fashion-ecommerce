import React from 'react';

const SearchHistory = ({
  history,
  onSelect,
  onRemove,
  onClear
}) => {
  if (!history.length) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-xs font-semibold text-gray-700">
          Lịch sử tìm kiếm
        </span>

        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-400 transition-colors hover:text-[#ee4d2d]"
        >
          Xóa lịch sử
        </button>
      </div>

      <div className="py-1">
        {history.map((keyword) => (
          <div
            key={keyword}
            className="group flex items-center"
          >
            <button
              type="button"
              onClick={() => onSelect(keyword)}
              className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5 text-left text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#ee4d2d]"
            >
              <span className="shrink-0 text-gray-400">
                🕘
              </span>

              <span className="truncate">
                {keyword}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(keyword)}
              className="mr-3 hidden shrink-0 text-gray-300 transition-colors hover:text-gray-500 group-hover:block"
              title="Xóa"
              aria-label={`Xóa ${keyword}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;