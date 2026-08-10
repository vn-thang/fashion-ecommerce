import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { flashSaleVariantApi } from '../api/flashSaleVariantApi';

export const useFlashSaleVariantForm = ({
  variant,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    flashSalePrice: '',
    flashSaleStock: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!variant) {
      setFormData({
        flashSalePrice: '',
        flashSaleStock: ''
      });
      return;
    }

    setFormData({
      flashSalePrice: variant.flashSalePrice ?? '',
      flashSaleStock: variant.flashSaleStock ?? ''
    });
  }, [variant]);

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const price = Number(formData.flashSalePrice);
    const stock = Number(formData.flashSaleStock);

    if (isNaN(price) || price <= 0) {
      toast.error('Giá Flash Sale phải lớn hơn 0');
      return false;
    }

    if (isNaN(stock) || stock <= 0) {
      toast.error('Số lượng Flash Sale phải lớn hơn 0');
      return false;
    }

    if (
      variant?.variant?.price &&
      price >= Number(variant.variant.price)
    ) {
      toast.error('Giá Flash Sale phải nhỏ hơn giá gốc');
      return false;
    }

    if (
      variant?.variant?.stockQuantity &&
      stock > Number(variant.variant.stockQuantity)
    ) {
      toast.error('Số lượng Flash Sale không được vượt tồn kho');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await flashSaleVariantApi.update(
        variant.id,
        {
          flashSalePrice: Number(formData.flashSalePrice),
          flashSaleStock: Number(formData.flashSaleStock)
        }
      );

      toast.success('Cập nhật thành công');

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Có lỗi xảy ra'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleSubmit
  };
};