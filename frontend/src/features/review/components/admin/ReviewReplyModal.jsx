import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const ReviewReplyModal = ({
  isOpen,
  onClose,
  review,
  replyText,
  setReplyText,
  onSubmit,
  isSubmitting
}) => {
  if (!review) return null;

  const rating = Number(review.rating) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={review.reply ? 'Chỉnh sửa phản hồi' : 'Phản hồi đánh giá'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {review.reply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <img
              src={review.user?.avatarUrl || 'https://placehold.co/48x48?text=U'}
              alt={review.user?.fullName || 'Khách hàng'}
              className="h-11 w-11 shrink-0 rounded-full border border-white object-cover shadow-sm"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {review.user?.fullName || 'Khách hàng'}
                  </p>
                  {review.user?.email && (
                    <p className="truncate text-xs text-gray-400">
                      {review.user.email}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span className="text-amber-400">{'★'.repeat(rating)}</span>
                  <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
                  <span className="ml-1 text-xs font-semibold text-slate-500">
                    {rating}/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {review.product?.name && (
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-xs font-medium text-gray-400">Sản phẩm</p>
              <p className="mt-1 text-xs font-medium text-slate-700">
                {review.product.name}
              </p>
            </div>
          )}

          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
            <p className="mb-1 text-xs font-medium text-gray-400">Nội dung đánh giá</p>
            <p className="text-xs leading-6 text-slate-600">
              {review.comment || 'Khách hàng không để lại bình luận.'}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Phản hồi của Shop
            </label>
            <span className="text-xs text-gray-400">
              {replyText.length}/1000
            </span>
          </div>

          <textarea
            rows={5}
            maxLength={1000}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            disabled={isSubmitting}
            placeholder="Nhập nội dung phản hồi cho khách hàng..."
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs leading-6 text-slate-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-2 text-xs text-gray-400">
            Phản hồi sẽ được hiển thị công khai cùng đánh giá của khách hàng.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewReplyModal;