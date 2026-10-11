import { useState } from 'react';
import Button from '../../../../shared/components/Button';
import { useAddress } from '../../hooks/customer/useAddress';
import AddressItem from '../../components/customer/AddressItem';
import AddressFormModal from '../../components/customer/AddressFormModal';
import CustomerPageHeader from '../../../../shared/components/CustomerPageHeader';

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
      <CustomerPageHeader
        title="Địa chỉ nhận hàng"
        description="Quản lý địa chỉ để thanh toán nhanh và chính xác hơn."
        className="mb-5"
        action={<Button
          variant="primary" 
          onClick={() => handleOpenModal(null)}
          className="bg-[#ee4d2d] hover:bg-[#d74123] border-none text-white shadow-sm"
        >
          Thêm địa chỉ
        </Button>}
      />
      {isLoading ? (
        <div className="rounded-xl bg-slate-50 py-16 text-center text-sm text-slate-500">Đang tải dữ liệu...</div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-16 text-center text-sm text-slate-500">Bạn chưa có địa chỉ nào. Thêm địa chỉ để thuận tiện khi đặt hàng.</div>
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