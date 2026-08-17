import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Crown,
  Users
} from 'lucide-react';

const formatPrice = value =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value || 0);

const getRankColor = rank => {
  switch (rank) {
    case 1:
      return 'bg-yellow-100 text-yellow-600';

    case 2:
      return 'bg-gray-200 text-gray-600';

    case 3:
      return 'bg-orange-100 text-orange-600';

    default:
      return 'bg-indigo-100 text-indigo-600';
  }
};

const CustomerSkeleton = () =>
  [...Array(5)].map((_, index) => (
    <div
      key={index}
      className="flex items-center gap-4 py-3 animate-pulse"
    >
      <div className="h-10 w-10 rounded-full bg-gray-200" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="h-3 w-28 rounded bg-gray-200" />
      </div>

      <div className="space-y-2 text-right">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-3 w-16 rounded bg-gray-200" />
      </div>
    </div>
  ));

const TopCustomers = ({
  customers = [],
  loading
}) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Top 5 khách hàng
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Khách hàng có tổng chi tiêu cao nhất.
          </p>
        </div>

        <Users
          size={22}
          className="text-indigo-600"
        />

      </div>

      <div className="px-6 py-2">

        {loading ? (
          <CustomerSkeleton />
        ) : customers.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-gray-400">
            Không có dữ liệu.
          </div>
        ) : (
          customers.map((customer, index) => (
            <button
              key={customer.id}
              onClick={() =>
                navigate(`/admin/users`)
              }
              className="group flex w-full items-center gap-4 border-b border-gray-100 py-4 text-left transition last:border-none hover:bg-gray-50"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${getRankColor(
                  index + 1
                )}`}
              >
                {index < 3 ? (
                  <Crown size={16} />
                ) : (
                  index + 1
                )}
              </div>

              <img
                src={
                  customer.avatarUrl ||
                  'https://ui-avatars.com/api/?background=6366f1&color=fff&name=' +
                    encodeURIComponent(customer.fullName)
                }
                alt={customer.fullName}
                className="h-12 w-12 rounded-full border border-gray-200 object-cover"
              />

              <div className="min-w-0 flex-1">

                <h3 className="truncate font-medium text-slate-800 transition group-hover:text-indigo-600">
                  {customer.fullName}
                </h3>

                <p className="truncate text-xs text-gray-400">
                  {customer.email}
                </p>

              </div>

              <div className="hidden text-right md:block">

                <div className="font-semibold text-emerald-600">
                  {formatPrice(customer.totalSpent)}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  {customer.totalOrders} đơn hàng
                </div>

              </div>

              <ChevronRight
                size={18}
                className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-500"
              />

            </button>
          ))
        )}

      </div>

    </div>
  );
};

export default TopCustomers;