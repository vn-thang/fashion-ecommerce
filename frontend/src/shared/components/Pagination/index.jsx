import React from 'react';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
              currentPage === i
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === 2 || i === totalPages - 1) {
        pages.push(<span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-xs font-bold">...</span>);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3.5 sm:px-6 border-t border-gray-100">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Trước
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Sau
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Hiển thị trang <span className="font-semibold text-gray-800">{currentPage}</span> / <span className="font-semibold text-gray-800">{totalPages}</span> trang
          </p>
        </div>
        <div>
          <nav className="inline-flex items-center gap-1.5 isolate rounded-md" aria-label="Pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              ‹
            </button>
            {renderPageNumbers()}
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              ›
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;