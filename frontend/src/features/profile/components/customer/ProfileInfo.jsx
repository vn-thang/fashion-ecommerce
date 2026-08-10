import React, { useState, useEffect } from 'react';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';
import ImageUpload from '../../../../shared/components/ImageUpload'; 

const ProfileInfo = ({ user, onSave, isSubmitLoading }) => {
  const [formData, setFormData] = useState({
  fullName: '', email: '', phone: '', gender: 'male', dob: ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'male',
        dob: user.dob ? user.dob.substring(0, 10) : '' 
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, avatarFile);
  };

  return (
    <div className="text-left">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-800">Hồ sơ của tôi</h3>
        <p className="text-sm text-gray-500 mt-0.5">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col-reverse md:flex-row gap-8">
    
        <div className="flex-1 space-y-4 max-w-xl"> 
          <Input
            label="Họ và tên"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Nhập họ và tên của bạn"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-50 cursor-not-allowed text-gray-500"
            placeholder="Email tài khoản"
          />

          <Input
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Nhập số điện thoại"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Giới tính</label>
            <div className="flex items-center gap-6 pt-1">
              {['male', 'female', 'other'].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer capitalize">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 accent-[#ee4d2d]"
                  />
                  {g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'}
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Ngày sinh"
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitLoading}
              className="bg-[#ee4d2d] hover:bg-[#d74123] text-white px-6 border-none"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
        <div className="w-full md:w-64 shrink-0 flex flex-col items-center justify-start border-0 md:border-l border-gray-100 pl-0 md:pl-8 pt-4 mb-8 md:mb-0">
          
          <ImageUpload 
            className="w-auto mx-auto" 
            imageClassName="w-56 h-56 md:w-64 md:h-64 rounded-full" 
            initialImage={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0D8ABC&color=fff&size=200`}
              onChange={(file) => setAvatarFile(file)}
            compress={true}
            helperText="Dung lượng tối đa 1 MB. Định dạng: .JPEG, .PNG"
          />

        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;