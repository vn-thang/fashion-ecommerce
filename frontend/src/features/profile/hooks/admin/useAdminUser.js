import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminUserApi } from '../../api/adminUserApi';

export const useAdminUser = () => {
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    keyword: '',
    role: '',
    isActive: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async (
    page = currentPage,
    customFilters = filters
  ) => {
    setIsLoading(true);

    try {
      const res = await adminUserApi.getAll({
        page,
        limit: 10,
        keyword: customFilters.keyword,
        role: customFilters.role,
        isActive: customFilters.isActive
      });

      if (res.success) {
        setUsers(res.data.users || []);

        if (res.data.pagination) {
          setCurrentPage(res.data.pagination.currentPage);
          setTotalPages(res.data.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
        'Không tải được danh sách khách hàng!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers(1, filters);
  };

  const loadUserDetail = async userId => {
    try {
      const res = await adminUserApi.getById(userId);

      if (res.success) {
        setSelectedUser(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
        'Không tải được thông tin khách hàng!'
      );
    }
  };

  const updateUserStatus = async (
    userId,
    isActive
  ) => {
    try {
      await adminUserApi.updateStatus(
        userId,
        isActive
      );

      toast.success(
        'Cập nhật trạng thái thành công!'
      );

      loadUsers(currentPage, filters);

      if (
        selectedUser &&
        selectedUser.id === userId
      ) {
        loadUserDetail(userId);
      }

      return true;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        'Cập nhật trạng thái thất bại!'
      );

      return false;
    }
  };

  return {
    users,
    selectedUser,
    filters,

    currentPage,
    totalPages,

    isLoading,

    handlePageChange,
    handleFilterChange,
    handleSearch,

    loadUsers,
    loadUserDetail,
    updateUserStatus
  };
};