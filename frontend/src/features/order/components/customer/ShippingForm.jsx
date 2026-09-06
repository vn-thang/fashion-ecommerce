import React from 'react';
import Input from '../../../../shared/components/Input';

const ShippingForm = ({
  shippingAddress,
  onOpenSelectModal,
  note,
  setNote,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-gray-150">
        <h2 className="text-sm font-bold text-gray-800">
          Thông tin nhận hàng
        </h2>

        <button
          type="button"
          onClick={onOpenSelectModal}
          className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition"
        >
          {shippingAddress?.id
            ? 'Thay đổi'
            : '+ Chọn địa chỉ'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="receiverName"
          label="Họ và tên người nhận"
          required
          readOnly
          value={shippingAddress?.receiverName || ''}
          className="bg-gray-50 cursor-not-allowed opacity-90"
        />

        <Input
          id="phoneNumber"
          label="Số điện thoại"
          required
          readOnly
          value={shippingAddress?.phoneNumber || ''}
          className="bg-gray-50 cursor-not-allowed opacity-90"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="province"
          label="Tỉnh / Thành phố"
          required
          readOnly
          value={shippingAddress?.province || ''}
          className="bg-gray-50 cursor-not-allowed opacity-90"
        />

        <Input
          id="ward"
          label="Phường / Xã"
          required
          readOnly
          value={shippingAddress?.ward || ''}
          className="bg-gray-50 cursor-not-allowed opacity-90"
        />
      </div>

      <Input
        id="addressLine"
        label="Địa chỉ cụ thể"
        required
        readOnly
        value={shippingAddress?.addressLine || ''}
        className="bg-gray-50 cursor-not-allowed opacity-90"
      />

      <div className="text-left space-y-1.5 pt-2">
        <label
          htmlFor="note"
          className="block text-xs font-semibold text-gray-700"
        >
          Ghi chú (Tùy chọn)
        </label>

        <textarea
          id="note"
          rows="2"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full text-xs p-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm transition-all"
          placeholder="Ghi chú cho shipper..."
        />
      </div>

      <div className="pt-2">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">
          Phương thức thanh toán
        </h3>

        <div className="space-y-3">
          <label
            className={`flex items-center p-4 rounded-lg border cursor-pointer transition
            ${
              paymentMethod === 'COD'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={e =>
                setPaymentMethod(e.target.value)
              }
              className="w-4 h-4 accent-emerald-600 mr-3"
            />

            <div>
              <p className="font-semibold text-gray-800">
                Thanh toán khi nhận hàng (COD)
              </p>

              <p className="text-xs text-gray-500">
                Thanh toán bằng tiền mặt khi nhận hàng.
              </p>
            </div>
          </label>

          <label
            className={`flex items-center p-4 rounded-lg border cursor-pointer transition
            ${
              paymentMethod === 'VNPAY'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <input
              type="radio"
              value="VNPAY"
              checked={paymentMethod === 'VNPAY'}
              onChange={e =>
                setPaymentMethod(e.target.value)
              }
              className="w-4 h-4 accent-blue-600 mr-3"
            />

            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                Thanh toán qua VNPAY
              </p>

              <p className="text-xs text-gray-500">
                Thanh toán trực tuyến bằng QR, ATM, Visa,
                Mastercard...
              </p>
            </div>

          </label>

        </div>
      </div>
    </div>
  );
};

export default ShippingForm;