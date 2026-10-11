import { Check, X } from 'lucide-react';

const STEPS = [
  { status: 'REQUESTED', label: 'Đã gửi yêu cầu' },
  { status: 'APPROVED', label: 'Đã duyệt' },
  { status: 'SHIPPING', label: 'Đang gửi hàng' },
  { status: 'RECEIVED', label: 'Đã nhận hàng' },
  { status: 'COMPLETED', label: 'Hoàn tiền hoàn tất' }
];

const formatVietnamDateTime = value => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hourCycle: 'h23'
  }).format(date);
};

const ReturnTimeline = ({ status, returnRequest }) => {
  const timestamps = {
    REQUESTED: returnRequest?.requestedAt || returnRequest?.createdAt,
    APPROVED: returnRequest?.approvedAt,
    SHIPPING:
      status === 'SHIPPING'
        ? returnRequest?.updatedAt
        : null,
    RECEIVED: returnRequest?.receivedAt,
    COMPLETED: returnRequest?.completedAt
  };

  if (status === 'REJECTED') {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <X size={16} strokeWidth={2.5} />
          </span>
          <div>
            <div className="text-sm font-semibold text-rose-700">
              Yêu cầu đã bị từ chối
            </div>
            {formatVietnamDateTime(returnRequest?.rejectedAt) && (
              <div className="mt-1 text-xs text-rose-600">
                {formatVietnamDateTime(returnRequest.rejectedAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = status === 'CANCELLED';
  const currentIndex = isCancelled
    ? -1
    : STEPS.findIndex(step => step.status === status);
  const visibleSteps = isCancelled
    ? STEPS.filter(
        step =>
          step.status === 'REQUESTED' ||
          Boolean(timestamps[step.status])
      )
    : STEPS;
  const cancelledAt =
    returnRequest?.cancelledAt || returnRequest?.updatedAt;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 pb-2 sm:p-5">
      <ol className="flex min-w-[680px]">
        {visibleSteps.map((step, index) => {
          const completed = index < currentIndex;
          const current = step.status === status;
          const isFinalStepComplete =
            current && step.status === 'COMPLETED';
          const dateTime = formatVietnamDateTime(
            timestamps[step.status]
          );

          return (
            <li
              key={step.status}
              className="relative flex min-w-0 flex-1 flex-col items-center px-2 text-center"
            >
              {(index < visibleSteps.length - 1 || isCancelled) && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${
                    isCancelled || index < currentIndex
                      ? 'bg-[#ee4d2d]'
                      : 'bg-slate-200'
                  }`}
                />
              )}

              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  current
                    ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white ring-4 ring-orange-100'
                    : completed
                      ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white'
                      : 'border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                {completed || isFinalStepComplete ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  index + 1
                )}
              </span>

              <span
                className={`mt-2 text-xs font-medium leading-5 ${
                  current
                    ? 'text-[#c64b35]'
                    : completed
                      ? 'text-slate-700'
                      : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>

              {dateTime && (
                <span className="mt-1 min-h-8 text-[11px] leading-4 text-slate-500">
                  {dateTime}
                </span>
              )}
            </li>
          );
        })}
        {isCancelled && (
          <li className="relative flex min-w-0 flex-1 flex-col items-center px-2 text-center">
            <span
              aria-hidden="true"
              className="absolute right-1/2 top-4 h-0.5 w-full bg-rose-300"
            />
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-rose-500 bg-rose-500 text-white ring-4 ring-rose-100">
              <X size={16} strokeWidth={2.5} />
            </span>
            <span className="mt-2 text-xs font-medium leading-5 text-rose-700">
              Đã hủy yêu cầu
            </span>
            {formatVietnamDateTime(cancelledAt) && (
              <span className="mt-1 min-h-8 text-[11px] leading-4 text-rose-600">
                {formatVietnamDateTime(cancelledAt)}
              </span>
            )}
          </li>
        )}
      </ol>
    </div>
  );
};

export default ReturnTimeline;