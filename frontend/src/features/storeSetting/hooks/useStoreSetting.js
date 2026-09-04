import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { storeSettingApi } from '../api/storeSettingApi';

const INITIAL_FORM = {
  storeName: '',
  logoUrl: '',
  logoFile: null,
  hotline: '',
  zalo: '',
  email: '',
  address: '',
  openingHours: '',
  description: ''
};

export const useStoreSetting = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const fetchStoreSetting = async () => {
    setLoading(true);

    try {
      const res = await storeSettingApi.get();

      const data = res.data?.data || res.data || res;
      console.log('Store setting API:', res);
console.log('Store setting data:', data);

      setForm(prev => ({
        ...prev,
        storeName: data.storeName || '',
        logoUrl: data.logoUrl || '',
        hotline: data.hotline || '',
        zalo: data.zalo || '',
        email: data.email || '',
        address: data.address || '',
        openingHours: data.openingHours || '',
        description: data.description || '',
        logoFile: null
      }));

      return data;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Không thể tải thông tin cửa hàng'
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreSetting();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = file => {
    if (!file) return;

    setForm(prev => ({
      ...prev,
      logoFile: file,
      logoUrl: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'logoUrl' && key !== 'logoFile') {
          formData.append(key, value || '');
        }
      });

      if (form.logoFile) {
        formData.append('logo', form.logoFile);
      }

      await storeSettingApi.update(formData);

      toast.success(
        'Cập nhật thông tin cửa hàng thành công'
      );

      await fetchStoreSetting();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Cập nhật thông tin thất bại'
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    form,
    setForm,
    handleChange,
    handleLogoChange,
    handleSubmit,
    fetchStoreSetting
  };
};