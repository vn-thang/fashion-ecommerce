import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth/store/authContext';

const MAX_HISTORY = 10;
const GUEST_KEY = 'fashionhub_search_history_guest';

const useSearchHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  const userId = user?.id;

  const getStorageKey = useCallback(() => {
    return userId
      ? `fashionhub_search_history_${userId}`
      : GUEST_KEY;
  }, [userId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey());

      if (!stored) {
        setHistory([]);
        return;
      }

      const parsed = JSON.parse(stored);

      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Lỗi khi đọc search history:', error);
      setHistory([]);
    }
  }, [getStorageKey]);

  const saveHistory = useCallback(
    (items) => {
      try {
        localStorage.setItem(
          getStorageKey(),
          JSON.stringify(items)
        );
      } catch (error) {
        console.error('Lỗi khi lưu search history:', error);
      }
    },
    [getStorageKey]
  );

  const addHistory = useCallback(
    (keyword) => {
      const value = keyword?.trim();

      if (!value) return;

      setHistory((currentHistory) => {
        const filteredHistory = currentHistory.filter(
          (item) =>
            item.toLowerCase() !== value.toLowerCase()
        );

        const updatedHistory = [
          value,
          ...filteredHistory
        ].slice(0, MAX_HISTORY);

        saveHistory(updatedHistory);

        return updatedHistory;
      });
    },
    [saveHistory]
  );

  const removeHistory = useCallback(
    (keyword) => {
      setHistory((currentHistory) => {
        const updatedHistory = currentHistory.filter(
          (item) => item !== keyword
        );

        saveHistory(updatedHistory);

        return updatedHistory;
      });
    },
    [saveHistory]
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem(getStorageKey());
    setHistory([]);
  }, [getStorageKey]);

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory
  };
};

export default useSearchHistory;