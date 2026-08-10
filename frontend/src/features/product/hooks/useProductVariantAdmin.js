import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productAdminApi } from '../api/productAdminApi';
import { inventoryApi } from '../../inventory/api/inventoryApi';

const initialVariantForm = {
  sku: '',
  color: '',
  size: '',
  price: '',
  stockQuantity: '',
  status: 'ACTIVE'
};

export const useProductVariantAdmin = (productId) => {
  const [variants, setVariants] = useState([]);
  const [form, setForm] = useState(initialVariantForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingVariantId, setDeletingVariantId] = useState(null);

  const [adjustingVariantId, setAdjustingVariantId] = useState(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [isAdjustingStock, setIsAdjustingStock] = useState(false);

  const loadVariants = useCallback(async () => {
    if (!productId) {
      setVariants([]);
      return;
    }

    setIsFetching(true);

    try {
      const res = await productAdminApi.getById(productId);
      const productData = res?.data?.data || res?.data || {};
      setVariants(productData.variants || []);
    } catch (error) {
      console.error('Load variants error:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách phân loại');
    } finally {
      setIsFetching(false);
    }
  }, [productId]);

  useEffect(() => {
    loadVariants();
  }, [loadVariants]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEditClick = useCallback((variant) => {
    setForm({
      sku: variant.sku || '',
      color: variant.color || '',
      size: variant.size || '',
      price: variant.price ?? '',
      stockQuantity: variant.stockQuantity ?? '',
      status: variant.status || 'ACTIVE'
    });
    setEditingId(variant.id);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setForm(initialVariantForm);
    setEditingId(null);
  }, []);

  const handleSubmitForm = useCallback(async (e) => {
    e.preventDefault();

    if (!form.sku || !form.price) {
      return toast.error('Vui lòng nhập đủ SKU và Giá');
    }

    const price = Number(form.price);

    if (Number.isNaN(price) || price <= 0) {
      return toast.error('Giá sản phẩm không hợp lệ');
    }

    setIsLoading(true);

    try {
      const payload = {
        sku: form.sku.trim(),
        color: form.color?.trim() || '',
        size: form.size?.trim() || '',
        price,
        status: form.status
      };

      if (editingId) {
        await productAdminApi.updateVariant(editingId, payload);
        toast.success('Cập nhật phân loại thành công 📝');
      } else {
        await productAdminApi.createVariant(productId, {
          ...payload,
          stockQuantity: Number(form.stockQuantity)
        });
        toast.success('Thêm phân loại thành công 🎉');
      }

      setForm(initialVariantForm);
      setEditingId(null);
      await loadVariants();
    } catch (error) {
      console.error('Variant operation error:', error);
      toast.error(error.response?.data?.message || 'Lỗi thao tác phân loại');
    } finally {
      setIsLoading(false);
    }
  }, [form, editingId, productId, loadVariants]);

  const handleDeleteVariant = useCallback(async (variantId) => {
    if (!variantId) return;

    if (!window.confirm('Bạn có chắc chắn muốn tắt phân loại này?')) return;

    setDeletingVariantId(variantId);

    try {
      await productAdminApi.deactivateVariant(variantId);

      setVariants(prev => prev.filter(variant => variant.id !== variantId));

      if (editingId === variantId) {
        setForm(initialVariantForm);
        setEditingId(null);
      }

      if (adjustingVariantId === variantId) {
        setAdjustingVariantId(null);
        setAdjustmentQuantity('');
        setAdjustmentNote('');
      }

      toast.success('Đã tắt phân loại thành công!');
    } catch (error) {
      console.error('Deactivate variant error:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tắt phân loại');
    } finally {
      setDeletingVariantId(null);
    }
  }, [editingId, adjustingVariantId]);

  const handleActivateVariant = useCallback(async variantId => {
  if (!variantId) return;

  try {
    await productAdminApi.activateVariant(variantId);
    toast.success('Đã hiện lại phân loại thành công!');
    await loadVariants();
  } catch (error) {
    console.error('Activate variant error:', error);
    toast.error(
      error.response?.data?.message ||
      'Lỗi khi hiện lại phân loại'
    );
  }
}, [loadVariants]);

  const openStockAdjustment = useCallback((variant) => {
    setAdjustingVariantId(variant.id);
    setAdjustmentQuantity('');
    setAdjustmentNote('');
  }, []);

  const closeStockAdjustment = useCallback(() => {
    setAdjustingVariantId(null);
    setAdjustmentQuantity('');
    setAdjustmentNote('');
  }, []);

  const handleAdjustmentQuantityChange = useCallback((e) => {
    setAdjustmentQuantity(e.target.value);
  }, []);

  const handleAdjustmentNoteChange = useCallback((e) => {
    setAdjustmentNote(e.target.value);
  }, []);

  const adjustStock = useCallback(async () => {
    if (!adjustingVariantId) return;

    if (adjustmentQuantity === '') {
      return toast.error('Vui lòng nhập số lượng điều chỉnh');
    }

    const quantity = Number(adjustmentQuantity);

    if (Number.isNaN(quantity) || quantity === 0) {
      return toast.error('Số lượng điều chỉnh không hợp lệ');
    }

    const variant = variants.find(item => item.id === adjustingVariantId);

    if (!variant) {
      return toast.error('Không tìm thấy phân loại');
    }

    if (variant.stockQuantity + quantity < 0) {
      return toast.error('Số lượng tồn kho không thể nhỏ hơn 0');
    }

    setIsAdjustingStock(true);

    try {
      await inventoryApi.adjustStock({
        productVariantId: adjustingVariantId,
        quantity,
        note: adjustmentNote.trim() || 'Điều chỉnh tồn kho từ quản lý sản phẩm'
      });

      toast.success('Điều chỉnh tồn kho thành công');

      closeStockAdjustment();
      await loadVariants();
    } catch (error) {
      console.error('Adjust stock error:', error);
      toast.error(error.response?.data?.message || 'Không thể điều chỉnh tồn kho');
    } finally {
      setIsAdjustingStock(false);
    }
  }, [adjustingVariantId, adjustmentQuantity, adjustmentNote, variants, closeStockAdjustment, loadVariants]);

  return {
    variants,
    form,
    setForm,
    editingId,
    isLoading,
    isFetching,
    deletingVariantId,
    loadVariants,
    handleInputChange,
    handleEditClick,
    handleCancelEdit,
    handleSubmitForm,
    handleDeleteVariant,
    handleActivateVariant,
    adjustingVariantId,
    adjustmentQuantity,
    adjustmentNote,
    isAdjustingStock,
    openStockAdjustment,
    closeStockAdjustment,
    handleAdjustmentQuantityChange,
    handleAdjustmentNoteChange,
    adjustStock
  };
};