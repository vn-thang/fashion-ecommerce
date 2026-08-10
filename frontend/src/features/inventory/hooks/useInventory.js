import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { inventoryApi } from '../api/inventoryApi';

export const useInventory = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [pagination, setPagination] = useState({});

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [variantKeyword, setVariantKeyword] = useState('');

  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });

  const [form, setForm] = useState({
    productVariantId: '',
    quantity: '',
    note: ''
  });

const fetchTransactions = async (customFilters = filters) => {
  setLoading(true);

  try {
    const res = await inventoryApi.getTransactions(customFilters);

    setTransactions(res.data || []);
    setPagination(res.pagination || {});
  } catch (error) {
    console.error(error);
    toast.error('Không thể tải lịch sử kho.');
  } finally {
    setLoading(false);
  }
};

  const fetchVariants = async keyword => {
  setLoadingVariants(true);

  try {
    const res = await inventoryApi.getVariants(keyword);

    setVariants(res.data || []);
  } catch (error) {
    console.error(error);
    setVariants([]);
    toast.error('Không thể tải danh sách sản phẩm.');
  } finally {
    setLoadingVariants(false);
  }
};

  const fetchTransactionDetail = async id => {
     console.log(id);
  try {
    const res = await inventoryApi.getTransactionDetail(id);
 console.log(res);
    setSelectedTransaction(res.data);
    setIsDetailOpen(true);
  } catch (error) {
    console.error(error);
    toast.error('Không thể tải chi tiết giao dịch.');
  }
};
  useEffect(() => {
    fetchTransactions();
  }, []);

useEffect(() => {
  if (!isImportOpen && !isAdjustmentOpen) return;

  const keyword = variantKeyword.trim();

  if (!keyword) {
    setVariants([]);
    return;
  }
  if (form.productVariantId) return;

  const timer = setTimeout(() => {
    fetchVariants(keyword);
  }, 300);

  return () => clearTimeout(timer);
}, [
  variantKeyword,
  form.productVariantId,
  isImportOpen,
  isAdjustmentOpen
]);

  const handleChange = e => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchTransactions = () => {
    console.log('Filters:', filters);
    const newFilters = {
      ...filters,
      page: 1
    };
  console.log('Search Params:', newFilters);
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const changePage = page => {
    const newFilters = {
      ...filters,
      page
    };

    setFilters(newFilters);
    fetchTransactions(newFilters);
  };


  const resetForm = () => {
    setForm({
      productVariantId: '',
      quantity: '',
      note: ''
    });

    setVariantKeyword('');
    setVariants([]);
  };

  const openImport = () => {
    resetForm();
    setIsImportOpen(true);
  };

  const openAdjustment = () => {
    resetForm();
    setIsAdjustmentOpen(true);
  };

  const closeImport = () => {
    resetForm();
    setIsImportOpen(false);
  };

  const closeAdjustment = () => {
    resetForm();
    setIsAdjustmentOpen(false);
  };

  const importStock = async () => {
    setSaving(true);

    try {
      await inventoryApi.importStock({
        ...form,
        quantity: Number(form.quantity)
      });

      toast.success('Nhập kho thành công.');

      closeImport();

      fetchTransactions(filters);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          'Không thể nhập kho.'
      );
    } finally {
      setSaving(false);
    }
  };

  const adjustStock = async () => {
    setSaving(true);

    try {
      await inventoryApi.adjustStock({
        ...form,
        quantity: Number(form.quantity)
      });

      toast.success('Điều chỉnh tồn kho thành công.');

      closeAdjustment();

      fetchTransactions(filters);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          'Không thể điều chỉnh tồn kho.'
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    loadingVariants,

    transactions,
    variants,
    pagination,

    filters,
    form,
    variantKeyword,

    selectedTransaction,

    isImportOpen,
    isAdjustmentOpen,
    isDetailOpen,

    setVariantKeyword,
    setIsDetailOpen,

    handleChange,
    handleFilterChange,

    fetchTransactions,
    fetchTransactionDetail,

    searchTransactions,
    changePage,

    importStock,
    adjustStock,

    openImport,
    openAdjustment,

    closeImport,
    closeAdjustment
  };
};