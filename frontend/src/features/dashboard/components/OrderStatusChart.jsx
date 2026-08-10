import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#f59e0b',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#ef4444',
  '#8b5cf6'
];

const OrderStatusChart = ({
  data = {},
  loading
}) => {
  const chartData = [
    {
      name: 'Chờ xác nhận',
      value: data.pending || 0
    },
    {
      name: 'Đang xử lý',
      value: data.processing || 0
    },
    {
      name: 'Đang giao',
      value: data.shipping || 0
    },
    {
      name: 'Hoàn thành',
      value: data.completed || 0
    },
    {
      name: 'Đã hủy',
      value: data.cancelled || 0
    },
    {
      name: 'Hoàn trả',
      value: data.returned || 0
    }
  ];

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Trạng thái đơn hàng
        </h2>

        <p className="text-sm text-gray-500">
          Phân bố đơn hàng theo trạng thái
        </p>
      </div>

      {loading ? (
        <div className="flex h-[420px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : total === 0 ? (
        <div className="flex h-[420px] items-center justify-center text-gray-400">
          Không có dữ liệu
        </div>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="52%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={2}
                label={({ percent }) =>
                  percent > 0
                    ? `${(percent * 100).toFixed(0)}%`
                    : ''
                }
                labelLine={false}
              >
                {chartData.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={value => [
                  `${value} đơn`,
                  'Số lượng'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-3 gap-y-3 gap-x-4">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    background:
                      COLORS[index]
                  }}
                />

                <span className="text-gray-700">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderStatusChart;