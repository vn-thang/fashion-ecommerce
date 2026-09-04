import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { bannerApi } from '../api/bannerApi';

export const useBanner = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    displayOrder: 0,
    isActive: true,
    imageUrl: ''
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await bannerApi.getAll();
      const data = res.data || res;
      setBanners(data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách Banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    if (!file) return;

    setForm(prev => ({
      ...prev,
      imageUrl: URL.createObjectURL(file)
    }));
  };

  const resetForm = () => {
    setEditingBanner(null);
    setImageFile(null);
    setForm({
      title: '',
      description: '',
      displayOrder: 0,
      isActive: true,
      imageUrl: ''
    });
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const startEdit = (banner) => {
    setEditingBanner(banner);
    setImageFile(null);

    setForm({
      title: banner.title || '',
      description: banner.description || '',
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
      imageUrl: banner.imageUrl
    });

    setIsFormOpen(true);
  };

  const openPreview = (banner) => {
    setSelectedBanner(banner);
    setIsPreviewOpen(true);
  };

  const openDelete = (banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('displayOrder', form.displayOrder);
      formData.append('isActive', form.isActive);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingBanner) {
        await bannerApi.update(editingBanner.id, formData);
        toast.success('Cập nhật Banner thành công');
      } else {
        await bannerApi.create(formData);
        toast.success('Thêm Banner thành công');
      }

      setIsFormOpen(false);
      resetForm();
      fetchBanners();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

const handleDelete = async id => {
  if (!id) return;

  try {
    setSaving(true);

    await bannerApi.delete(id);

    toast.success('Đã xóa Banner');

    setIsDeleteOpen(false);
    setSelectedBanner(null);

    await fetchBanners();
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      'Không thể xóa Banner'
    );
  } finally {
    setSaving(false);
  }
};

  return {
    loading,
    saving,
    banners,
    form,
    editingBanner,
    selectedBanner,

    isFormOpen,
    isPreviewOpen,
    isDeleteOpen,

    setIsFormOpen,
    setIsPreviewOpen,
    setIsDeleteOpen,

    handleChange,
    handleImageChange,
    handleSubmit,
    fetchBanners,

    openCreate,
    startEdit,
    openPreview,
    openDelete,
    handleDelete,
    resetForm
  };
};