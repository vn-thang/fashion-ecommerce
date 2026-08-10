import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { couponApi } from '../api/couponApi';

const DEFAULT_LIMIT = 10;
const DEFAULT_FILTERS = {
  search: '',
  discountType: '',
  status: '',
  fromDate: '',
  toDate: ''
};

const DEFAULT_FORM = {
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  usageLimit: '',
  startDate: '',
  endDate: '',
  isActive: true
};

const formatForDateInput = dateString => {
  if (!dateString) return '';

  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date.toISOString().slice(0, 16);
};

const useCouponAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [couponToDeactivate, setCouponToDeactivate] = useState(null);
const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: DEFAULT_LIMIT
  });
  const fetchCoupons = useCallback(async (page, filterValues) => {
    try {
      setLoading(true);

      const result = await couponApi.getAll({
        page,
        limit: DEFAULT_LIMIT,
        ...filterValues
      });

      const data = result?.data || {};

      setCoupons(data.coupons || []);

      setPagination(prev => ({
        ...prev,
        currentPage: data.pagination?.currentPage || page,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || 0,
        limit: data.pagination?.limit || DEFAULT_LIMIT
      }));
    } catch (error) {
      console.error('Lỗi khi tải danh sách coupon:', error);

      toast.error(
        error.response?.data?.message ||
        'Không tải được danh sách mã giảm giá.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons(pagination.currentPage, appliedFilters);
  }, [
    fetchCoupons,
    pagination.currentPage,
    appliedFilters
  ]);
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });

    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);

    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handlePageChange = page => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage
    ) {
      return;
    }

    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const formatPayload = () => ({
    code: form.code.trim().toUpperCase(),

    discountType: form.discountType,

    discountValue:
      Number(form.discountValue) || 0,

    minOrderAmount:
      Number(form.minOrderAmount) || 0,

    maxDiscountAmount:
      form.discountType === 'FIXED'
        ? Number(form.discountValue) || 0
        : Number(form.maxDiscountAmount) || 0,

    usageLimit:
      Number(form.usageLimit) || 1,

    startDate:
      new Date(form.startDate).toISOString(),

    endDate:
      new Date(form.endDate).toISOString(),

    isActive: form.isActive
  });

  const openCreateModal = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = coupon => {
    setEditing(coupon);

    setForm({
      code: coupon.code || '',

      discountType:
        coupon.discountType || 'PERCENTAGE',

      discountValue:
        coupon.discountValue || '',

      minOrderAmount:
        coupon.minOrderAmount || '',

      maxDiscountAmount:
        coupon.maxDiscountAmount || '',

      usageLimit:
        coupon.usageLimit || '',

      startDate:
        formatForDateInput(coupon.startDate),

      endDate:
        formatForDateInput(coupon.endDate),

      isActive:
        coupon.isActive ?? true
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (loading) return;

    setIsModalOpen(false);
    setEditing(null);
    setForm(DEFAULT_FORM);
  };

  const handleCreate = async () => {
    try {
      await couponApi.create(formatPayload());

      toast.success('Tạo mã giảm giá thành công.');

      setIsModalOpen(false);
      setForm(DEFAULT_FORM);

      setPagination(prev => ({
        ...prev,
        currentPage: 1
      }));

      await fetchCoupons(1, appliedFilters);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Tạo mã giảm giá thất bại.'
      );
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;

    try {
      await couponApi.update(
        editing.id,
        formatPayload()
      );

      toast.success(
        'Cập nhật mã giảm giá thành công.'
      );

      setIsModalOpen(false);
      setEditing(null);
      setForm(DEFAULT_FORM);

      await fetchCoupons(
        pagination.currentPage,
        appliedFilters
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Cập nhật mã giảm giá thất bại.'
      );
    }
  };

const openDeactivateModal = coupon => {
  setCouponToDeactivate(coupon);
  setIsDeactivateModalOpen(true);
};

const closeDeactivateModal = () => {
  if (loading) return;

  setIsDeactivateModalOpen(false);
  setCouponToDeactivate(null);
};

const handleDelete = async () => {
  if (!couponToDeactivate) return;

  try {
    await couponApi.delete(couponToDeactivate.id);

    toast.success('Tắt mã giảm giá thành công.');

    closeDeactivateModal();

    if (coupons.length === 1 && pagination.currentPage > 1) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    } else {
      await fetchCoupons(pagination.currentPage, appliedFilters);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      'Không thể tắt mã giảm giá.'
    );
  }
};

  return {
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
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalCoupons: pagination.totalItems,
    handlePageChange,
    filters,
    appliedFilters,
    handleFilterChange,
    handleSearch,
    handleResetFilters
  };
};

export default useCouponAdmin;