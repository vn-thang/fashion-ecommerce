import React from 'react';
import Pagination from '../../../../shared/components/Pagination';

import { useReturn } from '../../hooks/useReturn';
import ReturnList from '../../components/customer/ReturnList';
import ReturnDetailModal from '../../components/customer/ReturnDetailModal';

const ReturnPage = () => {
  const {
    loading,
    submitting,
    detailLoading,
    returns,
    pagination,
    selectedReturn,
    openDetail,
    closeDetail,
    markShipping,
     cancelReturn,
    handlePageChange
  } = useReturn();

  const formatPrice = value =>
    Number(value || 0).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 animate-fadeIn">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Yêu cầu trả hàng
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Theo dõi lịch sử và trạng thái các yêu cầu trả hàng của bạn.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-500">
            Đang tải danh sách yêu cầu trả hàng...
          </div>
        ) : (
          <>
            <ReturnList
              returns={returns}
              onDetail={openDetail}
              formatPrice={formatPrice}
            />

            {pagination.totalPages > 1 && (
              <div className="border-t border-gray-100">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ReturnDetailModal
        selectedReturn={selectedReturn}
        detailLoading={detailLoading}
        submitting={submitting}
        onClose={closeDetail}
        onMarkShipping={markShipping}
         onCancel={cancelReturn}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default ReturnPage;