import React from 'react';
import StoreSettingHeader from '../../components/admin/StoreSettingHeader';
import StoreSettingForm from '../../components/admin/StoreSettingForm';
import { useStoreSetting } from '../../hooks/useStoreSetting';

const StoreSettingPage = () => {

  const {
    loading,
    saving,
    form,
    setForm,
    handleChange,
    handleLogoChange,
    handleSubmit
  } = useStoreSetting();

const handleSave = () => {
  handleSubmit();
};

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center text-gray-500">
        Đang tải thông tin cửa hàng...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">

      <StoreSettingHeader
        onSave={handleSave}
        saving={saving}
      />

      <StoreSettingForm
      form={form}
      handleChange={handleChange}
      handleLogoChange={handleLogoChange}
      saving={saving}
      />

    </div>
  );

};

export default StoreSettingPage;