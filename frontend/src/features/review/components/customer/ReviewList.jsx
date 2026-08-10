import React from 'react';
import { useCustomerReviews } from '../../hooks/useCustomerReviews';
import ReviewItem from './ReviewItem';
import Button from '../../../../shared/components/Button';

const ReviewList = ({ productId }) => {
  const { reviews, totalReviews, isLoading, error, page, setPage, totalPages } = useCustomerReviews(productId);

  if (isLoading && page === 1) return <div className="py-8 text-center text-gray-500">Đang tải đánh giá...</div>;
  if (error) return <div className="py-8 text-center text-rose-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Đánh giá sản phẩm ({totalReviews})</h3>
      
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.map(review => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
          >
            Trang trước
          </Button>
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;