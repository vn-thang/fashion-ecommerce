import React from 'react';
import { Star } from 'lucide-react';
import { useCustomerReviews } from '../../../review/hooks/useCustomerReviews';

const ProductReviewSection = ({
  productId,
  averageRating: productAverageRating,
  totalReviews: productTotalReviews
}) => {
  const {
    reviews,
    totalReviews,
    averageRating,
    isLoading,
    error,
    hasMore,
    ratingFilter,
    hasCommentFilter,
    handleRatingFilter,
    handleCommentFilter,
    loadMore,
    collapseReviews
  } = useCustomerReviews(productId);

  const renderStars = rating => {
    const validRating = Math.max(
      0,
      Math.min(5, Math.round(rating || 0))
    );

    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            fill={
              star <= validRating
                ? 'currentColor'
                : 'none'
            }
            className={
              star <= validRating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    );
  };
  const displayAverageRating =
    averageRating || productAverageRating || 0;

  const displayTotalReviews =
    totalReviews || productTotalReviews || 0;

  return (
    <div className="bg-white mt-4 p-6 rounded-sm shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 uppercase">
        Đánh giá sản phẩm
      </h2>
      <div className="bg-orange-50 border border-orange-100 p-6 rounded-md flex items-center gap-8 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#ee4d2d]">
            {Number(displayAverageRating).toFixed(1)}

            <span className="text-xl text-gray-500 font-normal">
              {' '}
              / 5
            </span>
          </div>
          <div className="flex justify-center mt-2">
            {renderStars(displayAverageRating)}
          </div>

          <div className="text-sm text-gray-500 mt-1">
            {displayTotalReviews} Đánh giá
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-md p-4 mb-6">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Lọc đánh giá
      </div>

      <div className="flex flex-wrap gap-2">

        <button
          type="button"
          onClick={() => handleRatingFilter(null)}
          className={`px-4 py-2 border rounded-md text-sm transition ${
            ratingFilter === null
              ? 'border-[#ee4d2d] text-[#ee4d2d] bg-orange-50'
              : 'border-gray-300 text-gray-600 hover:border-[#ee4d2d]'
          }`}
        >
          Tất cả
        </button>

        {[5, 4, 3, 2, 1].map(star => (
            <button
        key={star}
        type="button"
        onClick={() => handleRatingFilter(star)}
        className={`px-4 py-2 border rounded-md text-sm transition flex items-center justify-center gap-1 ${
          ratingFilter === star
            ? 'border-[#ee4d2d] text-[#ee4d2d] bg-orange-50'
            : 'border-gray-300 text-gray-600 hover:border-[#ee4d2d]'
        }`}
      >
        <span>{star}</span>

        <Star
          size={16}
          fill="currentColor"
          className="text-yellow-400"
        />
      </button>
        ))}

        <button
          type="button"
          onClick={handleCommentFilter}
          className={`px-4 py-2 border rounded-md text-sm transition ${
            hasCommentFilter
              ? 'border-[#ee4d2d] text-[#ee4d2d] bg-orange-50'
              : 'border-gray-300 text-gray-600 hover:border-[#ee4d2d]'
          }`}
        >
          Có bình luận
        </button>

      </div>
    </div>
      {isLoading && reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Đang tải đánh giá...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-rose-500">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg bg-gray-50">
          Không có đánh giá phù hợp.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => {
            const orderItem = review.orderItem || {};
            const color = orderItem.color || orderItem.variant?.color || '';
            const size = orderItem.size || orderItem.variant?.size || '';

            return (
              <div
                key={review.id}
                className="flex gap-4 border-b border-gray-100 pb-6 last:border-0"
              >
                <img
                  src={
                    review.user?.avatarUrl ||
                    'https://placehold.co/100x100?text=User'
                  }
                  alt=""
                  className="w-10 h-10 rounded-full border object-cover"
                />

                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">
                    {review.user?.fullName ||
                      'Người dùng'}
                  </div>

                  <div className="mt-1">
                    {renderStars(review.rating)}
                  </div>

                  <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2">
                    <span>
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            'vi-VN'
                          )
                        : ''}
                    </span>

                    {(color || size) && (
                      <>
                        <span>|</span>
                        <span>
                          Phân loại hàng:{' '}
                          {color}

                          {size
                            ? ` - ${size}`
                            : ''}
                        </span>
                      </>
                    )}

                  </div>

                  <div className="text-sm text-gray-700 mt-3 whitespace-pre-line bg-gray-50 p-3 rounded border">
                    {review.comment ||
                      'Người dùng không để lại nhận xét.'}
                  </div>

                  {review.reply && (
                    <div className="mt-3 ml-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg p-4">

                      <div className="flex justify-between">

                        <span className="font-semibold text-indigo-700">
                          🛍️ Phản hồi của Shop
                        </span>

                        {review.repliedAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(
                              review.repliedAt
                            ).toLocaleDateString(
                              'vi-VN'
                            )}
                          </span>
                        )}

                      </div>

                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                        {review.reply}
                      </p>

                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      )}

      {(hasMore || reviews.length > 5) && (
        <div className="flex justify-center mt-8">

          {hasMore ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
            >
              {isLoading
                ? 'Đang tải...'
                : 'Xem thêm ↓'}
            </button>
          ) : (
            <button
              type="button"
              onClick={collapseReviews}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Thu gọn ↑
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default ProductReviewSection;