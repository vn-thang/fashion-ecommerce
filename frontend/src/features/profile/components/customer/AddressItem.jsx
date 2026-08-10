import React from 'react';
import Button from '../../../../shared/components/Button';

const AddressItem = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-150 last:border-0">
      <div className="flex-1 space-y-2 text-left">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-gray-800 text-base">{address.receiverName}</span>
          <span className="h-3 w-[1px] bg-gray-300 hidden sm:block"></span>
          <span className="text-gray-500 text-sm">{address.phoneNumber}</span>
          
          {address.isDefault && (
            <span className="inline-flex items-center rounded-sm bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[11px] font-medium text-[#ee4d2d]">
              Mặc định
            </span>
          )}
        </div>
        
        <div className="text-gray-600 text-sm space-y-0.5">
          <p>{address.addressLine}</p>
          <p>{`${address.ward}, ${address.province}`}</p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3 shrink-0 min-w-[140px]">
        <div className="flex items-center gap-3 text-sm">
          <button 
            onClick={() => onEdit(address)}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors outline-none"
          >
            Cập nhật
          </button>
          {!address.isDefault && (
            <>
              <span className="text-gray-200">|</span>
              <button 
                onClick={() => onDelete(address.id)}
                className="text-rose-600 hover:text-rose-800 font-medium transition-colors outline-none"
              >
                Xóa
              </button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={address.isDefault}
          onClick={() => onSetDefault(address.id)}
          className={`text-xs rounded-sm h-8 font-normal ${
            address.isDefault 
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Thiết lập mặc định
        </Button>
      </div>
    </div>
  );
};

export default AddressItem;