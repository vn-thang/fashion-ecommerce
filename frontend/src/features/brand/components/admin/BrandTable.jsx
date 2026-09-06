import React from 'react';
import Button from '../../../../shared/components/Button';
import Pagination from '../../../../shared/components/Pagination';

const BrandTable = ({ brands = [], loading, pagination, onEdit, onDeactivate, onActivate, onPageChange }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-500">
        Đang tải danh sách thương hiệu...
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="text-2xl mb-3">🏷️</div>
        <p className="font-medium">Không tìm thấy thương hiệu nào.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100 text-xs uppercase tracking-wider text-slate-600">
              <th className="px-6 py-4 w-28">Logo</th>
              <th className="px-6 py-4 text-left">Tên thương hiệu</th>
              <th className="px-6 py-4 text-left">Slug</th>
              <th className="px-6 py-4 text-left">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right w-48">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brands.map(brand => {
              const isActive = brand.status === 'ACTIVE';

              return (
                <tr key={brand.id} className={`transition-colors ${isActive ? 'hover:bg-slate-50' : 'bg-slate-50/70'}`}>
                  <td className={`px-6 py-4 ${!isActive ? 'opacity-50' : ''}`}>
                    <div className="w-12 h-12 rounded-xl border bg-slate-50 p-2 flex items-center justify-center">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-300">🖼️</span>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${!isActive ? 'opacity-50' : ''}`}>
                    <p className="font-semibold text-slate-800">{brand.name}</p>
                  </td>
                  <td className={`px-6 py-4 ${!isActive ? 'opacity-50' : ''}`}>
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono">{brand.slug}</span>
                  </td>
                  <td className={`px-6 py-4 text-gray-500 ${!isActive ? 'opacity-50' : ''}`}>
                    {new Date(brand.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {isActive ? '● Đang hoạt động' : '○ Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm"  onClick={() => onEdit(brand)}>
                       ✏️ Sửa
                      </Button>
                      {isActive ? (
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => onDeactivate(brand.id)}>
                          Ẩn
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50" onClick={() => onActivate(brand.id)}>
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
      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-100">
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default BrandTable;

