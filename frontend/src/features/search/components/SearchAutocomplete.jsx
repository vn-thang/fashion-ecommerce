import React from 'react';

const SearchAutocomplete = ({
  suggestions,
  loading,
  onSelect
}) => {
  if (loading) {
    return (
      <div className="absolute top-full mt-1 w-full rounded-md border bg-white shadow-lg z-50">
        <div className="px-4 py-3 text-sm text-gray-400">
          Đang tìm kiếm...
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="absolute top-full mt-1 w-full rounded-md border bg-white shadow-lg z-50">
        <div className="px-4 py-3 text-sm text-gray-400">
          Không có gợi ý
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full mt-1 w-full rounded-md border bg-white shadow-lg z-50 overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-400 border-b">
        Gợi ý tìm kiếm
      </div>

      {suggestions.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
        >
          <span>🔍</span>
          <span className="truncate">{item}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchAutocomplete;