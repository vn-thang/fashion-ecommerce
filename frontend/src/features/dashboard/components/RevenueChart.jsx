import React from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const formatMoney = value =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value || 0);

const formatDate = value => {
  if (!value) return '';

  const date = new Date(value);

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  });
};

const formatYAxis = value => {
  if (value >= 1000000000)
    return `${(value / 1000000000).toFixed(1)} Tỷ`;

  if (value >= 1000000)
    return `${(value / 1000000).toFixed(1)} Tr`;

  if (value >= 1000)
    return `${(value / 1000).toFixed(0)} K`;

  return value;
};

const RevenueChart = ({
  data = [],
  loading
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Biểu đồ doanh thu
        </h2>

        <p className="text-sm text-gray-500">
          Doanh thu theo thời gian
        </p>
      </div>

      {loading ? (
        <div className="flex h-[360px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[360px] items-center justify-center text-gray-400">
          Không có dữ liệu.
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={360}
        >
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 10
            }}
          >
           <CartesianGrid
  stroke="#d1d5db"
  strokeDasharray="4 4"
/>

<XAxis
  dataKey="date"
  tickFormatter={formatDate}
  tick={{
    fontSize: 12,
    fill: '#374151',
    fontWeight: 600
  }}
  axisLine={{
    stroke: '#6b7280',
    strokeWidth: 2
  }}
  tickLine={{
    stroke: '#6b7280',
    strokeWidth: 2
  }}
/>

<YAxis
  tickFormatter={formatYAxis}
  tick={{
    fontSize: 12,
    fill: '#374151',
    fontWeight: 600
  }}
  axisLine={{
    stroke: '#6b7280',
    strokeWidth: 2
  }}
  tickLine={{
    stroke: '#6b7280',
    strokeWidth: 2
  }}
/>

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{
                fontSize: 12
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 'dataMax']}
              tickCount={6}
              tickFormatter={formatYAxis}
              tick={{
                fontSize: 12
              }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={value => formatMoney(value)}
              labelFormatter={value =>
                new Date(value).toLocaleDateString(
                  'vi-VN'
                )
              }
              contentStyle={{
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                boxShadow:
                  '0 4px 12px rgba(0,0,0,.08)'
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: '#fff'
              }}
              activeDot={{
                r: 7
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;