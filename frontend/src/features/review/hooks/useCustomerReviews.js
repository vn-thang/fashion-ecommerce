import { useState, useEffect, useCallback } from 'react';
import { reviewApi } from '../api/reviewApi';

export const useCustomerReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await reviewApi.getProductReviews(productId, { page, limit });
      
      if (res.success) {
        setReviews(res.data.reviews || []);
        setTotalReviews(res.data.pagination?.totalItems || 0);
        setAverageRating(res.data.averageRating || 0); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải đánh giá');
    } finally {
      setIsLoading(false);
    }
  }, [productId, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    totalReviews,
    averageRating,
    isLoading,
    error,
    page,
    setPage,
    totalPages: Math.ceil(totalReviews / limit),
    refreshReviews: fetchReviews
  };
};