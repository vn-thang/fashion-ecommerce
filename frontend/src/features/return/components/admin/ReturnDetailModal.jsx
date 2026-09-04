import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';
import ReturnStatus from '../ReturnStatus';
import ReturnProductList from './ReturnProductList';

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

const formatPrice = value =>
  Number(value || 0).toLocaleString('vi-VN') + 'đ';

const ReturnDetailModal = ({
  isOpen,
  onClose,
  returnRequest,
  loading,
  actionLoading,
  onApprove,
  onReject,
  onReceived,
  onComplete
}) => {
  const [rejectReason, setRejectReason] = useState('');

  if (!returnRequest && !loading) {
    return null;
  }

  const status = returnRequest?.status;
  const payment = returnRequest?.order?.payment;

  const handleReject = async () => {
    if (!rejectReason.trim()) return;

    await onReject(
      returnRequest.id,
      rejectReason.trim()
    );

    setRejectReason('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết yêu cầu hoàn hàng"
      size="xl"
      footer={
        <Button
          variant="outline"
          onClick={onClose}
          disabled={actionLoading}
        >
          Đóng
        </Button>
      }
    >
      {loading || !returnRequest ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-500">
          Đang tải thông tin yêu cầu...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-gray-500">Mã yêu cầu</div>
              <div className="mt-1 font-bold text-slate-800">
                #{returnRequest.id.slice(0, 8)}
              </div>
            </div>

            <ReturnStatus status={status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">Mã đơn hàng</div>
              <div className="mt-1 font-semibold text-slate-800">
                {returnRequest.order?.orderNumber || '—'}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">Khách hàng</div>
              <div className="mt-1 font-semibold text-slate-800">
                {returnRequest.user?.fullName || '—'}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {returnRequest.user?.email || '—'}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">
                Phương thức thanh toán
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {PAYMENT_METHOD_LABEL[payment?.paymentMethod] ||
                  'Không xác định'}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">
                Trạng thái thanh toán
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {PAYMENT_STATUS_LABEL[payment?.status] ||
                  'Không xác định'}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Sản phẩm
            </h3>

            <ReturnProductList items={returnRequest.items} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">
                Lý do trả hàng
              </div>
              <div className="mt-1 text-sm font-medium text-slate-800">
                {RETURN_REASON_LABEL[returnRequest.reason] || '—'}
              </div>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <div className="text-xs text-gray-500">
                Số tiền hoàn
              </div>
              <div className="mt-1 text-lg font-bold text-orange-600">
                {returnRequest.refundAmount
                  ? formatPrice(returnRequest.refundAmount)
                  : 'Chưa xác định'}
              </div>
            </div>
          </div>

          {returnRequest.description && (
            <div>
              <div className="text-xs text-gray-500">
                Mô tả của khách hàng
              </div>
              <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                {returnRequest.description}
              </div>
            </div>
          )}

          {returnRequest.rejectReason && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="text-sm font-semibold text-red-700">
                Lý do từ chối
              </div>
              <div className="mt-1 text-sm leading-6 text-red-600">
                {returnRequest.rejectReason}
              </div>
            </div>
          )}

          {status === 'REQUESTED' && (
            <div className="space-y-4 rounded-xl border border-gray-100 bg-slate-50 p-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Xử lý yêu cầu
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Kiểm tra thông tin trước khi duyệt hoặc từ chối yêu cầu.
                </p>
              </div>

              <div>
                <label
                  htmlFor="reject-reason"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Lý do từ chối
                </label>

                <textarea
                  id="reject-reason"
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do nếu từ chối..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={handleReject}
                  disabled={
                    actionLoading || !rejectReason.trim()
                  }
                >
                  {actionLoading ? 'Đang xử lý...' : 'Từ chối'}
                </Button>

                <Button
                  variant="primary"
                  onClick={() => onApprove(returnRequest.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Đang xử lý...' : 'Duyệt yêu cầu'}
                </Button>
              </div>
            </div>
          )}

          {status === 'APPROVED' && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
              Đã duyệt yêu cầu. Đang chờ khách gửi sản phẩm về.
            </div>
          )}

          {status === 'SHIPPING' && (
            <div className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-indigo-700">
                  Khách đang gửi hàng về
                </div>
                <div className="mt-1 text-xs text-indigo-600">
                  Xác nhận khi cửa hàng đã nhận được sản phẩm.
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => onReceived(returnRequest.id)}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Đang xử lý...'
                  : 'Xác nhận đã nhận hàng'}
              </Button>
            </div>
          )}

          {status === 'RECEIVED' && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-emerald-700">
                    Đã nhận hàng hoàn trả
                  </div>
                  <div className="mt-1 text-xs text-emerald-600">
                    Kiểm tra sản phẩm trước khi xác nhận hoàn tiền.
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => onComplete(returnRequest.id)}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? 'Đang xử lý...'
                    : 'Hoàn tiền & hoàn tất'}
                </Button>
              </div>
            </div>
          )}

          {status === 'COMPLETED' && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
              Yêu cầu trả hàng đã được hoàn tất và tiền đã được xử lý.
            </div>
          )}

          {status === 'REJECTED' && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              Yêu cầu trả hàng đã bị từ chối.
            </div>
          )}

          {status === 'CANCELLED' && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              Yêu cầu trả hàng đã được khách hàng hủy.
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ReturnDetailModal;