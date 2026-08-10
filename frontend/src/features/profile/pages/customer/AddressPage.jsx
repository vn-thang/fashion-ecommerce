import React, { useState } from 'react';
import Button from '../../../../shared/components/Button';
import { useAddress } from '../../hooks/customer/useAddress';
import AddressItem from '../../components/customer/AddressItem';
import AddressFormModal from '../../components/customer/AddressFormModal';

const AddressPage = () => {
  const { addresses, isLoading, fetchAddresses, deleteAddress, setDefaultAddress } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleOpenModal = (address = null) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Địa chỉ của tôi</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin nhận hàng</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => handleOpenModal(null)}
          className="bg-[#ee4d2d] hover:bg-[#d74123] border-none text-white shadow-sm flex items-center gap-1.5"
        >
          <span className="text-base font-bold">+</span> Thêm địa chỉ mới
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Đang tải dữ liệu...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">Bạn chưa có địa chỉ nào.</div>
      ) : (
        <div className="flex flex-col">
          {addresses.map(address => (
            <AddressItem 
              key={address.id}
              address={address}
              onEdit={handleOpenModal}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
            />
          ))}
        </div>
      )}
      <AddressFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addressToEdit={editingAddress}
        onSuccess={fetchAddresses}
      />
    </div>
  );
};

export default AddressPage;