import React, { useState, useEffect } from 'react';
import { reviewApi } from '../../../review/api/reviewApi';
import { Star } from 'lucide-react';

const ProductReviewSection = ({ productId, averageRating, totalReviews }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      try {
        const res = await reviewApi.getProductReviews(productId, {
          page,
          limit: 5
        });

        const data = res.data || res;

        const newReviews = data.reviews || [];

        if (page === 1) {
          setReviews(newReviews);
        } else {
          setReviews((prev) => [...prev, ...newReviews]);
        }

        const total = data.pagination?.totalPages || 1;

        setTotalPages(total);
        setHasMore(page < total);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId, page]);

  const renderStars = (rating) => {
    const validRating = Math.max(
      0,
      Math.min(5, Math.round(rating || 0))
    );

    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= validRating ? 'currentColor' : 'none'}
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

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleCollapse = async () => {
    setLoading(true);

    try {
      const res = await reviewApi.getProductReviews(productId, {
        page: 1,
        limit: 5
      });

      const data = res.data || res;

      setReviews(data.reviews || []);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mt-4 p-6 rounded-sm shadow-sm">

      <h2 className="text-lg font-semibold text-gray-800 mb-6 uppercase">
        Đánh giá sản phẩm
      </h2>
      <div className="bg-orange-50 border border-orange-100 p-6 rounded-md flex items-center gap-8 mb-6">

        <div className="text-center">

          <div className="text-3xl font-bold text-[#ee4d2d]">
            {Number(averageRating || 0).toFixed(1)}
            <span className="text-xl text-gray-500 font-normal">
              {' '}
              / 5
            </span>
          </div>

          <div className="flex justify-center mt-2">
            {renderStars(averageRating)}
          </div>

          <div className="text-sm text-gray-500 mt-1">
            {totalReviews || 0} Đánh giá
          </div>

        </div>

      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Đang tải đánh giá...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg bg-gray-50">
          Chưa có đánh giá nào.
        </div>
      ) : (
        <div className="space-y-6">

          {reviews.map((review) => {

            const orderItem = review.orderItem || {};

            const color =
              orderItem.color ||
              orderItem.variant?.color ||
              '';

            const size =
              orderItem.size ||
              orderItem.variant?.size ||
              '';

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
                    {review.user?.fullName || 'Người dùng'}
                  </div>

                  <div className="mt-1">
                    {renderStars(review.rating)}
                  </div>

                  <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2">

                    <span>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            'vi-VN'
                          )
                        : ''}
                    </span>

                    {(color || size) && (
                      <>
                        <span>|</span>
                        <span>
                          Phân loại hàng: {color}
                          {size ? ` - ${size}` : ''}
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
                            ).toLocaleDateString('vi-VN')}
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

      {(hasMore || totalPages > 1) && (
        <div className="flex justify-center mt-8">

          {hasMore ? (
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Xem thêm ↓
            </button>
          ) : (
            <button
              onClick={handleCollapse}
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