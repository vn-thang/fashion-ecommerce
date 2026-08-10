import React from 'react';

const ShippingAddress = ({ order }) => {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-2">Địa chỉ nhận hàng</h2>
      <div className="text-sm text-gray-600 space-y-1.5">
        <p>
          <span className="font-semibold text-gray-800">{order.receiverName}</span> | {order.phoneNumber}
        </p>
        <p>{order.addressLine}, {order.ward}, {order.province}</p>
        {order.note && (
          <div className="mt-3 bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-orange-800">
            <span className="font-medium">Ghi chú:</span> {order.note}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddress;