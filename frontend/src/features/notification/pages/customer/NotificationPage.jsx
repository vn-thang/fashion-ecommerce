import { useState } from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';
import NotificationList from '../../components/NotificationList';
import NotificationDetailModal from '../../components/NotificationDetailModal';
import { useNotification } from '../../hooks/useNotification';
import CustomerPageHeader from '../../../../shared/components/CustomerPageHeader';

const NotificationPage = () => {
  const {
    loading,
    notifications,
    unreadCount,
    pagination,
    markAsRead,
    markAllAsRead,
    handlePageChange
  } = useNotification();

  const [
    selectedNotification,
    setSelectedNotification
  ] = useState(null);

  const handleOpenNotification =
    notification => {
      setSelectedNotification(
        notification
      );
    };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-5 animate-fadeIn">
        <CustomerPageHeader
          title="Thông báo"
          description="Theo dõi các thông báo và hoạt động mới nhất."
          action={unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Đọc tất cả
            </Button>
          )}
        />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Tất cả thông báo
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : 'Bạn đã đọc tất cả thông báo'}
              </p>
            </div>
            <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-indigo-50 px-3 text-sm font-bold text-indigo-600">
              {pagination.totalItems}
            </div>
          </div>

          <NotificationList
            notifications={notifications}
            loading={loading}
            onRead={markAsRead}
            onOpen={
              handleOpenNotification
            }
          />

          <Pagination
            currentPage={
              pagination.currentPage
            }
            totalPages={
              pagination.totalPages
            }
            onPageChange={
              handlePageChange
            }
          />

        </div>
      </div>

      <NotificationDetailModal
        notification={
          selectedNotification
        }
        onClose={handleCloseModal}
      />
    </>
  );
};

export default NotificationPage;