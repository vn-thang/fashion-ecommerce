import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reviewApi } from '../api/reviewApi';

const DEFAULT_LIMIT = 10;

const DEFAULT_FILTERS = {
  search: '',
  rating: '',
  status: '',
  fromDate: '',
  toDate: ''
};

export const useReviewAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: DEFAULT_LIMIT
  });

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusReview, setStatusReview] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const fetchReviews = useCallback(async (page = 1, currentFilters = DEFAULT_FILTERS) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: DEFAULT_LIMIT,
        ...currentFilters
      };

      const res = await reviewApi.getAdminReviews(params);
      const data = res.data || res;

      setReviews(data.reviews || []);

      setPagination({
        currentPage: data.pagination?.currentPage || page,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || 0,
        limit: data.pagination?.limit || DEFAULT_LIMIT
      });
    } catch (error) {
      console.error('Lỗi khi tải danh sách đánh giá:', error);
      toast.error('Không thể tải danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(pagination.currentPage, appliedFilters);
  }, [fetchReviews, pagination.currentPage, appliedFilters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handlePageChange = page => {
    if (page < 1 || page > pagination.totalPages || page === pagination.currentPage) {
      return;
    }

    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const openStatusModal = review => {
    setStatusReview(review);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    if (isStatusLoading) return;

    setIsStatusModalOpen(false);
    setStatusReview(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!statusReview) return;

    try {
      setIsStatusLoading(true);

      if (statusReview.isHidden) {
        await reviewApi.restoreReview(statusReview.id);
        toast.success('Đã hiển thị lại đánh giá.');
      } else {
        await reviewApi.hideReview(statusReview.id);
        toast.success('Đã ẩn đánh giá.');
      }

      setIsStatusModalOpen(false);
      setStatusReview(null);

      await fetchReviews(pagination.currentPage, appliedFilters);
    } catch (error) {
      console.error('Lỗi thay đổi trạng thái đánh giá:', error);
      toast.error(
        error.response?.data?.message ||
        'Có lỗi xảy ra khi thay đổi trạng thái.'
      );
    } finally {
      setIsStatusLoading(false);
    }
  };

  const openReplyModal = review => {
    setSelectedReview(review);
    setReplyText(review.reply || '');
    setIsReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    if (isSubmitting) return;

    setIsReplyModalOpen(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const handleReplySubmit = async () => {
    const reply = replyText.trim();

    if (!reply) {
      toast.error('Vui lòng nhập nội dung trả lời.');
      return;
    }

    if (!selectedReview) return;

    try {
      setIsSubmitting(true);

      await reviewApi.replyReview(selectedReview.id, { reply });

      toast.success('Đã trả lời đánh giá thành công.');

      setIsReplyModalOpen(false);
      setSelectedReview(null);
      setReplyText('');

      await fetchReviews(pagination.currentPage, appliedFilters);
    } catch (error) {
      console.error('Lỗi khi trả lời đánh giá:', error);
      toast.error(
        error.response?.data?.message ||
        'Lỗi khi gửi câu trả lời.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reviews,
    loading,

    pagination,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalReviews: pagination.totalItems,

    filters,
    appliedFilters,
    handleFilterChange,
    handleSearch,
    handleResetFilters,
    handlePageChange,
    fetchReviews,

    isReplyModalOpen,
    selectedReview,
    replyText,
    setReplyText,
    openReplyModal,
    closeReplyModal,
    handleReplySubmit,
    isSubmitting,

    isStatusModalOpen,
    statusReview,
    isStatusLoading,
    openStatusModal,
    closeStatusModal,
    handleConfirmStatusChange
  };
};
