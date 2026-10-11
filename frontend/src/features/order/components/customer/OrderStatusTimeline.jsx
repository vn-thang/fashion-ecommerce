import { Check, RotateCcw, X } from 'lucide-react';

const ORDER_STEPS = [
  { status: 'PENDING', label: 'Chờ xác nhận' },
  { status: 'PROCESSING', label: 'Đang xử lý' },
  { status: 'SHIPPING', label: 'Đang giao hàng' },
  { status: 'COMPLETED', label: 'Đã giao' }
];

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  COMPLETED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  RETURN: 'Hoàn trả'
};

const formatVietnamDateTime = value => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hourCycle: 'h23'
  }).formatToParts(date);

  const get = type =>
    parts.find(part => part.type === type)?.value || '';

  return `${get('hour')}:${get('minute')} ${get('day')}/${get('month')}/${get('year')}`;
};

const getLatestEventByStatus = history => {
  const events = new Map();

  history.forEach(event => {
    if (event?.newStatus) {
      events.set(event.newStatus, event);
    }
  });

  return events;
};

const OrderStatusTimeline = ({ order }) => {
  const history = order.statusHistory || [];
  const latestEvents = getLatestEventByStatus(history);
  const currentStatusEvent = latestEvents.get(order.status);

  const isCancelled = order.status === 'CANCELLED';
  const isReturned = order.status === 'RETURN';
  const currentIndex = ORDER_STEPS.findIndex(
    step => step.status === order.status
  );
  const cancelEvent = latestEvents.get('CANCELLED');
  const cancellationTime = cancelEvent?.changedAt || order.cancelledAt;
  const cancellationTimestamp = cancellationTime
    ? new Date(cancellationTime).getTime()
    : null;
  const cancelledSteps = ORDER_STEPS.filter(step => {
    if (step.status === 'PENDING' || step.status === cancelEvent?.oldStatus) {
      return true;
    }

    const event = latestEvents.get(step.status);

    return Boolean(
      event &&
        (
          cancellationTimestamp === null ||
          new Date(event.changedAt).getTime() <= cancellationTimestamp
        )
    );
  });
  const cancelledAt = formatVietnamDateTime(
    cancellationTime
  );

  return (
    <section
      aria-label="Tiến trình đơn hàng"
      className="my-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <h2 className="mb-5 text-sm font-semibold leading-5 text-slate-800">
        Tiến trình đơn hàng
      </h2>

      <div className="overflow-x-auto pb-2">
        <ol className={`flex ${isCancelled ? 'min-w-[420px]' : 'min-w-[620px]'}`}>
          {(isCancelled ? cancelledSteps : ORDER_STEPS).map((step, index, steps) => {
            const event = latestEvents.get(step.status);
            const isCurrent =
              !isCancelled &&
              !isReturned &&
              order.status === step.status;
            const isFinalStepComplete =
              isCurrent && step.status === 'COMPLETED';
            const isRecordedComplete =
              isCancelled ||
              (!isCurrent &&
                (currentIndex >= 0
                ? index < currentIndex
                : isReturned &&
                  Boolean(event) &&
                  (!currentStatusEvent ||
                    new Date(event.changedAt) <=
                      new Date(currentStatusEvent.changedAt))));
            const isWaiting =
              !event &&
              !isCurrent &&
              !isCancelled &&
              !isReturned &&
              currentIndex >= 0 &&
              index > currentIndex;
            const dateTime = formatVietnamDateTime(
              event?.changedAt ||
                (step.status === 'PENDING' ? order.createdAt : null)
            );
            const hasOrangeConnector =
              index < steps.length - 1 && isRecordedComplete;

            return (
              <li
                key={step.status}
                className="relative flex min-w-0 flex-1 flex-col items-center px-2 text-center"
              >
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-4 h-0.5 w-full ${
                      hasOrangeConnector
                        ? 'bg-[#ee4d2d]'
                        : 'bg-slate-200'
                    }`}
                  />
                )}

                <span
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                    isCurrent
                      ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white ring-4 ring-orange-100'
                      : isRecordedComplete
                        ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white'
                        : 'border-slate-200 bg-slate-100 text-slate-400'
                  }`}
                >
                  {isRecordedComplete || isFinalStepComplete ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </span>

                <span
                  className={`mt-2 text-xs font-medium leading-5 ${
                    isCurrent
                      ? 'text-[#c64b35]'
                      : isRecordedComplete
                        ? 'text-slate-700'
                        : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>

                <span
                  className={`mt-1 min-h-8 text-[11px] leading-4 ${
                    isCurrent
                      ? 'font-medium text-[#c64b35]'
                      : 'text-slate-500'
                  }`}
                >
                  {dateTime || (isWaiting ? 'Đang chờ' : null)}
                </span>
              </li>
            );
          })}
          {isCancelled && (
            <li className="relative flex min-w-0 flex-1 flex-col items-center px-2 text-center">
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-4 h-0.5 w-full ${
                  cancelledSteps.length ? 'bg-[#ee4d2d]' : 'bg-rose-300'
                }`}
              />
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-rose-500 bg-rose-500 text-white ring-4 ring-rose-100">
                <X size={16} strokeWidth={2.5} />
              </span>
              <span className="mt-2 text-xs font-medium leading-5 text-rose-700">
                Đã hủy
              </span>
              {cancelledAt && (
                <span className="mt-1 min-h-8 text-[11px] font-medium leading-4 text-rose-600">
                  {cancelledAt}
                </span>
              )}
            </li>
          )}
        </ol>
      </div>

      {isReturned && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <RotateCcw size={16} />
          </span>
          <div>
            <p className="text-xs font-semibold leading-5 text-violet-800">
              {STATUS_LABELS.RETURN}
            </p>
            {formatVietnamDateTime(currentStatusEvent?.changedAt) && (
              <p className="text-[11px] leading-4 text-violet-700">
                {formatVietnamDateTime(currentStatusEvent.changedAt)}
              </p>
            )}
            {currentStatusEvent?.note && (
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {currentStatusEvent.note}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderStatusTimeline;
