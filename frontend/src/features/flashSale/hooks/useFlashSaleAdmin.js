import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { flashSaleApi } from '../api/flashSaleApi';

export const useFlashSaleAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [flashSales, setFlashSales] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    upcoming: 0,
    finished: 0
  });

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState(null);

  const fetchFlashSales = useCallback(async (page = 1) => {
    setLoading(true);

    try {
      const res = await flashSaleApi.getAll({
        page,
        limit: 10,
        search
      });

      const data = res.data || res;
      const list = data.flashSales || [];

      setFlashSales(list);
      setCurrentPage(page);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);

      setStats({
        total: data.pagination?.totalItems || 0,
        running: list.filter(i => i.status === 'Đang diễn ra').length,
        upcoming: list.filter(i => i.status === 'Sắp diễn ra').length,
        finished: list.filter(i => i.status === 'Đã kết thúc').length
      });
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách Flash Sale');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchFlashSales(currentPage);
  }, [fetchFlashSales, currentPage]);

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = keyword => {
    setSearch(keyword);
    setCurrentPage(1);
  };

  const handleDisable = async id => {
    try {
      await flashSaleApi.disable(id);
      toast.success('Đã ngừng hoạt động Flash Sale');
      fetchFlashSales(currentPage);
    } catch (error) {
      console.error(error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const openCreate = () => {
    setEditingFlashSale(null);
    setIsFormOpen(true);
  };

  const openEdit = flashSale => {
    setEditingFlashSale(flashSale);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingFlashSale(null);
    setIsFormOpen(false);
  };

  return {
    loading,
    flashSales,
    stats,
    search,
    currentPage,
    totalPages,
    totalItems,

    isFormOpen,
    editingFlashSale,

    handleSearch,
    handlePageChange,
    handleDisable,

    openCreate,
    openEdit,
    closeForm,

    refreshFlashSales: fetchFlashSales
  };
};