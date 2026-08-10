import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { storeSettingApi } from '../api/storeSettingApi';

export const useStoreSetting = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

 const [form, setForm] = useState({
  storeName: '',
  logoUrl: '',
  logoFile: null,
  hotline: '',
  zalo: '',
  email: '',
  address: '',
  openingHours: '',
  description: ''
});

  const fetchStoreSetting = async () => {
    setLoading(true);

    try {
      const res = await storeSettingApi.get();
      const data = res.data || res;

      setForm({
        storeName: data.storeName || '',
        logoUrl: data.logoUrl || '',
        hotline: data.hotline || '',
        zalo: data.zalo || '',
        email: data.email || '',
        address: data.address || '',
        openingHours: data.openingHours || '',
        description: data.description || ''
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Không thể tải thông tin cửa hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreSetting();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleLogoChange = (file) => {
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

      formData.append('storeName', form.storeName);
      formData.append('hotline', form.hotline);
      formData.append('zalo', form.zalo);
      formData.append('email', form.email);
      formData.append('address', form.address);
      formData.append('openingHours', form.openingHours);
      formData.append('description', form.description);

     if (form.logoFile) {
  formData.append('logo', form.logoFile);
}

      await storeSettingApi.update(formData);

      toast.success('Cập nhật thông tin cửa hàng thành công');

      await fetchStoreSetting();

    setForm(prev => ({
  ...prev,
  logoFile: null
}));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
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