import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from 'recharts';

const COLORS = [
  '#F59E0B', 
  '#3B82F6', 
  '#8B5CF6', 
  '#10B981', 
  '#EC4899' 
];

const formatMoney = value =>
  new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value || 0);

const CategoryRevenueChart = ({
  data = [],
  loading
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Doanh thu theo danh mục
        </h2>

        <p className="text-sm text-gray-500">
          Top danh mục có doanh thu cao nhất.
        </p>
      </div>

      {loading ? (
        <div className="flex h-[330px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[330px] items-center justify-center text-gray-400">
          Không có dữ liệu.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={330}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 25,
              left: 25,
              bottom: 5
            }}
          >
            <CartesianGrid
              stroke="#E5E7EB"
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              tickFormatter={formatMoney}
              tick={{
                fontSize: 12,
                fill: '#475569'
              }}
              axisLine={{
                stroke: '#CBD5E1',
                strokeWidth: 1.5
              }}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{
                fontSize: 13,
                fill: '#334155',
                fontWeight: 500
              }}
              axisLine={{
                stroke: '#CBD5E1',
                strokeWidth: 1.5
              }}
              tickLine={false}
            />

            <Tooltip
              formatter={value => [
                new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  maximumFractionDigits: 0
                }).format(value),
                'Doanh thu'
              ]}
            />

            <Bar
              dataKey="revenue"
              radius={[0, 8, 8, 0]}
              barSize={22}
            >
              {data.map((item, index) => (
                <Cell
                  key={item.id}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryRevenueChart;