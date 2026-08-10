import React, { useEffect, useState } from 'react';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';

const CANCEL_REASONS = [
  'Đặt nhầm sản phẩm',
  'Muốn thay đổi sản phẩm',
  'Muốn thay đổi địa chỉ nhận hàng',
  'Tìm được giá tốt hơn',
  'Không còn nhu cầu',
  'Khác'
];
const CancelOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  loading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedReason('');
      setOtherReason('');
    }
  }, [isOpen]);

  if (!order) return null;
  const handleSubmit = () => {
    if (!selectedReason) return;

    const reason =
      selectedReason === 'Khác'
        ? otherReason.trim()
        : selectedReason;

    if (!reason) return;
    onConfirm(reason);
  };

  const formatPrice = value =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(value || 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hủy đơn hàng"
      size="md"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Quay lại
          </Button>

          <Button
            variant="danger"
            isLoading={loading}
            onClick={handleSubmit}
            disabled={
              !selectedReason ||
              (selectedReason === 'Khác' &&
                !otherReason.trim())
            }
          >
            Xác nhận hủy
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        {/* Thông tin đơn */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">
                Đơn hàng
              </p>

              <p className="mt-1 text-base font-bold text-gray-900">
                {order?.orderNumber}
              </p>

            </div>

            <div className="text-right">

              <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">
                Tổng thanh toán
              </p>

              <p className="mt-1 text-lg font-bold text-rose-600">
                {formatPrice(order?.totalAmount || 0)}
              </p>

            </div>

          </div>

          <div className="mt-4 border-t border-amber-200 pt-3">

            <p className="text-sm text-amber-800 leading-6">
              Sau khi hủy đơn:
            </p>

            <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-5">

              <li>Sản phẩm sẽ được hoàn lại kho.</li>

              <li>
                Nếu đơn chưa thanh toán, mã giảm giá sẽ được hoàn lại
                (nếu có).
              </li>

              <li>
                Sau khi xác nhận, đơn hàng sẽ không thể khôi phục.
              </li>

            </ul>

          </div>

        </div>

        {/* Lý do */}

        <div>

          <h4 className="font-semibold text-gray-800 mb-4">
            Vui lòng chọn lý do hủy
          </h4>

          <div className="space-y-3">

            {CANCEL_REASONS.map(reason => (

              <label
                key={reason}
                className={`
                  flex items-center gap-3
                  rounded-lg border
                  px-4 py-3
                  cursor-pointer
                  transition
                  ${
                    selectedReason === reason
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-rose-300 hover:bg-gray-50'
                  }
                `}
              >

                <input
                  type="radio"
                  name="cancelReason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="h-4 w-4 accent-rose-600"
                />

                <span className="text-sm text-gray-800">
                  {reason}
                </span>

              </label>

            ))}

          </div>

        </div>

        {selectedReason === 'Khác' && (

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lý do cụ thể
            </label>

            <textarea
              rows={4}
              maxLength={300}
              placeholder="Nhập lý do hủy đơn..."
              value={otherReason}
              onChange={(e) =>
                setOtherReason(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                text-sm
                resize-none
                outline-none
                transition
                focus:border-rose-500
                focus:ring-2
                focus:ring-rose-200
              "
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {otherReason.length}/300
            </div>

          </div>

        )}

      </div>
    </Modal>
  );
};

export default CancelOrderModal;