import React from 'react';

import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

import CategoryHeader from '../../components/admin/CategoryHeader';
import CategoryStats from '../../components/admin/CategoryStats';
import CategoryTable from '../../components/admin/CategoryTable';
import CategoryForm from '../../components/admin/CategoryForm';

import { useCategory } from '../../hooks/useCategory';

const CategoryPage = () => {
  const {
    loading,

    categories,
    pagination,

    open,
    editing,
    search,    

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
  } = useCategory();

  return (
    <>
      <div className="mx-auto max-w-[1600px] space-y-6 animate-fadeIn">

      <CategoryHeader
    onAdd={openCreateModal}
    search={search}
    onSearch={handleSearchInput}
    onSearchClick={handleSearch}
/>

       <CategoryStats
    pagination={pagination}
/>

      <CategoryTable
  loading={loading}
  categories={categories}
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
            ? 'Cập nhật danh mục sản phẩm'
            : 'Tạo danh mục mới'
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={closeModal}
            >
              Hủy bỏ
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
                : 'Xác nhận tạo'}
            </Button>
          </>
        }
      >
        <CategoryForm
          form={form}
          setForm={setForm}
          categories={categories}
          editingId={editing?.id}
        />
      </Modal>
    </>
  );
};

export default CategoryPage;