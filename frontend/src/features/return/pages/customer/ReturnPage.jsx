import Pagination from '../../../../shared/components/Pagination';

import { useReturn } from '../../hooks/useReturn';
import ReturnList from '../../components/customer/ReturnList';
import ReturnDetailModal from '../../components/customer/ReturnDetailModal';
import CustomerPageHeader from '../../../../shared/components/CustomerPageHeader';

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
    <div className="mx-auto w-full space-y-5 animate-fadeIn">
      <CustomerPageHeader
        title="Yêu cầu trả hàng"
        description="Theo dõi lịch sử và trạng thái các yêu cầu trả hàng của bạn."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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