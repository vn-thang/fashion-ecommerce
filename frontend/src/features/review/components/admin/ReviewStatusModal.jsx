import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const ReviewStatusModal = ({ isOpen, onClose, review, onConfirm, isLoading }) => {
  if (!review) return null;

  const isHidden = review.isHidden;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isHidden ? 'Hiển thị lại đánh giá' : 'Ẩn đánh giá'}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant={isHidden ? 'primary' : 'danger'}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isHidden ? 'Hiển thị lại' : 'Ẩn đánh giá'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <img
              src={review.user?.avatarUrl || 'https://placehold.co/48x48?text=U'}
              alt={review.user?.fullName || 'Khách hàng'}
              className="h-11 w-11 shrink-0 rounded-full border border-gray-200 object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">
                {review.user?.fullName || 'Khách hàng'}
              </p>
              {review.user?.email && (
                <p className="mt-0.5 truncate text-xs text-gray-400">
                  {review.user.email}
                </p>
              )}
            </div>
          </div>

          {review.product?.name && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-400">Sản phẩm</p>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-700">
                {review.product.name}
              </p>
            </div>
          )}

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wide text-amber-400">
                {'★'.repeat(review.rating)}
                <span className="text-gray-300">
                  {'★'.repeat(5 - review.rating)}
                </span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {review.rating}/5
              </span>
            </div>

            <p className="mt-2 text-xs leading-6 text-slate-600">
              {review.comment || (
                <span className="italic text-gray-400">
                  Khách hàng không để lại bình luận.
                </span>
              )}
            </p>
          </div>
        </div>

        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            isHidden
              ? 'border-emerald-100 bg-emerald-50'
              : 'border-amber-100 bg-amber-50'
          }`}
        >
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              isHidden
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {isHidden ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.6l-8 14A2 2 0 004 20.5h16a2 2 0 001.7-2.9l-8-14a2 2 0 00-3.4 0z" />
              </svg>
            )}
          </div>

          <div>
            <p
              className={`text-xs font-semibold ${
                isHidden ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {isHidden ? 'Hiển thị lại đánh giá' : 'Ẩn đánh giá'}
            </p>
            <p
              className={`mt-1 text-xs leading-5 ${
                isHidden ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {isHidden
                ? 'Đánh giá sẽ được hiển thị lại cho khách hàng trên hệ thống.'
                : 'Đánh giá sẽ bị ẩn khỏi khu vực hiển thị cho khách hàng.'}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewStatusModal;