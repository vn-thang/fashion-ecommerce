import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

import CouponHeader from '../../components/admin/CouponHeader';
import CouponTable from '../../components/admin/CouponTable';
import CouponForm from '../../components/admin/CouponForm';

import useCouponAdmin from '../../hooks/useCouponAdmin';

const CouponPage = () => {
  const {
    coupons,
    loading,
    form,
    setForm,
    editing,
    isModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    handleCreate,
    handleUpdate,
    openDeactivateModal,
    handleDelete,
    closeDeactivateModal,
    couponToDeactivate,
    isDeactivateModalOpen,
    currentPage,
    totalPages,
    totalCoupons,
    handlePageChange,
    filters,
    handleFilterChange,
    handleSearch,
    handleResetFilters
  } = useCouponAdmin();

  return (
    <div className="w-full min-w-0">
      <CouponHeader
        onAdd={openCreateModal}
        totalCount={totalCoupons}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {loading && coupons.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-100 bg-white text-sm text-gray-500 shadow-sm">
          Đang tải danh sách mã giảm giá...
        </div>
      ) : (
       <CouponTable
        coupons={coupons}
        onEdit={openEditModal}
        onDelete={openDeactivateModal}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? 'Cập nhật mã giảm giá' : 'Tạo mã giảm giá mới'}
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={loading}>
              Hủy bỏ
            </Button>
            <Button
              variant={editing ? 'secondary' : 'primary'}
              onClick={editing ? handleUpdate : handleCreate}
              isLoading={loading}
              disabled={loading}
            >
              {editing ? 'Lưu thay đổi' : 'Xác nhận tạo'}
            </Button>
          </>
        }
      >
        <CouponForm form={form} setForm={setForm} />
      </Modal>

      <Modal
  isOpen={isDeactivateModalOpen}
  onClose={closeDeactivateModal}
  title="Tắt mã giảm giá"
  footer={
    <>
      <Button
        variant="outline"
        onClick={closeDeactivateModal}
        disabled={loading}
      >
        Hủy
      </Button>

      <Button
        variant="danger"
        onClick={handleDelete}
        isLoading={loading}
        disabled={loading}
      >
        Tắt mã
      </Button>
    </>
  }
>
  <div className="space-y-4">
    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">
          ⚠️
        </div>

        <div>
          <p className="font-semibold text-slate-800">
            Bạn có chắc muốn tắt mã này?
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Mã giảm giá{' '}
            <span className="font-semibold text-emerald-700">
              {couponToDeactivate?.code}
            </span>{' '}
            sẽ không thể tiếp tục sử dụng.
          </p>
        </div>
      </div>
    </div>

    <p className="text-sm leading-6 text-gray-500">
      Sau khi tắt, mã giảm giá sẽ không được kích hoạt lại.
    </p>
  </div>
</Modal>
    </div>
  );
};

export default CouponPage;