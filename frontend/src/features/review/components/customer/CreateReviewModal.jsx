import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import { reviewApi } from '../../api/reviewApi';

const CreateReviewModal = ({ isOpen, onClose, orderItem, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá!');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const payload = {
        orderItemId: orderItem.id,
        productId: orderItem.productId,
        rating,
        comment
      };

      const res = await reviewApi.createReview(payload);
      if (res.success) {
        if (onSuccess) onSuccess(); 
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setRating(5);
      setComment('');
      setError('');
    }
  }, [isOpen]);

  const modalFooter = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
      <Button 
        variant="primary" 
        onClick={handleSubmit} 
        isLoading={isSubmitting}
        className="bg-[#ee4d2d] hover:bg-[#d74123] text-white"
      >
        Gửi Đánh Giá
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Đánh giá sản phẩm" 
      size="md"
      footer={modalFooter}
    >
      <div className="flex flex-col items-center py-4">
        {orderItem?.product && (
          <div className="flex items-center gap-3 mb-6 w-full p-3 bg-slate-50 rounded-lg">
            <img 
              src={orderItem.product.thumbnailUrl || '/placeholder.png'} 
              alt="product" 
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{orderItem.product.name}</p>
              <p className="text-xs text-gray-500">Phân loại: {orderItem.variant?.color} - {orderItem.variant?.size}</p>
            </div>
          </div>
        )}

        <p className="text-sm font-medium text-gray-700 mb-2">Chất lượng sản phẩm</p>
        
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-10 h-10 cursor-pointer transition-colors ${
                star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-xs text-rose-500 font-medium h-4">{rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Hài lòng' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Không hài lòng' : rating === 1 ? 'Tệ' : ''}</p>

        <div className="w-full mt-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ee4d2d] resize-none"
            rows="4"
            placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé (Tùy chọn)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {error && <p className="text-sm text-rose-500 mt-3 w-full">{error}</p>}
      </div>
    </Modal>
  );
};

export default CreateReviewModal;