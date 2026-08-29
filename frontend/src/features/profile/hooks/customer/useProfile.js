import { useState, useEffect } from 'react';
import { profileApi } from '../../api/profileApi';

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await profileApi.getProfile();
      setUser(response.data || response);
    } catch (error) {
      console.error('Lỗi khi tải thông tin cá nhân:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (formData, avatarFile) => {
    setIsSubmitLoading(true);
    try {
      await profileApi.updateProfile(formData);
      if (avatarFile) {
        const imageFormData = new FormData();
        
        imageFormData.append('avatar', avatarFile); 
        await profileApi.uploadAvatar(imageFormData);
      }

      alert('Cập nhật thông tin tài khoản thành công!');
      
      await fetchProfile(); 
      return true;
    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ!');
      return false;
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return { user, isLoading, isSubmitLoading, updateProfile, fetchProfile };
};