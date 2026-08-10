import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { productAdminApi } from '../api/productAdminApi';
import { categoryApi } from '../../category/api/categoryApi';
import { brandApi } from '../../brand/api/brandApi';

const initialFormState = {
  name: '',
  description: '',
  categoryId: '',
  brandId: '',
  status: 'ACTIVE',
  thumbnail: null
};

export const useProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    brandId: '',
    status: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openVariantModal, setOpenVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const extractArrayData = (res, key) => {
    if (!res) return [];
    if (Array.isArray(res)) {
      return res;
    }
    if (res.data) {
      if (Array.isArray(res.data)) {
        return res.data;
      }
      if (Array.isArray(res.data[key])) {
        return res.data[key];
      }
    }
    return [];
  };
  const loadInitialData = async (
    page = currentPage,
    customFilters = filters
  ) => {
    try {
      const [prodRes, catRes, brandRes] =
        await Promise.all([
          productAdminApi.getAll({
            page,
            limit: 10,
            keyword: customFilters.keyword,
            categoryId: customFilters.categoryId,
            brandId: customFilters.brandId,
            status: customFilters.status
          }),
          categoryApi.getAll(),
          brandApi.getAll()
        ]);

      if (prodRes.success) {
        const actualData = prodRes.data;
        setProducts(actualData.products || []);
        if (actualData.pagination) {
          setCurrentPage(
            actualData.pagination.currentPage
          );
          setTotalPages(
            actualData.pagination.totalPages
          );
        }
      }
      setCategories(
        extractArrayData(catRes, 'categories')
      );
      setBrands(
        extractArrayData(brandRes, 'brands')
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          'Không tải được dữ liệu'
      );
    }
  };

  useEffect(() => {
    loadInitialData(currentPage);
  }, [currentPage]);
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);

    loadInitialData(1, filters);
  };

  const createFormData = () => {
    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('categoryId', form.categoryId);
    formData.append('brandId', form.brandId);
    formData.append('status', form.status);

    if (form.description) {
      formData.append(
        'description',
        form.description
      );
    }
    if (form.thumbnail) {
      formData.append(
        'thumbnail',
        form.thumbnail
      );
    }
    return formData;
  };
  const handleCreate = async () => {
    if (
      !form.categoryId ||
      !form.brandId ||
      !form.thumbnail
    ) {
      return toast.error(
        'Vui lòng điền đủ tên, danh mục, thương hiệu và chọn ảnh!'
      );
    }
    try {
      await productAdminApi.create(
        createFormData()
      );
      toast.success(
        'Tạo sản phẩm thành công 🎉'
      );
      setOpen(false);
      loadInitialData(
        currentPage,
        filters
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Tạo sản phẩm thất bại'
      );
    }
  };

  const handleUpdate = async () => {
    try {
      await productAdminApi.update(
        editing.id,
        createFormData()
      );
      toast.success(
        'Cập nhật sản phẩm thành công ✨'
      );
      setOpen(false);
      loadInitialData(
        currentPage,
        filters
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Cập nhật thất bại'
      );
    }
  };

  const handleDelete = async id => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn tắt sản phẩm này khỏi hệ thống?'
      )
    ) {
      return;
    }
    try {
      await productAdminApi.deactivateProduct(id);

      toast.success(
        'Đã tắt sản phẩm thành công'
      );
      loadInitialData(
        currentPage,
        filters
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Tắt sản phẩm thất bại'
      );
    }
  };

  const handleDeleteImage = async (
    productId,
    imageId
  ) => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn xóa ảnh này khỏi album?'
      )
    ) {
      return;
    }
    try {
      await productAdminApi.deleteProductImage(
        productId,
        imageId
      );

      toast.success(
        'Xóa ảnh thành công'
      );
      loadInitialData(
        currentPage,
        filters
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Xóa ảnh thất bại'
      );
    }
  };

  const openCreateModal = () => {
    setEditing(null);
    setForm(initialFormState);
    setOpen(true);
  };

  const openEditModal = item => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || '',
      categoryId: item.categoryId || '',
      brandId: item.brandId || '',
      status: item.status || 'ACTIVE',
      thumbnail: null
    });
    setOpen(true);
  };

  const handleOpenManageImages = product => {
    setSelectedProduct(product);
    setOpenImageModal(true);
  };

  const handleOpenManageVariants = product => {
    setSelectedProduct(product);
    setOpenVariantModal(true);
  };

  return {
    products,
    categories,
    brands,
    filters,
    setFilters,
    handleFilterChange,
    handleSearch,
    currentPage,
    totalPages,
    handlePageChange,
    open,
    setOpen,
    editing,
    form,
    setForm,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteImage,
    openCreateModal,
    openEditModal,
    openImageModal,
    setOpenImageModal,
    openVariantModal,
    setOpenVariantModal,
    selectedProduct,
    handleOpenManageImages,
    handleOpenManageVariants,
    loadInitialData
  };
};