import React from 'react';

const STEPS = [
  { status: 'REQUESTED', label: 'Đã gửi yêu cầu' },
  { status: 'APPROVED', label: 'Đã duyệt' },
  { status: 'SHIPPING', label: 'Đang gửi hàng' },
  { status: 'RECEIVED', label: 'Đã nhận hàng' },
  { status: 'COMPLETED', label: 'Hoàn tiền hoàn tất' }
];

const ReturnTimeline = ({ status }) => {
  if (status === 'REJECTED') {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="font-semibold text-red-700">Yêu cầu đã bị từ chối</div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex(
    step => step.status === status
  );

  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const completed = index <= currentIndex;
        const current = step.status === status;

        return (
          <div key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  completed
                    ? 'bg-orange-500 text-white'
                    : 'border border-gray-300 bg-white text-gray-400'
                }`}
              >
                {completed ? '✓' : index + 1}
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`h-10 w-px ${
                    index < currentIndex
                      ? 'bg-orange-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>

            <div className="pb-5">
              <div
                className={`text-sm font-semibold ${
                  current
                    ? 'text-orange-600'
                    : completed
                    ? 'text-gray-800'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </div>

              {current && (
                <div className="mt-1 text-xs text-gray-500">
                  Trạng thái hiện tại
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReturnTimeline;