import { useState } from 'react';

import UserHeader from '../../components/admin/UserHeader';
import UserFilter from '../../components/admin/UserFilter';
import UserTable from '../../components/admin/UserTable';
import UserDetailModal from '../../components/admin/UserDetailModal';
import UserStatusModal from '../../components/admin/UserStatusModal';

import { useAdminUser } from '../../hooks/admin/useAdminUser';

const UserPage = () => {
  const {
    users,
    selectedUser,
    filters,

    currentPage,
    totalPages,

    isLoading,

    handlePageChange,
    handleFilterChange,
    handleSearch,

    loadUserDetail,
    updateUserStatus
  } = useAdminUser();

  const [openDetail, setOpenDetail] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatusUser, setSelectedStatusUser] =
    useState(null);

const handleOpenDetail = async userId => {
  await loadUserDetail(userId);
  setOpenDetail(true);
};

  const handleOpenStatus = user => {
    setSelectedStatusUser(user);
    setOpenStatus(true);
  };

  const handleConfirmStatus = async isActive => {
    const success = await updateUserStatus(
      selectedStatusUser.id,
      isActive
    );

    if (success) {
      setOpenStatus(false);
      setSelectedStatusUser(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      <UserHeader />

      <UserFilter
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

     <UserTable
  users={users}
  isLoading={isLoading}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  onView={handleOpenDetail}
  onToggleStatus={handleOpenStatus} 
/>

   <UserDetailModal
  isOpen={openDetail}
  onClose={() => setOpenDetail(false)}
  user={selectedUser}
/>

<UserStatusModal
  isOpen={openStatus}
  user={selectedStatusUser}
  onClose={() => {
    setOpenStatus(false);
    setSelectedStatusUser(null);
  }}
  onConfirm={handleConfirmStatus}
/>

    </div>
  );
};

export default UserPage;