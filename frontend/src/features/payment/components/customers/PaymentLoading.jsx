import React from 'react';

const PaymentLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />

      <h2 className="mt-6 text-xl font-semibold text-gray-800">
        Đang xác minh giao dịch
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Vui lòng chờ trong giây lát...
      </p>
    </div>
  );
};

export default PaymentLoading;