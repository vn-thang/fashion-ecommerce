import React, { useState } from 'react';

import BannerHeader from '../../components/admin/BannerHeader';
import BannerList from '../../components/admin/BannerList';
import BannerForm from '../../components/admin/BannerForm';
import DeleteBannerModal from '../../components/admin/DeleteBannerModal';
import BannerPreviewModal from '../../components/admin/BannerPreviewModal';

import { useBanner } from '../../hooks/useBanner';

const BannerPage = () => {
  const {
    loading,
    saving,
    banners,
    form,
    editingBanner,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleDelete,
    startEdit,
    resetForm
  } = useBanner();

  const [openForm, setOpenForm] = useState(false);

  const [previewBanner, setPreviewBanner] = useState(null);

  const [deleteBanner, setDeleteBanner] = useState(null);

  const handleAdd = () => {
    resetForm();
    setOpenForm(true);
  };

  const handleEdit = (banner) => {
    startEdit(banner);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setOpenForm(false);
  };

  const handleSave = async () => {
    await handleSubmit();
    setOpenForm(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteBanner) return;

    await handleDelete(deleteBanner.id);

    setDeleteBanner(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center text-gray-500">
        Đang tải danh sách Banner...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">

      <BannerHeader
        onAdd={handleAdd}
      />

      <BannerList
        banners={banners}
        onEdit={handleEdit}
        onDelete={setDeleteBanner}
        onPreview={setPreviewBanner}
      />

      <BannerForm
        isOpen={openForm}
        onClose={handleCloseForm}
        form={form}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleSubmit={handleSave}
        editingBanner={editingBanner}
        saving={saving}
      />

      <DeleteBannerModal
        isOpen={!!deleteBanner}
        onClose={() => setDeleteBanner(null)}
        onConfirm={handleConfirmDelete}
        loading={saving}
      />

      <BannerPreviewModal
        isOpen={!!previewBanner}
        onClose={() => setPreviewBanner(null)}
        banner={previewBanner}
      />

    </div>
  );
};

export default BannerPage;