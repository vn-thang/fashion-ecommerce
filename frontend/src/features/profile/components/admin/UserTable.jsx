import React from 'react';
import Button from '../../../../shared/components/Button';

const UserTable = ({
  users,
  onView,
  onToggleStatus,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left">
              <th className="px-5 py-4">Khách hàng</th>
              <th className="px-5 py-4">Vai trò</th>
              <th className="px-5 py-4">Điểm</th>
              <th className="px-5 py-4">Đơn hàng</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  Không có khách hàng.
                </td>
              </tr>
            )}

            {users.map(user => (
              <tr
                key={user.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.avatarUrl ||
                        'https://placehold.co/60x60'
                      }
                      alt=""
                      className="w-11 h-11 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold">
                        {user.fullName || '---'}
                      </p>

                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>

                      <p className="text-xs text-gray-400">
                        {user.phoneNumber || '---'}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {user.role}
                </td>

                <td className="px-5 py-4">
                  {user.totalPoints}
                </td>

                <td className="px-5 py-4">
                  {user._count?.orders || 0}
                </td>

                <td className="px-5 py-4">
                  {user.isActive ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      Đã khóa
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(user.id)}
                    >
                      Chi tiết
                    </Button>

                    <Button
                      size="sm"
                      variant={
                        user.isActive
                          ? 'danger'
                          : 'secondary'
                      }
                      onClick={() =>
                        onToggleStatus(user)
                      }
                    >
                      {user.isActive
                        ? 'Khóa'
                        : 'Mở khóa'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-5 border-t">
          {Array.from(
            { length: totalPages },
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  onPageChange(i + 1)
                }
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default UserTable;