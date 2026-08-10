import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const ReviewTable = ({
  reviews = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onToggleHide,
  onReply
}) => {
  const renderStars = (rating = 0) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < rating ? 'text-amber-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );

  const formatDate = date => {
    if (!date) return '-';
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!reviews.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m7-2a8 8 0 11-16 0 8 8 0 0016 0z" />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-700">Chưa có đánh giá nào</h3>
        <p className="mt-1 text-sm text-gray-400">Không tìm thấy đánh giá phù hợp với điều kiện hiện tại.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-slate-50/80">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Khách hàng</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Sản phẩm</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Đánh giá</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reviews.map(review => (
              <tr
                key={review.id}
                className={`transition-colors hover:bg-slate-50/60 ${review.isHidden ? 'bg-gray-50/80' : ''}`}
              >
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <img
                      src={review.user?.avatarUrl || 'https://placehold.co/48x48?text=U'}
                      alt={review.user?.fullName || 'User'}
                      className={`h-11 w-11 shrink-0 rounded-full border border-gray-200 object-cover ${review.isHidden ? 'grayscale' : ''}`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {review.user?.fullName || 'Khách ẩn danh'}
                      </p>
                      {review.user?.email && (
                        <p className="mt-0.5 max-w-[190px] truncate text-xs text-gray-400">
                          {review.user.email}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 align-top">
                  <div className="max-w-[220px]">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-700">
                      {review.product?.name || 'Sản phẩm đã xóa'}
                    </p>

                    {review.orderItem?.variant && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {review.orderItem.variant.color && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            {review.orderItem.variant.color}
                          </span>
                        )}
                        {review.orderItem.variant.size && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            Size {review.orderItem.variant.size}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 align-top">
                  <div className="max-w-[360px]">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-xs font-semibold text-slate-500">{review.rating}/5</span>
                    </div>

                    <p className={`mt-2 line-clamp-3 text-sm leading-relaxed ${review.comment ? 'text-slate-600' : 'italic text-gray-400'}`}>
                      {review.comment || 'Không có bình luận'}
                    </p>

                    {review.reply && (
                      <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m7-2a8 8 0 11-16 0 8 8 0 0016 0z" />
                          </svg>
                          <span className="text-xs font-bold text-indigo-700">Phản hồi của Shop</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-indigo-800">{review.reply}</p>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-center align-top">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${review.isHidden ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${review.isHidden ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {review.isHidden ? 'Đã ẩn' : 'Hiển thị'}
                  </span>
                </td>

                <td className="px-6 py-4 align-top">
                  <div className="flex justify-end gap-2">
               <Button
  size="sm"
  variant="outline"
  onClick={() => onReply(review)}
>
  {review.reply ? '✏️ Sửa phản hồi' : '💬 Trả lời'}
</Button>

<Button
  size="sm"
  variant="outline"
  onClick={() => onToggleHide(review)}
>
  {review.isHidden ? '👁️ Hiện lại' : '🙈 Ẩn đánh giá'}
</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-100 bg-slate-50/40 px-6 py-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default ReviewTable;