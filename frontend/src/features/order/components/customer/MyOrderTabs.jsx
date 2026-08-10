import React from 'react';

const TABS = [
  { id: '', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ xác nhận' },
  { id: 'PROCESSING', label: 'Đang xử lý' },
  { id: 'SHIPPING', label: 'Đang giao' },
  { id: 'COMPLETED', label: 'Hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' },
   { id: 'RETURN', label: 'Hoàn hàng' }
];

const MyOrderTabs = ({ currentTab, onTabChange }) => {
  return (
    <div className="bg-white sticky top-0 z-10 flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center border-b-2 transition-colors whitespace-nowrap px-4
            ${currentTab === tab.id 
              ? 'border-[#ee4d2d] text-[#ee4d2d]' 
              : 'border-transparent text-gray-700 hover:text-[#ee4d2d]'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MyOrderTabs;