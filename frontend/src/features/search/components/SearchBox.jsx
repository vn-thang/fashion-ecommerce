import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useSearchHistory from '../hooks/useSearchHistory';
import SearchHistory from './SearchHistory';
import useSearchAutocomplete from '../hooks/useSearchAutocomplete';
import SearchAutocomplete from './SearchAutocomplete';

const SearchBox = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const containerRef = useRef(null);
  const [keyword, setKeyword] = useState(
    searchParams.get('search') || ''
  );

  const [isFocused, setIsFocused] = useState(false);
  const {
    history,
    addHistory,
    removeHistory,
    clearHistory
  } = useSearchHistory();

  const {
  suggestions,
  loading
} = useSearchAutocomplete(keyword);

  useEffect(() => {
    setKeyword(
      searchParams.get('search') || ''
    );
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const handleSearch = (value) => {
    const trimmedKeyword = value?.trim();

    if (!trimmedKeyword) {
      navigate('/products');
      return;
    }
    addHistory(trimmedKeyword);
    setIsFocused(false);

    navigate(
      `/products?search=${encodeURIComponent(
        trimmedKeyword
      )}`
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleSearch(keyword);
  };

  const handleSelectSuggestion = (suggestion) => {
  setKeyword(suggestion);
  handleSearch(suggestion);
};
  const handleSelectHistory = (historyKeyword) => {
    setKeyword(historyKeyword);

    handleSearch(historyKeyword);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="relative"
      >
        <input
          type="text"
          value={keyword}
          onChange={(event) =>
            setKeyword(event.target.value)
          }
          onFocus={() => setIsFocused(true)}
          placeholder="Tìm kiếm sản phẩm..."
          className="
            h-11
            w-full
            rounded-md
            border
            border-gray-300
            bg-white
            pl-4
            pr-12
            text-sm
            text-gray-700
            outline-none
            transition-all
            focus:border-[#ee4d2d]
            focus:ring-1
            focus:ring-[#ee4d2d]
          "
        />

        <button
          type="submit"
          className="
            absolute
            right-0
            top-0
            flex
            h-11
            w-12
            items-center
            justify-center
            rounded-r-md
            bg-[#ee4d2d]
            text-white
            transition-colors
            hover:bg-[#d74123]
          "
          aria-label="Tìm kiếm"
        >
          🔍
        </button>
      </form>
{isFocused && (
  <>
    {keyword.trim() ? (
      <SearchAutocomplete
        suggestions={suggestions}
        loading={loading}
        onSelect={handleSelectSuggestion}
      />
    ) : history.length > 0 ? (
      <SearchHistory
        history={history}
        onSelect={handleSelectHistory}
        onRemove={removeHistory}
        onClear={clearHistory}
      />
    ) : null}
  </>
)}
    </div>
  );
};

export default SearchBox;