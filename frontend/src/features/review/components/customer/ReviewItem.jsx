import React from 'react';

const ReviewItem = ({ review }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{review.user?.name || 'Người dùng'}</p>
            <div className="flex items-center mt-0.5">{renderStars(review.rating)}</div>
          </div>
        </div>
        <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
      </div>
      {review.orderItem?.variant && (
        <p className="text-xs text-gray-500 mb-2">
          Phân loại: {review.orderItem.variant.color} - Size {review.orderItem.variant.size}
        </p>
      )}

      <p className="text-sm text-slate-700 mt-2">{review.comment}</p>

      {review.reply && (
        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-slate-800 mb-1">Phản hồi từ Shop:</p>
          <p className="text-sm text-slate-600">{review.reply}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;