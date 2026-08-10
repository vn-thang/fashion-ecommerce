import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { brandAdminApi } from '../api/brandAdminApi';

const DEFAULT_FORM = {
  name: '',
  logoFile: null,
  logoPreview: ''
};

export const useBrand = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [stats, setStats] = useState({ totalBrands: 0, activeBrands: 0, emptyBrands: 0 });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true);
      const res = await brandAdminApi.getAll(filters);

      if (res.success) {
        setBrands(res.data.brands || []);
        setStats(res.data.stats || { totalBrands: 0, activeBrands: 0, emptyBrands: 0 });
        setPagination(res.data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Không tải được danh sách thương hiệu.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const openCreateModal = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setOpen(true);
  };

  const openEditModal = brand => {
    setEditing(brand);
    setForm({
      name: brand.name,
      logoFile: null,
      logoPreview: brand.logoUrl
    });
    setOpen(true);
  };

  const closeModal = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setOpen(false);
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append('name', form.name.trim());

    if (form.logoFile) {
      formData.append('logo', form.logoFile);
    }

    return formData;
  };

  const handleCreate = async () => {
    try {
      await brandAdminApi.create(buildFormData());
      toast.success('Tạo thương hiệu thành công.');
      closeModal();
      await loadBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Tạo thương hiệu thất bại.');
    }
  };

  const handleUpdate = async () => {
    try {
      await brandAdminApi.update(editing.id, buildFormData());
      toast.success('Cập nhật thương hiệu thành công.');
      closeModal();
      await loadBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thương hiệu thất bại.');
    }
  };

  const handleDeactivate = async id => {
    if (!window.confirm('Bạn có chắc chắn muốn ẩn thương hiệu này?')) return;

    try {
      await brandAdminApi.deactivate(id);
      toast.success('Đã ẩn thương hiệu.');

      if (brands.length === 1 && filters.page > 1) {
        setFilters(prev => ({ ...prev, page: prev.page - 1 }));
      } else {
        await loadBrands();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ẩn thương hiệu thất bại.');
    }
  };

  const handleActivate = async id => {
    try {
      await brandAdminApi.activate(id);
      toast.success('Đã kích hoạt thương hiệu.');
      await loadBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Kích hoạt thương hiệu thất bại.');
    }
  };

  const handlePageChange = page => {
    if (page === filters.page || page < 1 || page > pagination.totalPages) return;
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearchInput = value => {
    setSearch(value);
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: search.trim()
    }));
  };

  return {
    loading,
    brands,
    stats,
    pagination,
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
  };
};