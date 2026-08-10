import React from 'react';

import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

import BrandHeader from '../../components/admin/BrandHeader';
import BrandStats from '../../components/admin/BrandStats';
import BrandTable from '../../components/admin/BrandTable';
import BrandForm from '../../components/admin/BrandForm';

import { useBrand } from '../../hooks/useBrand';

const BrandPage = () => {
  const {
    loading,

    brands,
    pagination,
    stats,

    search,

    open,
    editing,

    form,
    setForm,

    openCreateModal,
    openEditModal,
    closeModal,

    handleCreate,
    handleUpdate,
    handleDeactivate,
    handleActivate,

    handlePageChange,
    handleSearchInput,
    handleSearch
  } = useBrand();

  return (
    <>
      <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">

        <BrandHeader
          onAdd={openCreateModal}
          search={search}
          onSearch={handleSearchInput}
          onSearchClick={handleSearch}
        />

        <BrandStats
          stats={stats}
        />

      <BrandTable
  loading={loading}
  brands={brands}
  pagination={pagination}
  onPageChange={handlePageChange}
  onEdit={openEditModal}
  onDeactivate={handleDeactivate}
  onActivate={handleActivate}
/>

      </div>

      <Modal
        isOpen={open}
        onClose={closeModal}
        title={
          editing
            ? 'Cập nhật thương hiệu'
            : 'Thêm thương hiệu'
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={closeModal}
            >
              Hủy
            </Button>

            <Button
              onClick={
                editing
                  ? handleUpdate
                  : handleCreate
              }
            >
              {editing
                ? 'Lưu thay đổi'
                : 'Tạo thương hiệu'}
            </Button>
          </>
        }
      >
        <BrandForm
          form={form}
          setForm={setForm}
          editing={editing}
        />
      </Modal>
    </>
  );
};

export default BrandPage;