import React, { useState } from 'react';
import { useProfile } from '../../hooks/customer/useProfile';
import ProfileInfo from '../../components/customer/ProfileInfo';
import ChangePassword from '../../components/customer/ChangePassword';

const ProfilePage = () => {
  const { user, isLoading, isSubmitLoading, updateProfile } = useProfile();
  const [activeSection, setActiveSection] = useState('info');

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500 text-sm">Đang tải thông tin tài khoản...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex gap-6 border-b border-gray-100 mb-6">
        <button
          onClick={() => setActiveSection('info')}
          className={`pb-3 text-base font-medium transition-colors outline-none border-b-2 ${
            activeSection === 'info' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-gray-500 hover:text-[#ee4d2d]'
          }`}
        >
          Hồ sơ của tôi
        </button>
        <button
          onClick={() => setActiveSection('password')}
          className={`pb-3 text-base font-medium transition-colors outline-none border-b-2 ${
            activeSection === 'password' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-gray-500 hover:text-[#ee4d2d]'
          }`}
        >
          Đổi mật khẩu
        </button>
      </div>
      {activeSection === 'info' ? (
        <ProfileInfo user={user} onSave={updateProfile} isSubmitLoading={isSubmitLoading} />
      ) : (
        <ChangePassword />
      )}
    </div>
  );
};

export default ProfilePage;