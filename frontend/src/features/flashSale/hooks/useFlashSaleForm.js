import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { flashSaleApi } from '../api/flashSaleApi';

export const useFlashSaleForm = ({
  flashSale,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!flashSale) {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        isActive: true
      });
      return;
    }

    setFormData({
      name: flashSale.name || '',
      startDate: formatDateTime(flashSale.startDate),
      endDate: formatDateTime(flashSale.endDate),
      isActive: flashSale.isActive
    });
  }, [flashSale]);

  const formatDateTime = value => {
    if (!value) return '';

    const date = new Date(value);

    const offset = date.getTimezoneOffset();

    const local = new Date(date.getTime() - offset * 60000);

    return local.toISOString().slice(0, 16);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      toast.error('Tên Flash Sale không được để trống');
      return false;
    }

    if (!formData.startDate) {
      toast.error('Vui lòng chọn thời gian bắt đầu');
      return false;
    }

    if (!formData.endDate) {
      toast.error('Vui lòng chọn thời gian kết thúc');
      return false;
    }

    if (
      new Date(formData.startDate) >=
      new Date(formData.endDate)
    ) {
      toast.error('Ngày kết thúc phải lớn hơn ngày bắt đầu');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      if (flashSale) {
        await flashSaleApi.update(flashSale.id, formData);
        toast.success('Cập nhật Flash Sale thành công');
      } else {
        await flashSaleApi.create(formData);
        toast.success('Tạo Flash Sale thành công');
      }

      onSuccess?.();
      onClose?.();

    } catch (error) {

       console.log('STATUS:', error.response?.status);
  console.log('DATA:', error.response?.data);
  console.log('REQUEST:', error.config?.data);
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