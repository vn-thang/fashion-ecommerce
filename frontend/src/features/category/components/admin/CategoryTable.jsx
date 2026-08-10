import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const CategoryTable = ({
  loading,
  categories = [],
  pagination = {},
  onPageChange,
  onEdit,
  onDeactivate,
  onActivate
}) => {
  const buildTree = (parentId = null, level = 0) => {
    return categories
      .filter(item => (item.parentId || null) === parentId)
      .flatMap(item => [
        { ...item, level },
        ...buildTree(item.id, level + 1)
      ]);
  };

  const treeData = buildTree();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-sm text-gray-500">
        Đang tải danh sách danh mục...
      </div>
    );
  }

  if (treeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-4xl">📁</span>

        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          Chưa có danh mục
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Hiện chưa có danh mục nào trong hệ thống.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Danh mục
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Slug
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Mô tả
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Trạng thái
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {treeData.map(category => {
              const isActive = category.status === 'ACTIVE';

              return (
                <tr
                  key={category.id}
                  className={`transition ${
                    isActive
                      ? 'hover:bg-slate-50'
                      : 'bg-slate-50/70'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center font-medium ${
                        isActive
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                      style={{
                        paddingLeft: `${category.level * 28}px`
                      }}
                    >
                      {category.level === 0 ? (
                        <span
                          className={`mr-2 ${
                            isActive ? '' : 'opacity-50'
                          }`}
                        >
                          📁
                        </span>
                      ) : (
                        <span className="mr-2 text-gray-300">
                          └─
                        </span>
                      )}

                      <span className={!isActive ? 'opacity-60' : ''}>
                        {category.name}
                      </span>
                    </div>
                  </td>

                  <td
                    className={`px-6 py-4 ${
                      !isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                      {category.slug}
                    </span>
                  </td>

                  <td
                    className={`max-w-sm truncate px-6 py-4 text-sm ${
                      isActive
                        ? 'text-gray-500'
                        : 'text-gray-400 opacity-60'
                    }`}
                  >
                    {category.description || (
                      <span className="italic text-gray-300">
                        Không có mô tả
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                          : 'border-slate-200 bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isActive
                        ? '● Đang hoạt động'
                        : '○ Đã ẩn'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(category)}
                      >
                        ✏️ Sửa
                      </Button>

                      {isActive ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600 hover:bg-rose-50"
                          onClick={() => onDeactivate(category.id)}
                        >
                          Ẩn
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-600 hover:bg-emerald-50 opacity-100"
                          onClick={() => onActivate(category.id)}
                        >
                          Hiện lại
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage || 1}
        totalPages={pagination.totalPages || 1}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default CategoryTable;