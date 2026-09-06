import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import ReturnStatus from '../ReturnStatus';
import ReturnTimeline from './ReturnTimeline';

const PAYMENT_METHOD_LABEL = {
  VNPAY: 'VNPay',
  COD: 'Thanh toán khi nhận hàng'
};

const PAYMENT_STATUS_LABEL = {
  PENDING: 'Chờ thanh toán',
  SUCCESS: 'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền',
  CANCELLED: 'Đã hủy'
};

const RETURN_REASON_LABEL = {
  WRONG_SIZE: 'Không vừa kích thước',
  WRONG_PRODUCT: 'Nhận sai sản phẩm',
  DEFECTIVE: 'Sản phẩm bị lỗi',
  NOT_AS_DESCRIBED: 'Sản phẩm không giống mô tả',
  OTHER: 'Lý do khác'
};

const ReturnDetailModal = ({
  selectedReturn,
  detailLoading,
  submitting,
  onClose,
  onMarkShipping,
  onCancel,
  formatPrice
}) => {
  const payment = selectedReturn?.order?.payment;

  return (
    <Modal
      isOpen={Boolean(selectedReturn)}
      onClose={onClose}
      title="Chi tiết yêu cầu trả hàng"
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <div>
            {selectedReturn &&
              ['REQUESTED', 'APPROVED'].includes(selectedReturn.status) && (
                <Button
                  variant="danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Bạn có chắc chắn muốn hủy yêu cầu trả hàng không?'
                      )
                    ) {
                      onCancel(selectedReturn.id);
                    }
                  }}
                  disabled={submitting}
                >
                  {submitting ? 'Đang hủy...' : 'Hủy yêu cầu'}
                </Button>
              )}
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Đóng
          </Button>
        </div>
      }
    >
      {detailLoading || !selectedReturn ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Đang tải thông tin...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-gray-500">Mã yêu cầu</div>
              <div className="mt-1 font-semibold text-slate-800">
                #{selectedReturn.id.slice(0, 8)}
              </div>
            </div>
            <ReturnStatus status={selectedReturn.status} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="text-xs text-gray-500">Đơn hàng</div>
              <div className="mt-1 font-semibold text-slate-800">
                {selectedReturn.order?.orderNumber}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="text-xs text-gray-500">
                Số tiền hoàn
              </div>
              <div className="mt-1 text-sm font-bold text-orange-600">
                {formatPrice(selectedReturn.refundAmount)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="text-xs text-gray-500">
                Phương thức thanh toán
              </div>
              <div className="mt-1 text-xs font-semibold text-gray-800">
                {PAYMENT_METHOD_LABEL[payment?.paymentMethod] ||
                  'Không xác định'}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="text-xs text-gray-500">
                Trạng thái thanh toán
              </div>
              <div className="mt-1 text-xs font-semibold text-gray-800">
                {PAYMENT_STATUS_LABEL[payment?.status] ||
                  'Không xác định'}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold text-slate-800">
              Sản phẩm
            </div>

            <div className="space-y-3">
              {selectedReturn.items?.map(item => {
                const orderItem = item.orderItem;
                const product =
                  orderItem?.variant?.product;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl border border-gray-100 p-4"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      {product?.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={orderItem?.productName || 'Sản phẩm'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg text-gray-300">
                          🖼️
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800">
                        {orderItem?.productName}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {orderItem?.color &&
                          `Màu: ${orderItem.color}`}
                        {orderItem?.color &&
                          orderItem?.size &&
                          ' · '}
                        {orderItem?.size &&
                          `Size: ${orderItem.size}`}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        Giá mua:{' '}
                        <span className="font-medium text-gray-700">
                          {formatPrice(orderItem?.unitPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-xs font-semibold text-gray-700">
                      × {item.quantity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="text-xs text-gray-500">Lý do</div>
              <div className="mt-1 text-xs font-medium text-gray-800">
              {RETURN_REASON_LABEL[selectedReturn.reason] || 'Không xác định'}
            </div>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <div className="text-xs text-gray-500">
                Tiền hoàn dự kiến
              </div>
              <div className="mt-1 text-sm font-bold text-orange-600">
                {formatPrice(selectedReturn.refundAmount)}
              </div>
            </div>
          </div>

          {selectedReturn.description && (
            <div>
              <div className="text-xs text-gray-500">Mô tả</div>
              <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs leading-6 text-gray-700 whitespace-pre-line">
                {selectedReturn.description}
              </div>
            </div>
          )}

          {selectedReturn.rejectReason && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="text-xs font-semibold text-red-700">
                Lý do từ chối
              </div>
              <div className="mt-1 text-xs leading-6 text-red-600">
                {selectedReturn.rejectReason}
              </div>
            </div>
          )}

          <div>
            <div className="mb-3 text-xs font-semibold text-slate-800">
              Tiến trình trả hàng
            </div>

            <ReturnTimeline
              status={selectedReturn.status}
              returnRequest={selectedReturn}
            />
          </div>

          {selectedReturn.status === 'APPROVED' && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="text-xs font-medium text-blue-700">
                Yêu cầu đã được duyệt.
              </div>

              <div className="mt-1 text-xs text-blue-600">
                Sau khi gửi hàng, hãy xác nhận để cửa hàng tiếp nhận.
              </div>

              <div className="mt-3">
                <Button
                  variant="primary"
                  onClick={() => onMarkShipping(selectedReturn.id)}
                  disabled={submitting}
                >
                  {submitting
                    ? 'Đang cập nhật...'
                    : 'Xác nhận đã gửi hàng'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ReturnDetailModal;