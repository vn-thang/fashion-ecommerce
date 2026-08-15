import { useEffect, useState } from 'react';
import { searchApi } from '../api/searchApi';

const useSearchAutocomplete = keyword => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = keyword?.trim();

    if (!search) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response =
          await searchApi.getSuggestions(search);

        const data = response?.data;

        setSuggestions(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : []
        );
      } catch (error) {
        console.error(
          'Lỗi search autocomplete:',
          error
        );

        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  return {
    suggestions,
    loading
  };
};

export default useSearchAutocomplete;