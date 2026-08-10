import React from 'react';
import ReviewHeader from '../../components/admin/ReviewHeader';
import ReviewTable from '../../components/admin/ReviewTable';
import ReviewReplyModal from '../../components/admin/ReviewReplyModal';
import ReviewStatusModal from '../../components/admin/ReviewStatusModal';
import { useReviewAdmin } from '../../hooks/useReviewAdmin';

const ReviewAdminPage = () => {
  const {
    reviews,
    loading,
    currentPage,
    totalPages,
    totalReviews,
    filters,
    handleFilterChange,
    handleSearch,
    handleResetFilters,
    handlePageChange,
    openStatusModal,
    isStatusModalOpen,
    closeStatusModal,
    statusReview,
    handleConfirmStatusChange,
    isStatusLoading,
    isReplyModalOpen,
    selectedReview,
    replyText,
    setReplyText,
    openReplyModal,
    closeReplyModal,
    handleReplySubmit,
    isSubmitting
  } = useReviewAdmin();

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <ReviewHeader
        totalCount={totalReviews}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      <div className="w-full min-w-0">
        {loading && reviews.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-gray-100 bg-white px-4 text-center text-sm text-gray-500 shadow-sm sm:min-h-[300px]">
            Đang tải dữ liệu...
          </div>
        ) : (
          <ReviewTable
            reviews={reviews}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onToggleHide={openStatusModal}
            onReply={openReplyModal}
          />
        )}
      </div>

      <ReviewReplyModal
        isOpen={isReplyModalOpen}
        review={selectedReview}
        replyText={replyText}
        setReplyText={setReplyText}
        onClose={closeReplyModal}
        onSubmit={handleReplySubmit}
        isSubmitting={isSubmitting}
      />

       <ReviewStatusModal
        isOpen={isStatusModalOpen}
        review={statusReview}
        onClose={closeStatusModal}
        onConfirm={handleConfirmStatusChange}
        isLoading={isStatusLoading}
      />
    </div>
  );
};

export default ReviewAdminPage;