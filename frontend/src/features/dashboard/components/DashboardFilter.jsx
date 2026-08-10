import React from 'react';
import Button from '../../../shared/components/Button';

const PRESETS = [
  {
    label: 'Hôm nay',
    value: 'today'
  },
  {
    label: '7 ngày',
    value: '7days'
  },
  {
    label: '30 ngày',
    value: '30days'
  },
  {
    label: 'Tháng này',
    value: 'month'
  },
  {
    label: 'Năm nay',
    value: 'year'
  }
];

const DashboardFilter = ({
  filters,
  onChange,
  onApply
}) => {
  const handlePresetChange = value => {
    onChange('range', value);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Khoảng thời gian
          </p>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map(item => (
              <button
                key={item.value}
                type="button"
                onClick={() =>{
                  handlePresetChange(item.value)
                } }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition
                  ${
                    filters.range === item.value
                      ? 'bg-indigo-600 text-white shadow'
                      : 'border border-gray-300 bg-white text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Từ ngày
            </label>

            <input
              type="date"
              value={filters.startDate}
              onChange={e =>
                onChange(
                  'startDate',
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Đến ngày
            </label>

            <input
              type="date"
              value={filters.endDate}
              onChange={e =>
                onChange(
                  'endDate',
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <Button onClick={onApply}>
            Áp dụng
          </Button>

        </div>
      </div>
    </div>
  );
};

export default DashboardFilter;