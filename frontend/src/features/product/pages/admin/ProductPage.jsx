import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import ProductHeader from '../../components/admin/ProductHeader';
import ProductFilter from '../../components/admin/ProductFilter';
import ProductTable from '../../components/admin/ProductTable';
import ProductForm from '../../components/admin/ProductForm';
import ProductImageGallery from '../../components/admin/ProductImageGallery';
import ProductVariantManager from '../../components/admin/ProductVariantManager';
import { useProductAdmin } from '../../hooks/useProductAdmin';

const ProductPage = () => {
  const {
    products,
    categories,
    brands,

    open,
    setOpen,
    editing,
    form,
    setForm,

    filters,
    handleFilterChange,
    handleSearch,

    handleCreate,
    handleUpdate,
    handleDelete,

    openCreateModal,
    openEditModal,

    openImageModal,
    setOpenImageModal,

    openVariantModal,
    setOpenVariantModal,

    selectedProduct,

    handleOpenManageImages,
    handleOpenManageVariants,

    currentPage,
    totalPages,
    handlePageChange
  } = useProductAdmin();

  return (
    <>
      <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <ProductHeader onAdd={openCreateModal} />

        <ProductFilter
          filters={filters}
          categories={categories}
          brands={brands}
          onChange={handleFilterChange}
          onSearch={handleSearch}
        />

        <ProductTable
          products={products}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onManageImages={handleOpenManageImages}
          onManageVariants={handleOpenManageVariants}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy bỏ
            </Button>

            <Button
              variant={editing ? 'secondary' : 'primary'}
              onClick={editing ? handleUpdate : handleCreate}
              className={
                editing
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-none'
                  : ''
              }
            >
              {editing ? 'Lưu thay đổi' : 'Xác nhận tạo'}
            </Button>
          </>
        }
      >
        <ProductForm
          form={form}
          setForm={setForm}
          categories={categories}
          brands={brands}
          isEditing={!!editing}
        />
      </Modal>

      <Modal
        isOpen={openImageModal}
        onClose={() => setOpenImageModal(false)}
        title={`Album ảnh: ${selectedProduct?.name}`}
        footer={
          <Button
            variant="outline"
            onClick={() => setOpenImageModal(false)}
          >
            Đóng
          </Button>
        }
      >
        {selectedProduct && (
          <ProductImageGallery productId={selectedProduct.id} />
        )}
      </Modal>

      <Modal
        isOpen={openVariantModal}
        onClose={() => setOpenVariantModal(false)}
        title={`Phân loại & Tồn kho: ${selectedProduct?.name}`}
        size="2xl"
        footer={
          <Button
            variant="outline"
            onClick={() => setOpenVariantModal(false)}
          >
            Đóng
          </Button>
        }
      >
        {selectedProduct && (
          <ProductVariantManager productId={selectedProduct.id} />
        )}
      </Modal>
    </>
  );
};

export default ProductPage;