import React, { useState, useEffect } from 'react';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';
import { addressApi } from '../../api/addressApi';
import provincesData from '../../../../assets/datas/provinces.json';

const AddressFormModal = ({ isOpen, onClose, addressToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({ 
    receiverName: '', 
    phoneNumber: '', 
    province: '', 
    ward: '', 
    addressLine: '', 
    isDefault: false 
  });
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  useEffect(() => {
    if (addressToEdit) {
      setFormData({ ...addressToEdit });
    } else {
      setFormData({ 
        receiverName: '', 
        phoneNumber: '', 
        province: '', 
        ward: '', 
        addressLine: '', 
        isDefault: false 
      });
    }
  }, [addressToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      if (addressToEdit?.id) {
        await addressApi.updateAddress(addressToEdit.id, formData);
      } else {
        await addressApi.createAddress(formData);
      }
      onSuccess(); 
      onClose();  
    } catch (error) {
      console.error('Lỗi lưu địa chỉ', error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const modalFooter = (
    <div className="flex justify-end gap-3 w-full">
      <Button variant="outline" size="md" onClick={onClose} type="button">Trở Lại</Button>
      <Button variant="primary" size="md" onClick={handleSubmit} isLoading={isSubmitLoading} className="bg-[#ee4d2d] hover:bg-[#d74123] border-none">
        Hoàn thành
      </Button>
    </div>
  );

  const availableWards = provincesData.find(p => p.FullName === formData.province)?.Wards || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={addressToEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
      footer={modalFooter}
      size="lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            label="Họ và tên" 
            required 
            value={formData.receiverName} 
            onChange={(e) => setFormData({...formData, receiverName: e.target.value})} 
          />
          <Input 
            label="Số điện thoại" 
            required 
            value={formData.phoneNumber} 
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <select 
            value={formData.province} 
            onChange={(e) => setFormData({...formData, province: e.target.value, ward: ''})} 
            className="w-full text-sm px-4 py-2.5 bg-white border border-gray-300 rounded-lg"
          >
            <option value="">Tỉnh/Thành phố</option>
            {provincesData.map(p => (
              <option key={p.Code} value={p.FullName}>{p.FullName}</option>
            ))}
          </select>
          <select 
            disabled={!formData.province} 
            value={formData.ward} 
            onChange={(e) => setFormData({...formData, ward: e.target.value})} 
            className="w-full text-sm px-4 py-2.5 bg-white border border-gray-300 rounded-lg"
          >
            <option value="">Phường/Xã</option>
            {availableWards.map(w => (
              <option key={w.Code} value={w.FullName}>{w.FullName}</option>
            ))}
          </select>
        </div>
        <Input 
          label="Địa chỉ cụ thể" 
          required 
          value={formData.addressLine} 
          onChange={(e) => setFormData({...formData, addressLine: e.target.value})} 
        />
        
        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" id="isDef" checked={formData.isDefault} disabled={addressToEdit?.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 accent-[#ee4d2d]" />
          <label htmlFor="isDef" className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</label>
        </div>
      </form>
    </Modal>
  );
};

export default AddressFormModal;