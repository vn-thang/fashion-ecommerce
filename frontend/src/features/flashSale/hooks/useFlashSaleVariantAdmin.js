import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { flashSaleVariantApi } from '../api/flashSaleVariantApi';
import { categoryApi } from '../../category/api/categoryApi';
import { brandApi } from '../../brand/api/brandApi';
import { flashSaleApi } from '../api/flashSaleApi';

export const useFlashSaleVariantAdmin = flashSaleId => {
  const [loading, setLoading] = useState(false);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [flashSale, setFlashSale] = useState(null);

  const [search, setSearch] = useState('');

  const [availableSearch, setAvailableSearch] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [availablePage, setAvailablePage] = useState(1);
  const [availableTotalPages, setAvailableTotalPages] = useState(1);
  const [availableTotalItems, setAvailableTotalItems] = useState(0);

  const [selectedVariants, setSelectedVariants] = useState([]);
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editingVariant, setEditingVariant] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState([]);

  const fetchFlashSale = useCallback(async () => {
  if (!flashSaleId) return;

  try {
    const res = await flashSaleApi.getById(flashSaleId);

    const data = res.data || res;

    setFlashSale(data);
  } catch (error) {
    console.error(error);
  }
}, [flashSaleId]);
useEffect(() => {
  fetchFlashSale();
}, [fetchFlashSale]);

  const fetchVariants = useCallback(async (page = 1) => {
    if (!flashSaleId) return;

    setLoading(true);

    try {
      const res = await flashSaleVariantApi.getAll(flashSaleId, {
        page,
        limit: 10,
        keyword: search
      });

      const data = res.data || res;

      setVariants(data.flashSaleVariants || []);   
      setCurrentPage(page);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách sản phẩm Flash Sale');
    } finally {
      setLoading(false);
    }
  }, [flashSaleId, search]);

  const fetchAvailableVariants = useCallback(async (page = 1) => {
    if (!flashSaleId) return;

    setAvailableLoading(true);

    try {
      const params = {
        page,
        limit: 10
      };

      if (availableSearch.trim()) {
        params.keyword = availableSearch.trim();
      }

      if (categoryId) {
        params.categoryId = categoryId;
      }

      if (brandId) {
        params.brandId = brandId;
      }

      const res = await flashSaleVariantApi.getAvailableVariants(
        flashSaleId,
        params
      );

      const data = res.data || res;

setAvailableVariants(data.products || []);
      setAvailablePage(page);
      setAvailableTotalPages(data.pagination?.totalPages || 1);
      setAvailableTotalItems(data.pagination?.totalItems || 0);
    }catch (error) {
  console.error(error);

  toast.error(
    error.response?.data?.message || 'Không thể tải danh sách sản phẩm'
  );
} finally {
      setAvailableLoading(false);
    }
  }, [flashSaleId, availableSearch, categoryId, brandId]);

  const fetchCategories = useCallback(async () => {
  try {
    const res = await categoryApi.getAll({
      page: 1,
      limit: 1000
    });

    const data = res.data || res;

    setCategories(data.categories || []);
  } catch (error) {
    console.error(error);
  }
}, []);
  const fetchBrands = useCallback(async () => {
  try {
    const res = await brandApi.getAll({
      page: 1,
      limit: 1000
    });

    const data = res.data || res;

    setBrands(data.brands || []);
  } catch (error) {
    console.error(error);
  }
}, []); 
  useEffect(() => {
    fetchVariants(currentPage);
  }, [fetchVariants, currentPage]);

  useEffect(() => {
    if (isAddModalOpen) {
      fetchAvailableVariants(availablePage);
    }
  }, [isAddModalOpen, fetchAvailableVariants, availablePage]);

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAvailablePageChange = page => {
    if (page >= 1 && page <= availableTotalPages) {
      setAvailablePage(page);
    }
  };

const isEditable = (() => {
  if (!flashSale) return false;

  const now = new Date();
  if (new Date(flashSale.endDate) <= now) {
    return false;
  }

  if (
    flashSale.isActive &&
    new Date(flashSale.startDate) <= now &&
    new Date(flashSale.endDate) >= now
  ) {
    return false;
  }

  return true;
})();

  const handleSearch = keyword => {
    setSearch(keyword);
    setCurrentPage(1);
  };

  const handleAvailableSearch = keyword => {
    setAvailableSearch(keyword);
    setAvailablePage(1);
  };

  const handleCategoryChange = value => {
    setCategoryId(value);
    setAvailablePage(1);
  };

  const handleBrandChange = value => {
    setBrandId(value);
    setAvailablePage(1);
  };

  const toggleExpandedProduct = productId => {
  setExpandedProducts(prev =>
    prev.includes(productId)
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
  );
};

  const toggleSelect = variant => {
    setSelectedVariants(prev => {
      const exists = prev.find(
        item => item.productVariantId === variant.id
      );

      if (exists) {
        return prev.filter(
          item => item.productVariantId !== variant.id
        );
      }

      return [
        ...prev,
        {
          productVariantId: variant.id,
          flashSalePrice: variant.price,
          flashSaleStock: variant.stockQuantity
        }
      ];
    });
  };

const toggleSelectAll = () => {
  const allVariants = availableVariants.flatMap(
    product => product.variants
  );

  const allSelected =
    allVariants.length > 0 &&
    allVariants.every(variant =>
      selectedVariants.some(
        item => item.productVariantId === variant.id
      )
    );

  if (allSelected) {
    setSelectedVariants([]);
    return;
  }

  setSelectedVariants(
    allVariants.map(variant => ({
      productVariantId: variant.id,
      flashSalePrice: variant.price,
      flashSaleStock: variant.stockQuantity
    }))
  );
};

const toggleSelectProduct = product => {
  const variantIds = product.variants.map(v => v.id);

  const selectedCount = variantIds.filter(id =>
    selectedVariants.some(
      item => item.productVariantId === id
    )
  ).length;

  const isSelected =
    selectedCount === variantIds.length;

  if (isSelected) {
    setSelectedVariants(prev =>
      prev.filter(
        item =>
          !variantIds.includes(item.productVariantId)
      )
    );

    return;
  }

  setSelectedVariants(prev => {
    const result = [...prev];

    product.variants.forEach(variant => {
      if (
        !result.some(
          item =>
            item.productVariantId === variant.id
        )
      ) {
        result.push({
          productVariantId: variant.id,
          flashSalePrice: variant.price,
          flashSaleStock: variant.stockQuantity
        });
      }
    });

    return result;
  });
};

const isProductSelected = product =>
  product.variants.every(variant =>
    selectedVariants.some(
      item => item.productVariantId === variant.id
    )
  );
  const isProductIndeterminate = product => {
  const selected = product.variants.filter(variant =>
    selectedVariants.some(
      item => item.productVariantId === variant.id
    )
  ).length;

  return (
    selected > 0 &&
    selected < product.variants.length
  );
};

  const updateSelectedVariant = (productVariantId, field, value) => {
    setSelectedVariants(prev =>
      prev.map(item =>
        item.productVariantId === productVariantId
          ? {
              ...item,
              [field]:
                field === 'flashSalePrice'
                  ? Number(value)
                  : parseInt(value || 0)
            }
          : item
      )
    );
  };

  const applyBulkValue = () => {
if (!selectedVariants.length) {
  toast.error('Vui lòng chọn Variant');
  return;
}

if (bulkPrice === '' && bulkStock === '') {
  toast.error('Nhập Flash Price hoặc Flash Stock');
  return;
}

  setSelectedVariants(prev =>
    prev.map(item => ({
      ...item,
      flashSalePrice:
        bulkPrice !== ''
          ? Number(bulkPrice)
          : item.flashSalePrice,
      flashSaleStock:
        bulkStock !== ''
          ? Number(bulkStock)
          : item.flashSaleStock
    }))
  );
};

const isAllSelected = (() => {
  const allVariants = availableVariants.flatMap(
    product => product.variants
  );

  return (
    allVariants.length > 0 &&
    allVariants.every(variant =>
      selectedVariants.some(
        item => item.productVariantId === variant.id
      )
    )
  );
})();

  const handleAddVariants = async () => {
    if (!selectedVariants.length) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    try {
      setLoading(true);

      await flashSaleVariantApi.addVariants(flashSaleId, {
        variants: selectedVariants
      });

      toast.success('Thêm sản phẩm thành công');

      setSelectedVariants([]);
      setIsAddModalOpen(false);

      fetchVariants(currentPage);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'Không thể thêm sản phẩm'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async id => {
    try {
      await flashSaleVariantApi.remove(id);

      toast.success('Đã xóa sản phẩm khỏi Flash Sale');

      fetchVariants(currentPage);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'Không thể xóa sản phẩm'
      );
    }
  };

const openAddModal = async () => {
  setSelectedVariants([]);
  setExpandedProducts([]);
  setAvailableSearch('');
  setCategoryId('');
  setBrandId('');
  setBulkPrice('');
  setBulkStock('');
  setAvailablePage(1);

  await Promise.all([
    fetchCategories(),
    fetchBrands()
  ]);

  setIsAddModalOpen(true);
};

  const closeAddModal = () => {
   setSelectedVariants([]);
setExpandedProducts([]);
setIsAddModalOpen(false);
setBulkPrice('');
setBulkStock('');
  };

  const openEditModal = variant => {
    setEditingVariant(variant);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingVariant(null);
    setIsEditModalOpen(false);
  };

  const refresh = () => {
    fetchVariants(currentPage);

    if (isAddModalOpen) {
      fetchAvailableVariants(availablePage);
    }
  };

  return {
    loading,
    availableLoading,

    variants,
    availableVariants,

    groupedAvailableProducts: availableVariants,
    expandedProducts,
    toggleExpandedProduct,

    categories,
    brands,

    search,
    availableSearch,
    categoryId,
    brandId,

    currentPage,
    totalPages,
    totalItems,

    availablePage,
    availableTotalPages,
    availableTotalItems,

    selectedVariants,
    editingVariant,

    bulkPrice,
    bulkStock,
    setBulkPrice,
    setBulkStock,
    applyBulkValue,

    isAddModalOpen,
    isEditModalOpen,
    isEditable,

    handleSearch,
    handleAvailableSearch,
    handleCategoryChange,
    handleBrandChange,

    handlePageChange,
    handleAvailablePageChange,

    toggleSelect,
    updateSelectedVariant,
    toggleSelectAll,
    toggleSelectProduct,

    isAllSelected,
    isProductSelected,
    isProductIndeterminate,

    handleAddVariants,
    handleRemove,

    openAddModal,
    closeAddModal,

    openEditModal,
    closeEditModal,

    refresh,
    fetchVariants,
    fetchAvailableVariants,
    fetchCategories,
    fetchBrands,
  };
};