import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { categoryAdminApi } from '../api/categoryAdminApi';

const DEFAULT_FORM = {
  name: '',
  description: '',
  parentId: ''
};

export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: ''
  });
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    parentId: form.parentId || null
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const res = await categoryAdminApi.getAll(filters);

      if (res.success) {
        setCategories(res.data.categories || []);
        setPagination(
          res.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            limit: 10
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'Không tải được danh mục.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateModal = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setOpen(true);
  };

  const openEditModal = category => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || ''
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    setForm(DEFAULT_FORM);
  };

  const handleCreate = async () => {
    try {
      await categoryAdminApi.create(buildPayload());

      toast.success('Tạo danh mục thành công.');
      closeModal();
      await loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Tạo danh mục thất bại.'
      );
    }
  };

  const handleUpdate = async () => {
    try {
      await categoryAdminApi.update(
        editing.id,
        buildPayload()
      );

      toast.success('Cập nhật danh mục thành công.');
      closeModal();
      await loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Cập nhật thất bại.'
      );
    }
  };

  const handleDeactivate = async id => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn ẩn danh mục này? Các danh mục con cũng sẽ bị ẩn.'
      )
    ) {
      return;
    }

    try {
      await categoryAdminApi.deactivate(id);

      toast.success('Ẩn danh mục thành công.');

      if (categories.length === 1 && filters.page > 1) {
        setFilters(prev => ({
          ...prev,
          page: prev.page - 1
        }));
      } else {
        await loadCategories();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Ẩn danh mục thất bại.'
      );
    }
  };

  const handleActivate = async id => {
    try {
      await categoryAdminApi.activate(id);

      toast.success('Kích hoạt danh mục thành công.');
      await loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Kích hoạt danh mục thất bại.'
      );
    }
  };

  const handlePageChange = page => {
    if (
      page === filters.page ||
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    setFilters(prev => ({
      ...prev,
      page
    }));
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
    categories,
    pagination,
    filters,
    open,
    editing,
    form,
    setForm,
    search,
    loadCategories,
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