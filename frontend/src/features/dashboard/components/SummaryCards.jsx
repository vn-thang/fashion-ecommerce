import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock3,
  Truck,
  XCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

const cards = [
  {
    key: 'revenue',
    title: 'Doanh thu',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-600',
    isMoney: true
  },
  {
    key: 'totalOrders',
    title: 'Đơn hàng',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
    path: '/admin/sales/orders'
  },
  {
    key: 'newCustomers',
    title: 'Khách hàng mới',
    icon: Users,
    color: 'bg-violet-100 text-violet-600',
    path: '/admin/users'
  },
  {
    key: 'soldProducts',
    title: 'Sản phẩm đã bán',
    icon: Package,
    color: 'bg-orange-100 text-orange-600',
    path: '/admin/sales/orders'
  },
  {
    key: 'pendingOrders',
    title: 'Chờ xác nhận',
    icon: Clock3,
    color: 'bg-yellow-100 text-yellow-600',
    path: '/admin/orders',
    state: {
      status: 'PENDING'
    }
  },
  {
    key: 'shippingOrders',
    title: 'Đang giao',
    icon: Truck,
    color: 'bg-cyan-100 text-cyan-600',
    path: '/admin/orders',
    state: {
      status: 'SHIPPING'
    }
  },
  {
    key: 'cancelledOrders',
    title: 'Đã hủy',
    icon: XCircle,
    color: 'bg-red-100 text-red-600',
    path: '/admin/orders',
    state: {
      status: 'CANCELLED'
    }
  },
  {
    key: 'lowStockProducts',
    title: 'Sắp hết hàng',
    icon: AlertTriangle,
    color: 'bg-pink-100 text-pink-600',
    path: '/admin/products',
    state: {
      lowStock: true
    }
  }
];

const formatMoney = value =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value || 0);

const SummaryCards = ({ summary }) => {
  const navigate = useNavigate();

  const handleNavigate = card => {
    if (!card.path) return;

    navigate(card.path, {
      state: card.state || {}
    });
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            onClick={() => handleNavigate(card)}
            className={`
              group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
              transition-all duration-300
              ${
                card.path
                  ? 'cursor-pointer hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg'
                  : ''
              }
            `}
          >
            <div className="flex items-start justify-between">

              <div className="flex-1">

                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-3 break-words text-2xl font-bold text-slate-800">
                  {card.isMoney
                    ? formatMoney(summary?.[card.key])
                    : summary?.[card.key] ?? 0}
                </h3>

                {card.path && (
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span>Xem chi tiết</span>

                    <ChevronRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                )}
              </div>

              <div
                className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl
                  ${card.color}
                  transition-transform duration-300
                  group-hover:scale-110
                `}
              >
                <Icon size={26} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;