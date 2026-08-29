import { useState, useEffect, useCallback } from 'react';
import { reviewApi } from '../api/reviewApi';

const REVIEW_LIMIT = 5;

export const useCustomerReviews = productId => {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [hasCommentFilter, setHasCommentFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(
    async ({ reset = false } = {}) => {
      if (!productId) return;

      try {
        setIsLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;

        const params = {
          page: currentPage,
          limit: REVIEW_LIMIT
        };

        if (ratingFilter) {
          params.rating = ratingFilter;
        }

        if (hasCommentFilter) {
          params.hasComment = true;
        }

        const res = await reviewApi.getProductReviews(
          productId,
          params
        );

        const data = res?.data?.data || res?.data || res;

        const newReviews = data?.reviews || [];

        const pagination = data?.pagination || {};

        if (reset || currentPage === 1) {
          setReviews(newReviews);
        } else {
          setReviews(prev => [...prev, ...newReviews]);
        }

        setTotalReviews(pagination.totalItems || 0);
        setTotalPages(pagination.totalPages || 1);

        if (data?.averageRating !== undefined) {
          setAverageRating(Number(data.averageRating) || 0);
        }
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            'Không thể tải đánh giá'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      productId,
      page,
      ratingFilter,
      hasCommentFilter
    ]
  );

  useEffect(() => {
    if (!productId) return;

    setPage(1);
  }, [
    productId,
    ratingFilter,
    hasCommentFilter
  ]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRatingFilter = rating => {
    setRatingFilter(prev =>
      prev === rating ? null : rating
    );
  };

  const handleCommentFilter = () => {
    setHasCommentFilter(prev => !prev);
  };

  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  const collapseReviews = () => {
    setReviews(prev =>
      prev.slice(0, REVIEW_LIMIT)
    );

    setPage(1);
  };

  const hasMore = page < totalPages;

  return {
    reviews,

    totalReviews,
    averageRating,

    isLoading,
    error,

    page,
    totalPages,
    hasMore,

    ratingFilter,
    hasCommentFilter,

    handleRatingFilter,
    handleCommentFilter,

    loadMore,
    collapseReviews,

    refreshReviews: () =>
      fetchReviews({ reset: true })
  };
};